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

// Consultation fee (₹) from the client form — used to ESTIMATE revenue on the
// admin dashboard (completed visits × fee). Change here to update the estimate.
export const CONSULTATION_FEE = 500;

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
  qualifications: "DNB, FICO (U.K.)",
  training: "International Council of Ophthalmology (ICO), United Kingdom",
  role: "Consultant Eye Surgeon & Founder",
  bio: "With 15 years of dedicated ophthalmic practice and over 1,000 surgeries performed, Dr. Nitin G Dhira leads Sarada Netralaya with a commitment to precision, safety and compassionate care. Holding the FICO qualification from the International Council of Ophthalmology (United Kingdom), he specialises in cataract surgery, squint correction and pterygium treatment.",
} as const;

export const DOCTORS = [
  {
    name: "Dr. Nitin G Dhira",
    qualifications: "DNB, FICO (U.K.)",
    training: "International Council of Ophthalmology (ICO), United Kingdom",
    role: "Consultant Eye Surgeon & Founder",
    experience: "15 years",
    bio: "With 15 years of dedicated ophthalmic practice and over 1,000 surgeries performed, Dr. Nitin G Dhira leads Sarada Netralaya with a commitment to precision, safety and compassionate care. Holding the FICO qualification from the International Council of Ophthalmology (United Kingdom), he specialises in cataract surgery, squint correction and pterygium treatment.",
    expertise: ["Cataract Surgery", "Squint Correction", "Pterygium", "Glaucoma & Retina"],
    surgeries: "1,000+",
    awards: [
      "Ophthalmic Premier League Award",
      "Academic Presentations",
    ],
    image: "/images/doctor-real.png",
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

// Real patient reviews (provided by the clinic / Google). Displayed verbatim
// with light typo cleanup only. Google profile:
export const REVIEWS_URL =
  "https://www.google.com/search?q=Sarada+Netralaya+Baradwari+Jamshedpur+reviews";

export const REVIEWS = [
  {
    name: "Anindya Mukherji",
    detail: "Cataract Surgery",
    when: "4 months ago",
    rating: 5,
    text: "We had an exceptional experience at Sarada Netralaya for my mother's phaco cataract surgery. From the moment we entered, the atmosphere was calm, caring, and very reassuring. The staff were incredibly supportive and went above and beyond. Dr Nitin is extremely humble, attentive and patient-focused — he took the time to explain every step in simple terms and made sure we understood everything before and after surgery. The whole process felt well organised and stress-free, the follow-ups were excellent, and the package was generous and very reasonably priced. In today's busy healthcare environment, it is rare to find such warmth, patience and genuine care. Truly grateful to Dr Nitin and his team. Definitely recommended.",
  },
  {
    name: "Nand Singh",
    detail: "Glaucoma & Cataract",
    when: "11 months ago",
    rating: 5,
    text: "Sarada Netralaya is the super-speciality eye care hospital in Jamshedpur. I always preferred to visit Sankara Nethralaya, Chennai for glaucoma treatment, but after meeting Dr. Nitin G. Dhira I started my treatment here. I had an excellent experience for glaucoma treatment and cataract surgery. I am fully satisfied and no longer need to travel to Chennai. The doctor and staff are soft-spoken, cooperative and very attentive. I recommend others to visit Sarada Netralaya if needed.",
  },
  {
    name: "Ashwani Upadhyay",
    detail: "Squint Surgery",
    when: "6 months ago",
    rating: 5,
    text: "Sarada Netralaya is the best eye hospital in the city. I was a squint patient and Dr. Nitin Dhira performed a 100% successful surgery on me. This hospital is very good — all the staff here are very helpful and the cleanliness is excellent.",
  },
  {
    name: "Satya Bhui",
    detail: "Eye Surgery",
    when: "4 months ago",
    rating: 5,
    text: "The staff were very kind and supportive, the service was quick, and everything was well coordinated. A big thanks to Dr. Nitin Dhira sir for his excellent care and guidance. My mother also had her eye surgery with the same doctor earlier, and both experiences have been excellent. We truly appreciate the care and support.",
  },
  {
    name: "Verified Patient",
    detail: "Eye Surgery",
    when: "Recently",
    rating: 5,
    text: "We had a very good experience at Sarada Netralaya for my mother's eye surgery. Excellent service from start to finish. The doctors, nurses and staff were very kind, supportive and professional. They explained everything clearly and took great care of my mother throughout the treatment. The environment was clean and well-managed. We are thankful for their dedication and care. Highly recommended.",
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
