import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    console.log('SOS Request - User:', user?.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { latitude, longitude } = await request.json()
    console.log('SOS Request - Location:', { latitude, longitude })
    
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

    console.log('SOS Request - Profile data:', profile)
    console.log('SOS Request - Profile error:', error)

    if (error || !profile) throw error

    // Get emergency contacts - use legacy single contact format
    let emergencyContacts = [];
    if (profile.emergency_contact_name && profile.emergency_contact_phone) {
      emergencyContacts = [{
        name: profile.emergency_contact_name,
        phone: profile.emergency_contact_phone
      }];
    }

    console.log('SOS Request - Emergency contacts:', emergencyContacts)

    // Validate the profile actually has emergency contacts configured
    if (emergencyContacts.length === 0) {
        console.log('SOS Request - No emergency contacts found')
        return NextResponse.json({
            success: false,
            error: "Emergency contacts not configured in Profile."
        }, { status: 400 })
    }

    const patientName = user.user_metadata?.full_name || user.user_metadata?.name || 'A user';
    console.log('SOS Request - Patient name:', patientName)
    
    // Send SOS to all emergency contacts via send-sms API
    const sosPromises = emergencyContacts.map(async (contact) => {
      const helpMessage = `URGENT SOS: Hello ${contact.name}, ${patientName} has pressed their emergency help button on HealthBuddy and may need immediate assistance. Please contact them. Location: ${locationInfo}`;
      
      // Format phone number with country code (assuming Indian numbers)
      const formattedPhone = contact.phone.startsWith('+') ? contact.phone : `+91${contact.phone}`;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formattedPhone,
            message: helpMessage
          }),
        });
        const data = await response.json();
        console.log(`SOS sent to ${contact.name} (${contact.phone}):`, data);
        return data;
      } catch (error) {
        console.error(`Failed to send SOS to ${contact.name}:`, error);
        return { success: false, error: error.message };
      }
    });

    // Wait for all SOS messages to be sent
    const results = await Promise.all(sosPromises);

    console.log('SOS Request - Successfully dispatched')
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
