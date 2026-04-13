
import { createClient } from '@supabase/supabase-js';

async function listFacilities() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('Listing first 10 facilities...');
  const { data, error } = await supabase
    .from('healthcare_facilities')
    .select('id, name, city, type')
    .limit(10);

  if (error) {
    console.error('Error listing facilities:', error);
  } else {
    console.table(data);
  }
}

listFacilities();
