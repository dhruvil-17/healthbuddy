import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'
import { generateStructuredAI } from '@/lib/ai'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { category } = await request.json()
    const supabase = await createClient()

    // Fetch user profile safely from the session-validated user
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found. Please complete onboarding.' },
        { status: 404 }
      )
    }

    // Build the specialized prompt for the category
    const prompt = `As a healthcare AI assistant, provide personalized health tips ONLY for the ${category || 'general'} category for a patient with the following profile:

Patient Context:
- Age: ${profile.age || 'Not specified'}
- Gender: ${profile.gender || 'Not specified'}
- Existing Conditions: ${profile.existing_conditions?.join(', ') || 'None specified'}
- Location: ${profile.location || 'Not specified'}

Please provide health tips in JSON format EXCLUSIVELY for the ${category || 'general'} category with the following structure:

${
  (category === 'general' || !category) ? `{
  "generalTips": [
    {
      "title": "tip title",
      "description": "detailed tip description",
      "category": "diet|exercise|lifestyle|medication|monitoring",
      "priority": "high|medium|low"
    }
  ],
  "warningSignsToWatch": ["warning sign 1", "warning sign 2"],
  "disclaimer": "medical disclaimer"
}` : ''
}

${
  category === 'diet' ? `{
  "dietaryRecommendations": {
    "recommended": ["food 1", "food 2"],
    "avoid": ["food 1", "food 2"],
    "mealPlan": {
      "breakfast": "suggestion",
      "lunch": "suggestion",
      "dinner": "suggestion",
      "snacks": "suggestion"
    }
  },
  "disclaimer": "medical disclaimer"
}` : ''
}

${
  category === 'exercise' ? `{
  "exerciseGuidelines": {
    "recommended": ["exercise 1", "exercise 2"],
    "avoid": ["exercise 1", "exercise 2"],
    "duration": "recommended duration",
    "frequency": "recommended frequency"
  },
  "disclaimer": "medical disclaimer"
}` : ''
}

${
  category === 'mental' ? `{
  "lifestyleModifications": [
    {
      "category": "stress|mindfulness|habits",
      "recommendation": "specific advice",
      "implementation": "how to implement"
    }
  ],
  "disclaimer": "medical disclaimer"
}` : ''
}

${
  category === 'preventive' ? `{
  "conditionSpecificTips": [
    {
      "condition": "condition name",
      "tips": [
        {
          "title": "preventive measure",
          "description": "detailed description"
        }
      ]
    }
  ],
  "monitoringAdvice": [
    {
      "parameter": "what to monitor",
      "frequency": "how often",
      "normalRange": "normal values",
      "whenToAlert": "when to seek help"
    }
  ],
  "disclaimer": "medical disclaimer"
}` : ''
}

Focus on:
1. Practical, actionable tips specifically for ${category || 'general'}
2. Cultural and regional considerations for ${profile.location || 'their location'}
3. Age and gender-appropriate recommendations
4. Integration of existing conditions if relevant

Be specific and practical.`;

    const aiResponse = await generateStructuredAI(prompt)

    // Save to database (session-restored user ID ensures security)
    const { data: savedTips, error: saveError } = await supabase
      .from('health_tips_history')
      .insert([
        {
          user_id: user.id,
          tips_data: aiResponse,
          category: category || 'general'
        }
      ])
      .select()
      .single()

    if (saveError) {
      console.error('Error saving health tips:', saveError)
    }

    return NextResponse.json({
      success: true,
      data: aiResponse,
      tipId: savedTips?.id
    })

  } catch (error) {
    console.error('Health tips API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate health tips' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    const supabase = await createClient()

    const { data: tips, error } = await supabase
      .from('health_tips_history')
      .select('*')
      .eq('user_id', user.id) // Strict session-based filter
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: tips
    })

  } catch (error) {
    console.error('Error fetching health tips history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health tips history' },
      { status: 500 }
    )
  }
}