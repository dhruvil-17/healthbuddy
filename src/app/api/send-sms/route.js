import { NextResponse } from "next/server";
import twilio from "twilio";

// Check if Twilio credentials are configured
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.warn('Twilio credentials not configured. SMS will not be sent.');
}

const client = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN 
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to and message' },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    if (!client || !TWILIO_PHONE_NUMBER) {
      console.log('SMS Mock - Twilio not configured:', { to, message });
      return NextResponse.json({ 
        success: true, 
        sid: 'mock-sms-id',
        mock: true,
        message: 'SMS mocked - Twilio credentials not configured'
      });
    }

    const sms = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to,
    });

    return NextResponse.json({ success: true, sid: sms.sid });
  } catch (err) {
    console.error('SMS Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}