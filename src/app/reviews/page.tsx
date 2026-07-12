import type { Metadata } from "next";
import { ReviewsPage } from "@/components/site/reviews-page";

export const metadata: Metadata = {
  title: "Patient Reviews — What Our Patients Say",
  description: "Read genuine patient reviews and testimonials from Sarada Netralaya. 4.9 star rating from 329+ Google reviews.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <ReviewsPage />;
}
