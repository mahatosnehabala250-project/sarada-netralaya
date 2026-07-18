import type { Metadata } from "next";
import { ReviewsPage } from "@/components/site/reviews-page";

const title = "Patient Reviews — What Our Patients Say";
const description =
  "Read genuine patient reviews from Sarada Netralaya, Baradwari, Jamshedpur — straight from Google.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/reviews" },
  openGraph: {
    title,
    description,
    url: "/reviews",
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

export default function Page() {
  return <ReviewsPage />;
}
