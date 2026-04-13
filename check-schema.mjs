
import { createClient } from '@supabase/supabase-js';

async function checkSchema() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('Checking healthcare_facilities schema samples...');
  const { data, error } = await supabase
    .from('healthcare_facilities')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error checking schema:', error);
  } else {
    console.log('Sample row columns:', Object.keys(data[0] || {}));
  }
}

checkSchema();
