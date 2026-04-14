// Healthcare Facilities Seeding Script
// This script fetches healthcare facilities from OpenStreetMap using the Overpass API
// and seeds them into the Supabase healthcare_facilities table

const cities = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, radius: 0.15 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, radius: 0.15 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, radius: 0.15 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, radius: 0.15 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, radius: 0.15 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, radius: 0.15 },
  { name: "Pune", lat: 18.5204, lng: 73.8567, radius: 0.15 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, radius: 0.15 },
  { name: "Gandhinagar", lat: 23.2156, lng: 72.6369, radius: 0.1 },
  { name: "Surat", lat: 21.1702, lng: 72.8311, radius: 0.15 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, radius: 0.15 },
];

// Overpass API query to fetch healthcare facilities
async function fetchHealthcareFacilities(city) {
  const { name, lat, lng, radius } = city;

  // Calculate bounding box
  const delta = radius;
  const bbox = `${lat - delta},${lng - delta},${lat + delta},${lng + delta}`;

  const query = `
    [out:json][timeout:60];
    (
      node["amenity"="hospital"](${bbox});
      node["amenity"="clinic"](${bbox});
      node["amenity"="doctors"](${bbox});
      node["amenity"="pharmacy"](${bbox});
      node["amenity"="dentist"](${bbox});
      way["amenity"="hospital"](${bbox});
      way["amenity"="clinic"](${bbox});
      relation["amenity"="hospital"](${bbox});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    // Check if response is XML (error) or JSON (success)
    if (text.trim().startsWith('<?xml')) {
      console.error(`Overpass API returned XML error for ${name}`);
      return [];
    }

    const data = JSON.parse(text);
    return data.elements || [];
  } catch (error) {
    console.error(`Error fetching facilities for ${name}:`, error.message);
    return [];
  }
}

// Transform OSM data to our database format
function transformFacility(element, cityName) {
  const tags = element.tags || {};
  const lat = element.lat || element.center?.lat;
  const lng = element.lon || element.center?.lon;
  
  if (!lat || !lng) return null;
  
  // Determine facility type
  let type = 'clinic';
  if (tags.amenity === 'hospital') type = 'hospital';
  else if (tags.amenity === 'pharmacy') type = 'pharmacy';
  else if (tags.amenity === 'dentist') type = 'clinic';
  else if (tags.healthcare) type = tags.healthcare;
  
  // Determine if emergency services
  const emergencyServices = tags.emergency === 'yes' || 
                            tags['emergency:ward'] === 'yes' ||
                            type === 'hospital';
  
  return {
    name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)} in ${cityName}`,
    address: tags['addr:street'] || tags['addr:full'] || `${cityName}`,
    city: cityName,
    type: type,
    phone: tags.phone || tags['contact:phone'] || null,
    latitude: lat,
    longitude: lng,
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
    emergency_services: emergencyServices,
    distance: (Math.random() * 10 + 1).toFixed(1), // Random distance between 1 and 11 KM
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Main seeding function
async function seedHealthcareFacilities() {
  console.log('Starting healthcare facilities seeding...');
  
  const allFacilities = [];
  
  for (const city of cities) {
    console.log(`Fetching facilities for ${city.name}...`);
    const osmData = await fetchHealthcareFacilities(city);
    
    const facilities = osmData
      .map(element => transformFacility(element, city.name))
      .filter(Boolean);
    
    console.log(`Found ${facilities.length} facilities in ${city.name}`);
    allFacilities.push(...facilities);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Total facilities fetched: ${allFacilities.length}`);
  
  // Save to JSON file for manual review/import
  const fs = require('fs');
  const path = require('path');
  
  const outputPath = path.join(__dirname, 'healthcare-facilities-seed.json');
  fs.writeFileSync(outputPath, JSON.stringify(allFacilities, null, 2));
  
  console.log(`Facilities saved to: ${outputPath}`);
  console.log('Review the file and import into Supabase manually or use the Supabase client to insert.');
  
  return allFacilities;
}

// Run the seeding
if (require.main === module) {
  seedHealthcareFacilities()
    .then(() => console.log('Seeding complete!'))
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedHealthcareFacilities, fetchHealthcareFacilities, transformFacility };
