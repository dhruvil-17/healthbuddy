import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'

// Get user's medicine reminders
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
    const activeOnly = searchParams.get('activeOnly') === 'true'
    const supabase = await createClient()

    let query = supabase
      .from('medicine_reminders')
      .select('*')
      .eq('user_id', user.id) // Strict session-based filter
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: reminders, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: reminders
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

// Create new medicine reminder
export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      medicineName, 
      dosage, 
      frequency, 
      times, 
      startDate, 
      endDate, 
      notes 
    } = await request.json()

    if (!medicineName || !dosage || !frequency || !times || !startDate) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: reminder, error } = await supabase
      .from('medicine_reminders')
      .insert([
        {
          user_id: user.id, // Derived from session
          medicine_name: medicineName,
          dosage: dosage,
          frequency: frequency,
          times: times,
          start_date: startDate,
          end_date: endDate || null,
          notes: notes || null
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: reminder
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}

// Update medicine reminder
export async function PUT(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      reminderId, 
      medicineName, 
      dosage, 
      frequency, 
      times, 
      startDate, 
      endDate, 
      notes,
      isActive
    } = await request.json()

    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const updateData = {}
    if (medicineName !== undefined) updateData.medicine_name = medicineName
    if (dosage !== undefined) updateData.dosage = dosage
    if (frequency !== undefined) updateData.frequency = frequency
    if (times !== undefined) updateData.times = times
    if (startDate !== undefined) updateData.start_date = startDate
    if (endDate !== undefined) updateData.end_date = endDate
    if (notes !== undefined) updateData.notes = notes
    if (isActive !== undefined) updateData.is_active = isActive
    updateData.updated_at = new Date().toISOString()

    const { data: reminder, error } = await supabase
      .from('medicine_reminders')
      .update(updateData)
      .eq('id', reminderId)
      .eq('user_id', user.id) // Ensure user only updates their own reminder
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: reminder
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    )
  }
}

// Delete medicine reminder
export async function DELETE(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reminderId = searchParams.get('reminderId')
    const supabase = await createClient()

    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('medicine_reminders')
      .delete()
      .eq('id', reminderId)
      .eq('user_id', user.id) // Ensure user only deletes their own reminder

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    )
  }
}