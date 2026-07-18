import type { Metadata } from "next";
import { BookingPage } from "@/components/site/booking-page";

const title = "Book Appointment — Sarada Netralaya";
const description =
  "Book your eye care appointment online at Sarada Netralaya, Baradwari, Jamshedpur. Quick, easy, and secure. Our team will call you to confirm.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book" },
  openGraph: {
    title,
    description,
    url: "/book",
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
  return <BookingPage />;
}
