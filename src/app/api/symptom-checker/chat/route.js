import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '@/lib/supabase-server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { symptomChatCompletion } from '@/lib/ai';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { checkId, message } = await request.json();
    const supabase = await createClient();

    if (!checkId || !message) {
      return NextResponse.json(
        { error: 'Check ID and message are required' },
        { status: 400 }
      );
    }

    // 1. Fetch the symptom check details (and strictly session-validate ownership)
    const { data: symptomCheck, error: fetchCheckError } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('id', checkId)
      .eq('user_id', user.id) // Session-based ownership validation
      .single();

    if (fetchCheckError || !symptomCheck) {
      return NextResponse.json(
        { error: 'Symptom report not found or access denied' },
        { status: 404 }
      );
    }

    // 2. Get user profile context
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // 3. Extract or initialize chat history
    const aiResponse = symptomCheck.ai_response || {};
    const chatHistory = aiResponse.chat_history || [];

    // Create user message object
    const userMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, userMessage];

    // 4. Generate AI conversational response
    const assistantContent = await symptomChatCompletion(
      symptomCheck.symptoms_description,
      aiResponse,
      updatedHistory,
      profile
    );

    const assistantMessage = { role: 'assistant', content: assistantContent };
    const finalHistory = [...updatedHistory, assistantMessage];

    // 5. Update symptom check with new history stored in jsonb
    const updatedAiResponse = {
      ...aiResponse,
      chat_history: finalHistory
    };

    const { error: updateError } = await supabaseAdmin
      .from('symptom_checks')
      .update({ ai_response: updatedAiResponse })
      .eq('id', checkId)
      .eq('user_id', user.id); // Guard against IDOR again

    if (updateError) {
      console.error("Failed to update symptom check chat history:", updateError);
    }

    return NextResponse.json({
      success: true,
      data: assistantMessage,
      history: finalHistory
    });

  } catch (error) {
    console.error("Symptom Checker Chat API Error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
