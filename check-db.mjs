
import { createClient } from '@supabase/supabase-js';

async function checkDb() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('Checking healthcare_facilities table...');
  const { data, error, count } = await supabase
    .from('healthcare_facilities')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error checking table:', error);
  } else {
    console.log('Total facilities:', count);
  }
}

checkDb();
