/**
 * Country → city → locality dataset for profiling and location forms.
 * Keep SEO LOCALITIES in teachers.ts separately (hub pages); this list is UX-first.
 */

export const LOCATION_OTHER = "__other__" as const;

export const LOCATION_COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Singapore",
  "United Kingdom",
  "United States",
  "Australia",
  "Canada",
  "Other",
] as const;

export type LocationCountry = (typeof LOCATION_COUNTRIES)[number];

const ONLINE = "Online / remote";

/** Cities shown for each country (plus Other via UI). */
export const CITIES_BY_COUNTRY: Record<string, readonly string[]> = {
  India: [
    "Bengaluru",
    "Mumbai",
    "Delhi NCR",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Chandigarh",
    "Bengaluru outskirts",
    ONLINE,
  ],
  "United Arab Emirates": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    ONLINE,
  ],
  Singapore: ["Singapore", ONLINE],
  "United Kingdom": [
    "London",
    "Manchester",
    "Birmingham",
    "Edinburgh",
    ONLINE,
  ],
  "United States": [
    "New York",
    "San Francisco Bay Area",
    "Los Angeles",
    "Austin",
    "Seattle",
    ONLINE,
  ],
  Australia: ["Sydney", "Melbourne", "Brisbane", ONLINE],
  Canada: ["Toronto", "Vancouver", "Montreal", ONLINE],
  Other: [ONLINE],
};

/** Areas / localities keyed by city display name. */
export const AREAS_BY_CITY: Record<string, readonly string[]> = {
  Bengaluru: [
    "Koramangala",
    "Indiranagar",
    "HSR Layout",
    "Jayanagar",
    "Whitefield",
    "Malleshwaram",
    "BTM Layout",
    "JP Nagar",
    "Banashankari",
    "Electronic City",
    "Sarjapur Road",
    "Marathahalli",
    "Bellandur",
    "Hebbal",
    "Yelahanka",
    "Rajajinagar",
    "Basavanagudi",
    "MG Road / Central",
    "RT Nagar",
    "Bannerghatta Road",
  ],
  "Bengaluru outskirts": [
    "Electronic City",
    "Sarjapur Road",
    "Whitefield",
    "Yelahanka",
    "Devanahalli",
  ],
  Mumbai: [
    "Andheri",
    "Bandra",
    "Powai",
    "Dadar",
    "Worli",
    "Juhu",
    "Thane",
    "Navi Mumbai",
    "Borivali",
    "Goregaon",
    "Colaba",
  ],
  "Delhi NCR": [
    "South Delhi",
    "East Delhi",
    "West Delhi",
    "North Delhi",
    "Dwarka",
    "Noida",
    "Greater Noida",
    "Gurugram",
    "Faridabad",
    "Ghaziabad",
  ],
  Hyderabad: [
    "Hitech City",
    "Gachibowli",
    "Madhapur",
    "Secunderabad",
    "Banjara Hills",
    "Jubilee Hills",
    "Kukatpally",
    "Kondapur",
  ],
  Pune: [
    "Hinjewadi",
    "Baner",
    "Kothrud",
    "Viman Nagar",
    "Koregaon Park",
    "Wakad",
    "Hadapsar",
    "Aundh",
  ],
  Chennai: [
    "Adyar",
    "Anna Nagar",
    "OMR / Sholinganallur",
    "Velachery",
    "T Nagar",
    "Porur",
    "Mylapore",
  ],
  Kolkata: ["Salt Lake", "New Town", "Park Street", "Ballygunge", "Howrah"],
  Ahmedabad: ["SG Highway", "Satellite", "Navrangpura", "Bopal"],
  Jaipur: ["C-Scheme", "Malviya Nagar", "Vaishali Nagar", "Mansarovar"],
  Chandigarh: ["Sector 17", "Sector 22", "Mohali", "Panchkula"],
  Dubai: [
    "Dubai Marina",
    "JLT",
    "Downtown Dubai",
    "Business Bay",
    "Jumeirah",
    "Arabian Ranches",
    "Silicon Oasis",
    "Deira",
    "Bur Dubai",
  ],
  "Abu Dhabi": [
    "Al Reem Island",
    "Corniche",
    "Khalifa City",
    "Al Raha",
    "Yas Island",
    "Saadiyat",
  ],
  Sharjah: ["Al Majaz", "University City", "Al Nahda", "Muwaileh"],
  Ajman: ["Al Nuaimiya", "Al Rashidiya"],
  "Ras Al Khaimah": ["Al Nakheel", "Al Hamra"],
  Singapore: ["Central", "East", "West", "North", "North-East"],
  London: ["Central London", "North London", "South London", "East London", "West London"],
  Manchester: ["City Centre", "Didsbury", "Salford"],
  Birmingham: ["City Centre", "Edgbaston"],
  Edinburgh: ["Old Town", "New Town", "Leith"],
  "New York": ["Manhattan", "Brooklyn", "Queens", "Jersey City"],
  "San Francisco Bay Area": [
    "San Francisco",
    "San Jose",
    "Palo Alto",
    "Oakland",
    "Mountain View",
  ],
  "Los Angeles": ["West LA", "Downtown", "Pasadena", "Santa Monica"],
  Austin: ["Downtown", "North Austin", "South Austin"],
  Seattle: ["Downtown", "Bellevue", "Redmond"],
  Sydney: ["CBD", "Inner West", "North Shore", "Eastern Suburbs"],
  Melbourne: ["CBD", "South Yarra", "Richmond", "Carlton"],
  Brisbane: ["CBD", "South Bank", "Fortitude Valley"],
  Toronto: ["Downtown", "North York", "Mississauga", "Scarborough"],
  Vancouver: ["Downtown", "Burnaby", "Richmond", "Surrey"],
  Montreal: ["Downtown", "Plateau", "Westmount"],
};

export function normalizeCountry(raw: string | undefined | null): string {
  const v = (raw || "").trim();
  if (!v) return "India";
  if (/^uae$|emirates/i.test(v)) return "United Arab Emirates";
  if (/^uk$|britain|england/i.test(v)) return "United Kingdom";
  if (/^usa$|u\.s\.a?$|america/i.test(v)) return "United States";
  const hit = LOCATION_COUNTRIES.find(
    (c) => c !== "Other" && c.toLowerCase() === v.toLowerCase(),
  );
  return hit ?? v;
}

/** Select value for country dropdown (known name or LOCATION_OTHER). */
export function countrySelectValue(raw: string | undefined | null): string {
  const n = normalizeCountry(raw);
  const known = LOCATION_COUNTRIES.find(
    (c) => c !== "Other" && c.toLowerCase() === n.toLowerCase(),
  );
  return known ?? LOCATION_OTHER;
}

export function citiesForCountry(country: string): readonly string[] {
  const select = countrySelectValue(country);
  if (select === LOCATION_OTHER) return CITIES_BY_COUNTRY.Other;
  return CITIES_BY_COUNTRY[select] ?? CITIES_BY_COUNTRY.Other;
}

/** Map stored city names onto dataset keys (e.g. Delhi → Delhi NCR). */
export function normalizeCity(
  city: string | undefined | null,
  country: string,
): string {
  const v = (city || "").trim();
  if (!v) return citiesForCountry(country)[0] ?? "";
  if (/^bangalore$/i.test(v)) return "Bengaluru";
  if (/^delhi$|^new delhi$|^ncr$/i.test(v)) return "Delhi NCR";
  if (/^gurgaon$/i.test(v)) return "Delhi NCR";
  const list = citiesForCountry(country);
  const hit = list.find((c) => c.toLowerCase() === v.toLowerCase());
  return hit ?? v;
}

export function areasForCity(city: string): readonly string[] {
  const key = (city || "").trim();
  if (!key || key === ONLINE) return [];
  if (/^bangalore$/i.test(key)) return AREAS_BY_CITY.Bengaluru ?? [];
  if (/^delhi$/i.test(key)) return AREAS_BY_CITY["Delhi NCR"] ?? [];
  return AREAS_BY_CITY[key] ?? [];
}

export function isKnownCity(city: string, country: string): boolean {
  const v = (city || "").trim();
  if (!v) return false;
  const n = normalizeCity(city, country);
  return citiesForCountry(country).some(
    (c) => c.toLowerCase() === n.toLowerCase(),
  );
}

export function isKnownArea(area: string, city: string): boolean {
  const v = (area || "").trim();
  if (!v) return true;
  return areasForCity(city).some((a) => a.toLowerCase() === v.toLowerCase());
}

/** Default city when country changes. */
export function defaultCityForCountry(country: string): string {
  return citiesForCountry(country)[0] ?? "";
}
