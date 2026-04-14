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
    // Read the sample data file
    const dataPath = path.join(process.cwd(), 'scripts', 'healthcare-facilities-sample.json')
    const facilitiesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    console.log(`Loaded ${facilitiesData.length} facilities from JSON file`)

    // Clear existing data
    console.log('Clearing existing healthcare facilities...')
    const { error: deleteError } = await supabase
      .from('healthcare_facilities')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError.message)
      console.log('Continuing with insert...')
    } else {
      console.log('Existing data cleared')
    }

    // Insert facilities in batches
    const batchSize = 50
    const batches = []

    for (let i = 0; i < facilitiesData.length; i += batchSize) {
      batches.push(facilitiesData.slice(i, i + batchSize))
    }

    console.log(`Inserting ${batches.length} batches...`)

    let totalInserted = 0
    let totalErrors = 0

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`Inserting batch ${i + 1}/${batches.length} (${batch.length} facilities)...`)

      const { data, error } = await supabase
        .from('healthcare_facilities')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Error inserting batch ${i + 1}:`, error.message)
        totalErrors += batch.length
      } else {
        console.log(`Successfully inserted batch ${i + 1}`)
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
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed facilities', details: error.message },
      { status: 500 }
    )
  }
}
