import type { Metadata } from "next";
import { DoctorsPage } from "@/components/site/doctors-page";

const title = "Our Doctors — Meet the Surgeons";
const description =
  "Meet Dr. Nitin G Dhira and Dr. Nitish R Bharadwaj — qualified ophthalmic surgeons at Sarada Netralaya, Baradwari, Jamshedpur.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/doctors" },
  openGraph: {
    title,
    description,
    url: "/doctors",
    type: "website",
    images: [{ url: "/images/hero-final.jpg", width: 1672, height: 941, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-final.jpg"],
  },
};

export default function Page() {
  return <DoctorsPage />;
}
