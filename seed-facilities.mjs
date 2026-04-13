
import { createClient } from '@supabase/supabase-js';

const indianHospitals = [
  // Mumbai
  { name: "Lilavati Hospital", city: "Mumbai", type: "hospital", rating: 4.8, address: "Bandra West, Mumbai", state: "Maharashtra", zip_code: "400050", phone: "022-26751000", latitude: 19.0514, longitude: 72.8294, emergency_services: true },
  { name: "Nanavati Max Super Speciality", city: "Mumbai", type: "hospital", rating: 4.6, address: "Vile Parle West, Mumbai", state: "Maharashtra", zip_code: "400056", phone: "022-26267500", latitude: 19.1026, longitude: 72.8359, emergency_services: true },
  { name: "Apollo Clinics Colaba", city: "Mumbai", type: "clinic", rating: 4.4, address: "Colaba, Mumbai", state: "Maharashtra", zip_code: "400005", phone: "022-22184133", latitude: 18.9150, longitude: 72.8258, emergency_services: false },
  
  // Delhi
  { name: "AIIMS Delhi", city: "Delhi", type: "hospital", rating: 4.9, address: "Ansari Nagar East, Delhi", state: "Delhi", zip_code: "110029", phone: "011-26588500", latitude: 28.5672, longitude: 77.2100, emergency_services: true },
  { name: "Fortis Escorts Heart Institute", city: "Delhi", type: "hospital", rating: 4.7, address: "Okhla Road, Delhi", state: "Delhi", zip_code: "110025", phone: "011-47135000", latitude: 28.5606, longitude: 77.2732, emergency_services: true },
  
  // Bangalore
  { name: "Manipal Hospital", city: "Bangalore", type: "hospital", rating: 4.7, address: "Old Airport Road, Bangalore", state: "Karnataka", zip_code: "560017", phone: "080-25024444", latitude: 12.9600, longitude: 77.6416, emergency_services: true },
  { name: "Narayana Health City", city: "Bangalore", type: "hospital", rating: 4.8, address: "Hosur Road, Bangalore", state: "Karnataka", zip_code: "560099", phone: "080-71222222", latitude: 12.8122, longitude: 77.6936, emergency_services: true },
  
  // Hyderabad
  { name: "Apollo Hospitals Jubilee Hills", city: "Hyderabad", type: "hospital", rating: 4.7, address: "Jubilee Hills, Hyderabad", state: "Telangana", zip_code: "500033", phone: "040-23607777", latitude: 17.4161, longitude: 78.4116, emergency_services: true },
  { name: "Yashoda Hospital Secunderabad", city: "Hyderabad", type: "hospital", rating: 4.6, address: "Secunderabad, Hyderabad", state: "Telangana", zip_code: "500003", phone: "040-45674567", latitude: 17.4399, longitude: 78.4983, emergency_services: true },
  
  // Ahmedabad
  { name: "Zydus Hospital", city: "Ahmedabad", type: "hospital", rating: 4.7, address: "Thaltej, Ahmedabad", state: "Gujarat", zip_code: "380054", phone: "079-66190201", latitude: 23.0497, longitude: 72.5204, emergency_services: true },
  { name: "Apollo Hospitals International", city: "Ahmedabad", type: "hospital", rating: 4.6, address: "Gandhinagar-Ahmedabad Rd", state: "Gujarat", zip_code: "382428", phone: "079-66701800", latitude: 23.1026, longitude: 72.6026, emergency_services: true },

  // Chennai
  { name: "Apollo Main Hospital", city: "Chennai", type: "hospital", rating: 4.8, address: "Greams Road, Chennai", state: "Tamil Nadu", zip_code: "600006", phone: "044-28293333", latitude: 13.0617, longitude: 80.2520, emergency_services: true },
  { name: "Fortis Malar Hospital", city: "Chennai", type: "hospital", rating: 4.5, address: "Adyar, Chennai", state: "Tamil Nadu", zip_code: "600020", phone: "044-42892222", latitude: 13.0125, longitude: 80.2568, emergency_services: true },
  
  // Kolkata
  { name: "Apollo Gleneagles Hospitals", city: "Kolkata", type: "hospital", rating: 4.7, address: "Salt Lake, Kolkata", state: "West Bengal", zip_code: "700054", phone: "033-23202122", latitude: 22.5701, longitude: 88.4024, emergency_services: true },
  { name: "AMRI Hospital", city: "Kolkata", type: "hospital", rating: 4.4, address: "Dhakuria, Kolkata", state: "West Bengal", zip_code: "700029", phone: "033-66800000", latitude: 22.5081, longitude: 88.3644, emergency_services: true },

  // Pune
  { name: "Ruby Hall Clinic", city: "Pune", type: "hospital", rating: 4.6, address: "Bund Garden Road, Pune", state: "Maharashtra", zip_code: "411001", phone: "020-66455100", latitude: 18.5332, longitude: 73.8778, emergency_services: true },
  { name: "Jehangir Hospital", city: "Pune", type: "hospital", rating: 4.5, address: "Sassoon Road, Pune", state: "Maharashtra", zip_code: "411001", phone: "020-66819999", latitude: 18.5298, longitude: 73.8741, emergency_services: true },

  // Surat
  { name: "Kiran Super Speciality Hospital", city: "Surat", type: "hospital", rating: 4.7, address: "Katargam, Surat", state: "Gujarat", zip_code: "395004", phone: "0261-7161111", latitude: 21.2173, longitude: 72.8256, emergency_services: true },
  { name: "Sunshine Global Hospital", city: "Surat", type: "hospital", rating: 4.4, address: "Piplod, Surat", state: "Gujarat", zip_code: "395007", phone: "0261-2252255", latitude: 21.1610, longitude: 72.7844, emergency_services: true },

  // Jaipur
  { name: "Sawai Man Singh (SMS) Hospital", city: "Jaipur", type: "hospital", rating: 4.5, address: "JLN Marg, Jaipur", state: "Rajasthan", zip_code: "302004", phone: "0141-2560291", latitude: 26.8967, longitude: 75.8166, emergency_services: true },
  { name: "Fortis Escorts Hospital", city: "Jaipur", type: "hospital", rating: 4.6, address: "Malviya Nagar, Jaipur", state: "Rajasthan", zip_code: "302017", phone: "0141-2547000", latitude: 26.8488, longitude: 75.8080, emergency_services: true }
];

async function seedFacilities() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('Seeding Indian healthcare facilities (Correct Schema)...');
  const { data, error } = await supabase
    .from('healthcare_facilities')
    .insert(indianHospitals);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded Indian facilities.');
  }
}

seedFacilities();
