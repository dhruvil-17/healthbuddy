import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'

// Get current user profile
export async function GET(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id) // Session-based retrieval
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json({
      success: true,
      data: profile || null
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// Create or Update user profile
export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profileData = await request.json()
    const supabase = await createClient()

    // Enforce data consistency and security
    const cleanProfile = {
      id: user.id, // Derived from session, NEVER from request body
      age: profileData.age ? parseInt(profileData.age) : null,
      gender: profileData.gender || null,
      location: profileData.location?.trim() || null,
      preferred_language: profileData.preferred_language || profileData.language || 'English',
      // Legacy single emergency contact fields (emergency_contacts array not supported in current schema)
      emergency_contact_name: Array.isArray(profileData.emergency_contacts) && profileData.emergency_contacts.length > 0
        ? profileData.emergency_contacts[0].name
        : profileData.emergency_contact_name?.trim() || null,
      emergency_contact_phone: Array.isArray(profileData.emergency_contacts) && profileData.emergency_contacts.length > 0
        ? profileData.emergency_contacts[0].phone
        : profileData.emergency_contact_phone?.trim() || null,
      existing_conditions: Array.isArray(profileData.existing_conditions || profileData.conditions)
        ? (profileData.existing_conditions || profileData.conditions)
        : [],
      updated_at: new Date().toISOString()
    }

    // Upsert the profile (IDOR-safe because user.id is session-verified)
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert(cleanProfile)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: profile
    })

  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
