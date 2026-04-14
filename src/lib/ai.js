/**
 * Generic function to generate structured (JSON) content from AI via OpenRouter.
 * @param {string} prompt - The prompt to send.
 * @param {string} modelName - OpenRouter model to use (default: google/gemini-2.0-flash-exp:free).
 * @returns {Promise<Object>} - Parsed JSON object.
 */
export const generateStructuredAI = async (prompt, modelName = "openai/gpt-4o-mini") => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured. AI features will not work.');
    throw new Error("OpenRouter API key is missing");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://healthbuddy.ai", // Required for OpenRouter
        "X-Title": "HealthBuddy AI Assistant", // Required for OpenRouter
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" } // Enforce JSON for compatible models
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("429: AI service is temporarily reaching its capacity/quota. Please try again in a few minutes.");
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter Error ${response.status}: ${errData.error?.message || "Unknown Error"}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "";
    
    // Improved JSON cleaning and parsing
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      const quotaError = new Error("AI service is temporarily reaching its capacity/quota. Please try again in a few minutes.");
      quotaError.status = 429;
      throw quotaError;
    }
    throw error;
  }
};

export const analyzeSymptoms = async (symptoms, profile) => {
  const prompt = `As a professional healthcare AI assistant, analyze the following medical symptoms.
  
Patient Context:
- Age: ${profile?.age || "Not specified"}
- Gender: ${profile?.gender || "Not specified"}
- Existing Conditions: ${profile?.existing_conditions?.join(", ") || "None specified"}
- Preferred Language: ${profile?.preferred_language || "English"}

Symptoms: "${symptoms}"

IMPORTANT:
1. If the input is NOT a medical symptom (e.g., greetings, random text, test strings), set "isValidSymptom": false.
2. Provide specific, actionable advice.
3. Assess severity carefully: "low", "medium", "high", or "emergency".

Respond ONLY with a valid JSON object in this format:
{
  "isValidSymptom": true,
  "possibleConditions": ["Condition Name (Brief Explanation)", ...],
  "severity": "low|medium|high|emergency",
  "recommendations": {
    "immediate": ["What to do right now", ...],
    "general": ["Lifestyle or over-the-counter advice", ...],
    "whenToSeekHelp": "Specific triggers for visiting a doctor"
  },
  "warningSigns": ["Red flags for emergency care", ...],
  "disclaimer": "This analysis is AI-generated for informational purposes and is not a substitute for professional medical advice."
}`;

  return generateStructuredAI(prompt);
};
