import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { Doctor } from "@/components/site/doctor";
import { BookingForm } from "@/components/site/booking-form";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { TrustStrip } from "@/components/site/trust-strip";
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
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Services />
        <Doctor />
        <BookingForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
