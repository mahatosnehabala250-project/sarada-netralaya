import type { Metadata } from "next";
import { BookingPage } from "@/components/site/booking-page";

export const metadata: Metadata = {
  title: "Book Appointment — Sarada Netralaya",
  description: "Book your eye care appointment online at Sarada Netralaya, Baradwari, Jamshedpur. Quick, easy, and secure. Our team will call you to confirm.",
};

export default function Page() {
  return <BookingPage />;
}
