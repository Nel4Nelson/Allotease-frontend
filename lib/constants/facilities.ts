export interface PredefinedFacility {
  name: string;
  category: string;
  icon?: string;
}

export const PREDEFINED_FACILITIES: PredefinedFacility[] = [
  // Essentials
  { name: "WiFi / Internet", category: "Essentials" },
  { name: "Electricity (24/7 or Generator Backup)", category: "Essentials" },
  { name: "Air Conditioning / Fan", category: "Essentials" },
  { name: "Heating", category: "Essentials" },
  { name: "Water Supply", category: "Essentials" },
  { name: "Security (CCTV / Guard / Gated)", category: "Essentials" },

  // Comfort & Convenience
  { name: "Parking Space", category: "Comfort & Convenience" },
  { name: "Kitchen Access", category: "Comfort & Convenience" },
  { name: "Laundry (Washing Machine / Dryer)", category: "Comfort & Convenience" },
  { name: "Cleaning Service", category: "Comfort & Convenience" },
  { name: "Elevator", category: "Comfort & Convenience" },

  // Entertainment & Lifestyle
  { name: "TV / Cable", category: "Entertainment & Lifestyle" },
  { name: "Sound System", category: "Entertainment & Lifestyle" },
  { name: "Swimming Pool", category: "Entertainment & Lifestyle" },
  { name: "Gym / Fitness Center", category: "Entertainment & Lifestyle" },
  { name: "Lounge / Common Area", category: "Entertainment & Lifestyle" },

  // Business & Work
  { name: "Workspace / Desk", category: "Business & Work" },
  { name: "Co-working Facilities", category: "Business & Work" },
  { name: "Conference / Meeting Room", category: "Business & Work" },

  // Extras
  { name: "Balcony / Terrace", category: "Extras" },
  { name: "Outdoor Space / Garden", category: "Extras" },
  { name: "Pet-Friendly", category: "Extras" },
  { name: "Wheelchair Accessible", category: "Extras" },
];

export const FACILITY_CATEGORIES = [
  "Essentials",
  "Comfort & Convenience",
  "Entertainment & Lifestyle",
  "Business & Work",
  "Extras",
];