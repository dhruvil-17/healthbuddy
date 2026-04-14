// Supabase Healthcare Facilities Seeding Script
// This script reads the sample healthcare facilities JSON file and seeds it into Supabase

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedFacilities() {
  console.log('Starting Supabase seeding...');

  // Read the sample data file
  const dataPath = path.join(__dirname, 'healthcare-facilities-sample.json');
  const facilitiesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Loaded ${facilitiesData.length} facilities from JSON file`);

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('Clearing existing healthcare facilities...');
  const { error: deleteError } = await supabase
    .from('healthcare_facilities')
    .delete()
    .neq('id', 0); // This deletes all rows

  if (deleteError) {
    console.error('Error clearing existing data:', deleteError.message);
    console.log('Continuing with insert...');
  } else {
    console.log('Existing data cleared');
  }

  // Insert facilities in batches (Supabase has a limit on batch size)
  const batchSize = 50;
  const batches = [];

  for (let i = 0; i < facilitiesData.length; i += batchSize) {
    batches.push(facilitiesData.slice(i, i + batchSize));
  }

  console.log(`Inserting ${batches.length} batches...`);

  let totalInserted = 0;
  let totalErrors = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Inserting batch ${i + 1}/${batches.length} (${batch.length} facilities)...`);

    const { data, error } = await supabase
      .from('healthcare_facilities')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i + 1}:`, error.message);
      totalErrors += batch.length;
    } else {
      console.log(`Successfully inserted batch ${i + 1}`);
      totalInserted += data.length;
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== Seeding Summary ===');
  console.log(`Total facilities to insert: ${facilitiesData.length}`);
  console.log(`Successfully inserted: ${totalInserted}`);
  console.log(`Failed to insert: ${totalErrors}`);

  if (totalInserted > 0) {
    console.log('\n✅ Seeding completed successfully!');
  } else {
    console.log('\n❌ Seeding failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  seedFacilities()
    .then(() => {
      console.log('\nScript completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedFacilities };
