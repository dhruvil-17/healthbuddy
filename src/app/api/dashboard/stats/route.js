import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'

/**
 * GET Dashboard Aggregate Stats
 * Returns real-time counts and summaries for the modern dashboard.
 * Eliminates "static" data placeholders by deriving metrics from user records.
 */
export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // 1. Fetch Symptom Checker Stats
    const { count: reportsCount } = await supabase
      .from('symptom_checks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // 2. Fetch Active Medicine Reminders
    const { count: remindersCount } = await supabase
      .from('medicine_reminders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // 3. Fetch Today's Medication Logs
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
    
    const { data: todayLogs } = await supabase
      .from('medicine_logs')
      .select('status')
      .eq('user_id', user.id)
      .gte('scheduled_time', startOfToday)
      .lt('scheduled_time', endOfToday)

    // 4. Fetch Latest Health Tip for the "Tip Display"
    const { data: latestTip } = await supabase
      .from('health_tips_history')
      .select('tips_data, category')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Transform latest tip to flattened structure for easier display
    let processedTip = null
    if (latestTip) {
      const { tips_data, category } = latestTip
      let content = "Check your health tips for personalized insights."
      
      if (tips_data) {
        if (category === 'general' && tips_data.generalTips?.length > 0) {
          content = tips_data.generalTips[0].description
        } else if (category === 'diet' && tips_data.dietaryRecommendations?.recommended?.length > 0) {
          content = `Try adding ${tips_data.dietaryRecommendations.recommended[0]} to your diet.`
        } else if (category === 'exercise' && tips_data.exerciseGuidelines?.recommended?.length > 0) {
          content = `Recommended: ${tips_data.exerciseGuidelines.recommended[0]}.`
        } else if (category === 'mental' && tips_data.lifestyleModifications?.length > 0) {
          content = tips_data.lifestyleModifications[0].recommendation
        } else if (category === 'preventive' && tips_data.conditionSpecificTips?.length > 0) {
          content = tips_data.conditionSpecificTips[0].tips[0]?.description
        }
      }
      
      processedTip = {
        category,
        content
      }
    }

    // Calculate adherence percentage
    const totalLogsToday = todayLogs?.length || 0
    const takenLogsToday = todayLogs?.filter(l => l.status === 'taken')?.length || 0
    const adherenceRate = totalLogsToday > 0 
      ? Math.round((takenLogsToday / totalLogsToday) * 100) 
      : 0

    return NextResponse.json({
      success: true,
      data: {
        totalReports: reportsCount || 0,
        activeReminders: remindersCount || 0,
        adherenceRate: adherenceRate,
        medsTakenToday: takenLogsToday,
        medsTotalToday: totalLogsToday,
        latestTip: processedTip,
        serverTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}
