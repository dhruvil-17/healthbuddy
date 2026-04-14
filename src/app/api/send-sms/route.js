import { NextResponse } from "next/server";
import twilio from "twilio";

// Validate required environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.warn('Twilio credentials not configured. SMS will be mocked.');
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

    console.log('SMS sent successfully:', sms.sid);
    return NextResponse.json({ success: true, sid: sms.sid });
  } catch (err) {
    console.error('Twilio error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to send SMS',
        code: err.code,
        status: err.status
      },
      { status: 500 }
    );
  }
}