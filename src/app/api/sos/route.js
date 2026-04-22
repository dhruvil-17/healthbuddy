import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'

// Validate required environment variables
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn('NEXT_PUBLIC_BASE_URL not configured, using default: http://localhost:3000');
}

// Simple in-memory rate limiter to prevent SOS abuse
// In production, use Redis or a proper rate limiting service
const sosRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_SOS_PER_WINDOW = 1; // Max 1 SOS per minute per user

// Helper function to format phone number to E.164 standard
// Note: This assumes Indian numbers (+91) by default. For international support,
// users should enter phone numbers with their country code in the profile.
const formatPhoneNumber = (phone) => {
  // If already in E.164 format (starts with +), return as-is
  if (phone.startsWith('+')) {
    return phone;
  }
  // If it's a 10-digit number, assume Indian and add +91
  if (phone.length === 10 && /^\d+$/.test(phone)) {
    return `+91${phone}`;
  }
  // Otherwise, try to use as-is (may fail with Twilio)
  return phone;
};

// Rate limiter check function
const checkRateLimit = (userId) => {
  const now = Date.now();
  const userRequests = sosRateLimit.get(userId) || [];

  // Filter out requests older than the rate limit window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_SOS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  // Add current request timestamp
  recentRequests.push(now);
  sosRateLimit.set(userId, recentRequests);

  // Clean up old entries periodically (optional optimization)
  if (Math.random() < 0.01) {
    for (const [uid, timestamps] of sosRateLimit.entries()) {
      const filtered = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
      if (filtered.length === 0) {
        sosRateLimit.delete(uid);
      } else {
        sosRateLimit.set(uid, filtered);
      }
    }
  }

  return true; // Request allowed
};

export async function POST(request) {
  try {
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Too many SOS requests. Please wait before trying again.' },
        { status: 429 }
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

    // Get emergency contacts - use legacy single contact format
    let emergencyContacts = [];
    if (profile.emergency_contact_name && profile.emergency_contact_phone) {
      emergencyContacts = [{
        name: profile.emergency_contact_name,
        phone: profile.emergency_contact_phone
      }];
    }

    // Validate the profile actually has emergency contacts configured
    if (emergencyContacts.length === 0) {
        return NextResponse.json({
            success: false,
            error: "Emergency contacts not configured in Profile."
        }, { status: 400 })
    }

    const patientName = user.user_metadata?.full_name || user.user_metadata?.name || 'A user';
    
    // Send SOS to all emergency contacts via send-sms API
    const sosPromises = emergencyContacts.map(async (contact) => {
      const helpMessage = `URGENT SOS: Hello ${contact.name}, ${patientName} has pressed their emergency help button on HealthBuddy and may need immediate assistance. Please contact them. Location: ${locationInfo}`;

      // Format phone number to E.164 standard
      const formattedPhone = formatPhoneNumber(contact.phone);

      try {
        const response = await fetch(`${BASE_URL}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formattedPhone,
            message: helpMessage
          }),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Wait for all SOS messages to be sent
    const results = await Promise.all(sosPromises);

    // Check if any SMS was mocked (Twilio not configured)
    const mockResponses = results.filter(r => r.mock);
    if (mockResponses.length > 0) {
      return NextResponse.json({
        success: false,
        error: "SMS service not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your environment variables.",
        mock: true
      }, { status: 500 });
    }

    // Check if any SMS failed
    const failedResponses = results.filter(r => !r.success);
    if (failedResponses.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Failed to send SOS SMS. Details: ${failedResponses.map(r => r.error || 'Unknown error').join(', ')}`,
        details: failedResponses
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "SOS signal successfully dispatched."
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to dispatch SOS signal.' },
      { status: 500 }
    )
  }
}
