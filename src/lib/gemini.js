import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


/**
 * Generic function to generate structured (JSON) content from Gemini.
 * @param {string} prompt - The prompt to send to Gemini.
 * @param {string} modelName - Gemini model to use (default: gemini-2.0-flash).
 * @returns {Promise<Object>} - Parsed JSON object.
 */
export const generateStructuredAI = async (prompt, modelName = "gemini-2.0-flash") => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ 
    model: modelName,
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Improved JSON cleaning and parsing
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      console.error(`Gemini Quota Exceeded [${modelName}]. Please check your API billing or wait for reset.`);
      const quotaError = new Error("AI service is temporarily reaching its capacity/quota. Please try again in a few minutes.");
      quotaError.status = 429;
      throw quotaError;
    }
    console.error(`Gemini generation failed [${modelName}]:`, error);
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
