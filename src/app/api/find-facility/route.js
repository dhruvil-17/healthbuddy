import { NextResponse } from 'next/server'
import { createClient, getSessionUser } from '@/lib/supabase-server'

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
    const city = searchParams.get('city')
    const facilityType = searchParams.get('type') || 'all'
    const radius = parseInt(searchParams.get('radius')) || 10
    const supabase = await createClient()

    if (!city) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      )
    }

    let query = supabase.from('healthcare_facilities').select('*')

    // Filter by city (exact match for better results)
    query = query.eq('city', city)

    // Filter by facility type if specified
    if (facilityType !== 'all') {
      query = query.eq('type', facilityType)
    }

    const { data: facilities, error } = await query.order('name')

    if (error) throw error

    let results = facilities || []

    // Sort by emergency services first, then by name
    results = results.sort((a, b) => {
      // Emergency services first
      if (a.emergency_services && !b.emergency_services) return -1
      if (!a.emergency_services && b.emergency_services) return 1
      
      // Then by rating (higher first)
      if (b.rating !== a.rating) return b.rating - a.rating
      
      // Finally by name
      return a.name.localeCompare(b.name)
    })

    // Save search history (using session-validated user ID)
    await supabase
      .from('user_facility_searches')
      .insert([
        {
          user_id: user.id,
          search_location: city,
          facility_type: facilityType,
          search_radius: radius,
          results_count: results.length
        }
      ])

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      city: city
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to find facilities' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { limit = 10 } = await request.json()
    const supabase = await createClient()

    const { data: searches, error } = await supabase
      .from('user_facility_searches')
      .select('*')
      .eq('user_id', user.id) // Strict session-based filter
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: searches
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}
