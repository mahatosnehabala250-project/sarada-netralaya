import type { Metadata } from "next";
import { DoctorsPage } from "@/components/site/doctors-page";

export const metadata: Metadata = {
  title: "Our Doctors — Meet the Surgeons",
  description:
    "Meet Dr. Nitin G Dhira and Dr. Nitish R Bharadwaj — qualified ophthalmic surgeons at Sarada Netralaya, Baradwari, Jamshedpur.",
};

export default function Page() {
  return <DoctorsPage />;
}
