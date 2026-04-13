
import { createClient } from '@supabase/supabase-js';

async function testApiLogic() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const city = 'Mumbai';
  console.log(`Testing query for city: ${city}`);
  
  let query = supabase.from('healthcare_facilities').select('*');
  query = query.eq('city', city);
  
  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error querying:', error);
  } else {
    console.log(`Found ${data.length} facilities in ${city}.`);
    console.table(data.map(f => ({ name: f.name, city: f.city, type: f.type })));
  }
}

testApiLogic();
