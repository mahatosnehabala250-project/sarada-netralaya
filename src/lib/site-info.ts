// Central business information for Sarada Netralaya.
// Single source of truth used across the public site, SEO, and JSON-LD.

export const SITE = {
  name: "Sarada Netralaya",
  tagline: "Passion for Excellence • Committed to Care",
  domain: "saradanetralaya.in",
  url: "https://saradanetralaya.in",
  description:
    "Advanced Eye Care Hospital in Sakchi, Jamshedpur. Cataract, Glaucoma, Retina. Book appointment online.",
  rating: "4.9",
  reviewsCount: "329+",
  yearsExperience: "30+",
} as const;

export const ADDRESS = {
  line1: "Swastik Ambika Tower, H.No. 33",
  line2: "Near HDFC Bank, Kashidih New Layout Area",
  line3: "New Baradwari, Sakchi",
  city: "Jamshedpur",
  state: "Jharkhand",
  pincode: "831001",
  country: "IN",
  full: "Swastik Ambika Tower, H.No. 33, Near HDFC Bank, Kashidih New Layout Area, New Baradwari, Sakchi, Jamshedpur – 831001",
  short: "Sakchi, Jamshedpur – 831001",
} as const;

export const PHONES = {
  primary: "+91 70910 90014",
  primaryTel: "+917091090014",
  secondary: "+91 70910 90016",
  secondaryTel: "+917091090016",
  whatsapp: "917091090014",
} as const;

export const EMAIL = "saradanetralayajsr@gmail.com";

export const HOURS = [
  { day: "Monday – Saturday", time: "10:00 AM – 7:30 PM" },
  { day: "Sunday", time: "Closed" },
] as const;

export const DOCTOR = {
  name: "Dr. Nitin G Dhira",
  qualifications: "DOMS, DNB, FICO (U.K.)",
  training: "L.V. Prasad Eye Institute, Hyderabad",
  role: "Consultant Eye Surgeon",
  bio: "With over three decades of dedicated ophthalmic practice, Dr. Nitin G Dhira leads Sarada Netralaya with a commitment to precision, safety and compassionate care. Trained at the renowned L.V. Prasad Eye Institute, Hyderabad, and holding the FICO qualification from the United Kingdom, he specialises in advanced topical Phaco cataract surgery, glaucoma management and comprehensive retinal evaluation.",
} as const;

// Brand palette (used via arbitrary Tailwind values)
export const BRAND = {
  primary: "#0b6e8f",
  dark: "#084f67",
  accent: "#10b981",
  accentDark: "#059669",
  ink: "#0f2f3a",
} as const;
