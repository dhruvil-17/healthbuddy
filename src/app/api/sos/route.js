import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'
import { sendSOSMessage } from '@/utils/smsService'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { latitude, longitude } = await request.json()
    
    // Safety check for valid coordinates logic
    const locationInfo = (latitude && longitude) 
        ? `https://www.google.com/maps?q=${latitude},${longitude}` 
        : "Location blocked or unavailable.";

    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('emergency_contact_name, emergency_contact_phone')
      .eq('id', user.id)
      .single()

    if (error || !profile) throw error

    // Validate the profile actually has an emergency contact configured
    if (!profile.emergency_contact_phone) {
        return NextResponse.json({
            success: false,
            error: "Emergency contact not configured in Profile."
        }, { status: 400 })
    }

    const patientName = profile.full_name || user.user_metadata?.full_name || 'A user';
    const emergencyName = profile.emergency_contact_name || 'Emergency Contact';
    
    const helpMessage = `URGENT SOS: Hello ${emergencyName}, ${patientName} has pressed their emergency help button on HealthCare+ and may need immediate assistance. Please contact them. Location: ${locationInfo}`;

    // Dispatch via our SMS utilities (which leverages Twilio/Mocking depending on config)
    await sendSOSMessage(profile.emergency_contact_phone, helpMessage);

    return NextResponse.json({
      success: true,
      message: "SOS signal successfully dispatched."
    })

  } catch (error) {
    console.error('Error dispatching SOS:', error)
    return NextResponse.json(
      { error: 'Failed to dispatch SOS signal.' },
      { status: 500 }
    )
  }
}
