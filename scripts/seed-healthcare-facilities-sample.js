// Healthcare Facilities Sample Data Seeding Script
// This script creates realistic sample healthcare facility data for all cities
// and can be used to seed the database when API data is not available

const cities = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
];

// Sample facility templates
const hospitalTemplates = [
  { name: "City Hospital", type: "hospital", emergency: true },
  { name: "General Hospital", type: "hospital", emergency: true },
  { name: "Medical Center", type: "hospital", emergency: false },
  { name: "Apollo Hospital", type: "hospital", emergency: true },
  { name: "Fortis Hospital", type: "hospital", emergency: true },
  { name: "Max Hospital", type: "hospital", emergency: true },
];

const clinicTemplates = [
  { name: "City Clinic", type: "clinic", emergency: false },
  { name: "Family Clinic", type: "clinic", emergency: false },
  { name: "Health Center", type: "clinic", emergency: false },
  { name: "Primary Care Clinic", type: "clinic", emergency: false },
  { name: "Multi-Specialty Clinic", type: "clinic", emergency: false },
];

const pharmacyTemplates = [
  { name: "City Pharmacy", type: "pharmacy", emergency: false },
  { name: "MedPlus Pharmacy", type: "pharmacy", emergency: false },
  { name: "Health Pharmacy", type: "pharmacy", emergency: false },
  { name: "24/7 Pharmacy", type: "pharmacy", emergency: false },
];

const diagnosticTemplates = [
  { name: "City Diagnostics", type: "diagnostic_center", emergency: false },
  { name: "Pathology Lab", type: "diagnostic_center", emergency: false },
  { name: "Medical Lab", type: "diagnostic_center", emergency: false },
];

const areaNames = [
  "Central", "North", "South", "East", "West",
  "Main Road", "Sector 1", "Sector 2", "Downtown", "Uptown"
];

function generateRandomPhone() {
  const prefixes = ["+91", "0"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${prefix}${number}`;
}

function generateFacilitiesForCity(city) {
  const facilities = [];
  const { name: cityName, lat, lng } = city;

  // Generate hospitals (5-8 per city)
  const hospitalCount = Math.floor(Math.random() * 4) + 5;
  for (let i = 0; i < hospitalCount; i++) {
    const template = hospitalTemplates[i % hospitalTemplates.length];
    const area = areaNames[i % areaNames.length];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    facilities.push({
      name: `${template.name} - ${area}`,
      address: `${area}, ${cityName}`,
      city: cityName,
      type: template.type,
      phone: generateRandomPhone(),
      latitude: lat + latOffset,
      longitude: lng + lngOffset,
      rating: (Math.random() * 2 + 3).toFixed(1),
      emergency_services: template.emergency,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Generate clinics (4-7 per city)
  const clinicCount = Math.floor(Math.random() * 4) + 4;
  for (let i = 0; i < clinicCount; i++) {
    const template = clinicTemplates[i % clinicTemplates.length];
    const area = areaNames[(i + 3) % areaNames.length];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    facilities.push({
      name: `${template.name} - ${area}`,
      address: `${area}, ${cityName}`,
      city: cityName,
      type: template.type,
      phone: generateRandomPhone(),
      latitude: lat + latOffset,
      longitude: lng + lngOffset,
      rating: (Math.random() * 2 + 3).toFixed(1),
      emergency_services: template.emergency,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Generate pharmacies (3-5 per city)
  const pharmacyCount = Math.floor(Math.random() * 3) + 3;
  for (let i = 0; i < pharmacyCount; i++) {
    const template = pharmacyTemplates[i % pharmacyTemplates.length];
    const area = areaNames[(i + 5) % areaNames.length];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    facilities.push({
      name: `${template.name} - ${area}`,
      address: `${area}, ${cityName}`,
      city: cityName,
      type: template.type,
      phone: generateRandomPhone(),
      latitude: lat + latOffset,
      longitude: lng + lngOffset,
      rating: (Math.random() * 2 + 3).toFixed(1),
      emergency_services: template.emergency,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Generate diagnostic centers (2-4 per city)
  const diagnosticCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < diagnosticCount; i++) {
    const template = diagnosticTemplates[i % diagnosticTemplates.length];
    const area = areaNames[(i + 7) % areaNames.length];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    facilities.push({
      name: `${template.name} - ${area}`,
      address: `${area}, ${cityName}`,
      city: cityName,
      type: template.type,
      phone: generateRandomPhone(),
      latitude: lat + latOffset,
      longitude: lng + lngOffset,
      rating: (Math.random() * 2 + 3).toFixed(1),
      emergency_services: template.emergency,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return facilities;
}

// Main seeding function
async function seedSampleFacilities() {
  console.log('Generating sample healthcare facilities...');

  const allFacilities = [];

  for (const city of cities) {
    console.log(`Generating facilities for ${city.name}...`);
    const cityFacilities = generateFacilitiesForCity(city);
    console.log(`Generated ${cityFacilities.length} facilities for ${city.name}`);
    allFacilities.push(...cityFacilities);
  }

  console.log(`Total facilities generated: ${allFacilities.length}`);

  // Save to JSON file
  const fs = require('fs');
  const path = require('path');

  const outputPath = path.join(__dirname, 'healthcare-facilities-sample.json');
  fs.writeFileSync(outputPath, JSON.stringify(allFacilities, null, 2));

  console.log(`Sample facilities saved to: ${outputPath}`);
  console.log('\nTo seed the database, you can:');
  console.log('1. Import the JSON file into Supabase via the dashboard');
  console.log('2. Use the Supabase client to insert the data programmatically');
  console.log('3. Run a SQL script to insert the data');

  return allFacilities;
}

// Run the seeding
if (require.main === module) {
  seedSampleFacilities()
    .then(() => console.log('\nSample data generation complete!'))
    .catch(error => {
      console.error('Sample data generation failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSampleFacilities, generateFacilitiesForCity };
