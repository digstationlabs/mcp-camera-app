/**
 * Popular camera locations and utilities
 */

export const POPULAR_LOCATIONS = [
  {
    name: 'Yosemite National Park',
    description: 'Valley views, waterfalls, and iconic landmarks',
    lat: 37.7456,
    lng: -119.5936,
    radius: 25,
    category: 'National Park'
  },
  {
    name: 'Yellowstone National Park',
    description: 'Geysers, wildlife, and thermal features',
    lat: 44.4280,
    lng: -110.5885,
    radius: 50,
    category: 'National Park'
  },
  {
    name: 'Grand Canyon National Park',
    description: 'South and North Rim views',
    lat: 36.1069,
    lng: -112.1129,
    radius: 30,
    category: 'National Park'
  },
  {
    name: 'San Francisco Bay Area',
    description: 'Golden Gate, Bay Bridge, and city views',
    lat: 37.7749,
    lng: -122.4194,
    radius: 50,
    category: 'Urban'
  },
  {
    name: 'New York City',
    description: 'Times Square, Central Park, and skyline',
    lat: 40.7128,
    lng: -74.0060,
    radius: 25,
    category: 'Urban'
  },
  {
    name: 'Miami Beach',
    description: 'Ocean views, beaches, and weather stations',
    lat: 25.7907,
    lng: -80.1300,
    radius: 20,
    category: 'Beach'
  },
  {
    name: 'Seattle',
    description: 'Space Needle, Puget Sound, and mountain views',
    lat: 47.6062,
    lng: -122.3321,
    radius: 30,
    category: 'Urban'
  },
  {
    name: 'Denver',
    description: 'Downtown and Rocky Mountain views',
    lat: 39.7392,
    lng: -104.9903,
    radius: 40,
    category: 'Urban'
  },
  {
    name: 'Big Sur Coast',
    description: 'Coastal highway and ocean views',
    lat: 36.2704,
    lng: -121.8081,
    radius: 25,
    category: 'Coast'
  },
  {
    name: 'Lake Tahoe',
    description: 'Alpine lake and mountain cameras',
    lat: 39.0968,
    lng: -120.0324,
    radius: 30,
    category: 'Mountain'
  },
  {
    name: 'Glacier National Park',
    description: 'Mountain peaks and glacial views',
    lat: 48.7596,
    lng: -113.7870,
    radius: 40,
    category: 'National Park'
  },
  {
    name: 'Acadia National Park',
    description: 'Rocky coastline and forest views',
    lat: 44.3386,
    lng: -68.2733,
    radius: 20,
    category: 'National Park'
  }
];

export const LOCATION_CATEGORIES = [
  'All',
  'National Park',
  'Urban',
  'Beach',
  'Coast',
  'Mountain'
];

/**
 * Get locations by category
 */
export function getLocationsByCategory(category) {
  if (category === 'All') {
    return POPULAR_LOCATIONS;
  }
  return POPULAR_LOCATIONS.filter(loc => loc.category === category);
}

/**
 * Find location by name (fuzzy search)
 */
export function findLocationByName(searchTerm) {
  const term = searchTerm.toLowerCase();
  return POPULAR_LOCATIONS.find(loc => 
    loc.name.toLowerCase().includes(term) ||
    loc.description.toLowerCase().includes(term)
  );
}

/**
 * Get nearest popular location
 */
export function getNearestLocation(lat, lng) {
  let nearest = null;
  let minDistance = Infinity;

  for (const location of POPULAR_LOCATIONS) {
    const distance = calculateDistance(lat, lng, location.lat, location.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...location, distance };
    }
  }

  return nearest;
}

/**
 * Calculate distance between two points in miles
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Validate coordinates
 */
export function validateCoordinates(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return { valid: false, error: 'Coordinates must be numbers' };
  }
  
  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  
  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  
  return { valid: true, lat: latitude, lng: longitude };
}