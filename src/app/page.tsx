import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { StatsBand } from "@/components/site/stats-band";
import { Services } from "@/components/site/services";
import { Doctor } from "@/components/site/doctor";
import { Testimonials } from "@/components/site/testimonials";
import { GalleryPreview } from "@/components/site/gallery-preview";
import { BookingForm } from "@/components/site/booking-form";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { MobileCtaBar, ScrollToTop } from "@/components/site/mobile-cta";
import { SITE, ADDRESS, PHONES, EMAIL, DOCTOR } from "@/lib/site-info";

// JSON-LD structured data: MedicalClinic (subtype of LocalBusiness)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${SITE.url}/#clinic`,
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: PHONES.primaryTel,
  email: EMAIL,
  image: `${SITE.url}/images/hero-eye.png`,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${ADDRESS.line1}, ${ADDRESS.line2}, ${ADDRESS.line3}`,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.pincode,
    addressCountry: ADDRESS.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.8026,
    longitude: 86.2052,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SITE.rating,
    reviewCount: 329,
    bestRating: "5",
    worstRating: "1",
  },
  medicalSpecialty: ["Ophthalmology", "Optometric"],
  employee: {
    "@type": "Physician",
    name: DOCTOR.name,
    qualifications: `${DOCTOR.qualifications}, ${DOCTOR.training}`,
    medicalSpecialty: "Ophthalmology",
  },
  areaServed: {
    "@type": "City",
    name: "Jamshedpur",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/#services` },
    { "@type": "ListItem", position: 3, name: "Book Appointment", item: `${SITE.url}/#book` },
  ],
};

// FAQ structured data (rich result eligible)
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Topical Phaco cataract surgery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Topical Phaco is a modern, stitch-free cataract technique performed using only eye drops as anaesthesia — no injection and no patch. Most patients feel no pain and recover vision within a day.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book an appointment at Sarada Netralaya?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book online via the appointment form on this page, call +91 70910 90014 / 90016, or chat on WhatsApp. Online bookings receive a 6-digit reference number.",
      },
    },
    {
      "@type": "Question",
      name: "What are the timings of Sarada Netralaya?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We are open Monday to Saturday, 10:00 AM to 7:30 PM. Sunday is closed.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatsBand />
        <Services />
        <Doctor />
        <Testimonials />
        <GalleryPreview />
        <BookingForm />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <MobileCtaBar />
      <ScrollToTop />
    </div>
  );
}
