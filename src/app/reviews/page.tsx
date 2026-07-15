import type { Metadata } from "next";
import { ReviewsPage } from "@/components/site/reviews-page";

export const metadata: Metadata = {
  title: "Patient Reviews — What Our Patients Say",
  description: "Read genuine patient reviews from Sarada Netralaya, Baradwari, Jamshedpur — straight from Google.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <ReviewsPage />;
}
