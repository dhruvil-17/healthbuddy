import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'
import { analyzeSymptoms } from '@/lib/gemini'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { symptoms } = await request.json()
    const supabase = await createClient()

    if (!symptoms) {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      )
    }

    // Get user profile for context - strictly session-validated
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Analyze symptoms using centralized AI logic
    const aiResponse = await analyzeSymptoms(symptoms, profile)

    if (!aiResponse.isValidSymptom) {
      return NextResponse.json({ 
        error: 'Please describe actual medical symptoms',
        isInvalid: true 
      }, { status: 422 })
    }

    // Save to history (IDOR protected)
    const { data: savedCheck, error: saveError } = await supabase
      .from('symptom_checks')
      .insert({
        user_id: user.id,
        symptoms_description: symptoms,
        ai_response: aiResponse,
        severity_level: aiResponse.severity,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Database save error:', saveError)
    }

    return NextResponse.json({
      success: true,
      data: aiResponse,
      checkId: savedCheck?.id
    })

  } catch (error) {
    console.error('Symptom checker error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const { data: checks, error } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('user_id', user.id) // Session-based restricted access
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: checks
    })

  } catch (error) {
    console.error('Error fetching symptom history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}