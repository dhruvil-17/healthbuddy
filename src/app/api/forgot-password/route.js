import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get the base URL for the redirect URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectTo = `${baseUrl}/reset-password`;

    // Send password reset email using Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('Password reset error:', error);
      
      // Check if it's an email not found error (security: don't reveal)
      if (error.message?.toLowerCase().includes('email') || 
          error.message?.toLowerCase().includes('user') ||
          error.message?.toLowerCase().includes('not found')) {
        // For security, still return success even if email doesn't exist
        // This prevents email enumeration attacks
        return NextResponse.json({
          success: true,
          message: 'If the email exists, a reset link has been sent.'
        });
      }
      
      // For actual system errors, return failure
      return NextResponse.json(
        { success: false, error: 'Failed to send reset link. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reset link sent successfully'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to send reset link' },
      { status: 500 }
    );
  }
}
