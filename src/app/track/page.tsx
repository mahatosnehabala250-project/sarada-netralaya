import type { Metadata } from "next";
import { TrackAppointment } from "@/components/site/track-appointment";

const title = "Track Your Appointment";
const description =
  "Check the status of your Sarada Netralaya appointment using your booking reference and phone number.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/track" },
  openGraph: {
    title,
    description,
    url: "/track",
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

export const dynamic = "force-dynamic";

export default function TrackPage() {
  return <TrackAppointment />;
}
