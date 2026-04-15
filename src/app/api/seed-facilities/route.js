import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Use service role key for seeding (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase service role credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {
  try {
    // Verify secret key for additional security
    const SEED_SECRET_KEY = process.env.SEED_SECRET_KEY
    
    if (!SEED_SECRET_KEY) {
      return NextResponse.json(
        { error: 'SEED_SECRET_KEY not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { secretKey } = body

    if (secretKey !== SEED_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    // Read the sample data file
    const dataPath = path.join(process.cwd(), 'scripts', 'healthcare-facilities-sample.json')
    const facilitiesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('healthcare_facilities')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      // Continue with insert even if clear fails
    }

    // Insert facilities in batches
    const batchSize = 50
    const batches = []

    for (let i = 0; i < facilitiesData.length; i += batchSize) {
      batches.push(facilitiesData.slice(i, i + batchSize))
    }

    let totalInserted = 0
    let totalErrors = 0

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]

      const { data, error } = await supabase
        .from('healthcare_facilities')
        .insert(batch)
        .select()

      if (error) {
        totalErrors += batch.length
      } else {
        totalInserted += data.length
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      message: 'Facilities seeded successfully',
      summary: {
        total: facilitiesData.length,
        inserted: totalInserted,
        failed: totalErrors
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed facilities' },
      { status: 500 }
    )
  }
}
