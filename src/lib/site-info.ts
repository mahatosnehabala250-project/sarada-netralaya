// Central business information for Sarada Netralaya.
// Single source of truth used across the public site, SEO, and JSON-LD.
// Values below come from the client's official Website Details Form (Jul 2026).

export const SITE = {
  name: "Sarada Netralaya",
  legalName: "Sarada Netralaya & Maternity",
  tagline: "Clear Vision, Better Life",
  domain: "saradanetralaya.in",
  url: "https://saradanetralaya.in",
  description:
    "Eye care hospital in Baradwari, Jamshedpur — Cataract, Glaucoma, Retina, Pediatric, Squint & Pterygium care by Dr. Nitin G Dhira. Book your appointment online.",
  oneLiner:
    "A trusted specialty hospital providing advanced eye care and compassionate maternity services — with a commitment to quality, affordability and patient-centred care.",
  established: "2015",
  yearsExperience: "11", // hospital established 2015
  // No verified Google aggregate rating/review count was provided by the client,
  // so we intentionally do NOT display a fabricated star rating or review count.
} as const;

export const ADDRESS = {
  line1: "33, Swastik Ambika Tower",
  line2: "Near HDFC Bank, Baradwari",
  line3: "",
  city: "Jamshedpur",
  state: "Jharkhand",
  pincode: "",
  country: "IN",
  full: "33, Swastik Ambika Tower, Near HDFC Bank, Baradwari, Jamshedpur, Jharkhand",
  short: "Baradwari, Jamshedpur",
} as const;

export const BRANCHES = [
  {
    name: "Baradwari (Main)",
    area: "Baradwari, Jamshedpur",
    address: "33, Swastik Ambika Tower, Near HDFC Bank, Baradwari, Jamshedpur, Jharkhand",
    phones: ["+91 70910 90014", "+91 70910 90016"],
    phoneTels: ["+917091090014", "+917091090016"],
    mapQuery: "Sarada Netralaya, Swastik Ambika Tower, Baradwari, Jamshedpur, Jharkhand",
    isMain: true,
  },
] as const;

export const PHONES = {
  primary: "+91 70910 90014",
  primaryTel: "+917091090014",
  secondary: "+91 70910 90016",
  secondaryTel: "+917091090016",
  whatsapp: "917091090014",
  // Number that should receive online-booking notifications (per client form).
  bookingAlert: "+917091090016",
} as const;

export const EMAIL = "saradanetralayajsr@gmail.com";

export const SOCIAL = {
  instagram: "https://www.instagram.com/saradanetralayaandmaternity",
  facebook: "https://www.facebook.com/profile.php?id=61559926176336",
} as const;

export const HOURS = [
  { day: "Monday – Saturday", time: "9:30 AM – 7:00 PM" },
  { day: "Sunday", time: "Closed" },
] as const;

export const DOCTOR = {
  name: "Dr. Nitin G Dhira",
  qualifications: "DOMS, DNB, FICO (U.K.)",
  training: "L.V. Prasad Eye Institute, Hyderabad",
  role: "Consultant Eye Surgeon",
  bio: "With over three decades of dedicated ophthalmic practice, Dr. Nitin G Dhira leads Sarada Netralaya with a commitment to precision, safety and compassionate care. Trained at the renowned L.V. Prasad Eye Institute, Hyderabad, and holding the FICO qualification from the United Kingdom, he specialises in advanced topical Phaco cataract surgery, glaucoma management and comprehensive retinal evaluation.",
} as const;

export const DOCTORS = [
  {
    name: "Dr. Nitin G Dhira",
    qualifications: "DOMS, DNB, FICO (U.K.)",
    training: "L.V. Prasad Eye Institute, Hyderabad",
    role: "Consultant Eye Surgeon & Founder",
    experience: "30+ years",
    bio: "With over three decades of dedicated ophthalmic practice, Dr. Nitin G Dhira leads Sarada Netralaya with a commitment to precision, safety and compassionate care. Trained at the renowned L.V. Prasad Eye Institute, Hyderabad, and holding the FICO qualification from the United Kingdom, he specialises in advanced topical Phaco cataract surgery, glaucoma management and comprehensive retinal evaluation.",
    expertise: ["Topical Phaco Cataract Surgery", "Glaucoma Management", "Retinal Evaluation", "Oculoplasty"],
    surgeries: "10,000+",
    image: "/images/doctor-real.jpg",
  },
  {
    name: "Dr. Nitish R Bharadwaj",
    qualifications: "MBBS, DNB, FICO (U.K.), FCRS",
    training: "Shiv Ganapati Netralaya, Jalna, Maharashtra (DNB, FCRS)",
    role: "Consultant Eye Surgeon",
    experience: "8 years",
    bio: "Dr. Nitish R Bharadwaj is a skilled ophthalmic surgeon specializing in cataract surgery, pterygium excision, and keratoplasty (corneal transplant). He completed his DNB and FCRS fellowship at Shiv Ganapati Netralaya, Jalna, Maharashtra. With over 1,200 successful surgeries, he brings precision and advanced techniques to Sarada Netralaya. He holds the FICO qualification from the United Kingdom and has been recognized with multiple national awards.",
    expertise: ["Cataract Surgery", "Pterygium Excision", "Keratoplasty (Corneal Transplant)", "Comprehensive Eye Care"],
    surgeries: "1,200+",
    awards: [
      "Distinction in Microbiology (UG)",
      "3rd Prize — National PG Competition, OSAS 2018",
      "2nd Prize — Focus Online Quiz 2021",
      "Certificate of Excellence in Fellowship",
    ],
    image: null,
  },
] as const;

// Brand palette (used via arbitrary Tailwind values)
export const BRAND = {
  primary: "#0b6e8f",
  dark: "#084f67",
  accent: "#10b981",
  accentDark: "#059669",
  ink: "#0f2f3a",
} as const;
