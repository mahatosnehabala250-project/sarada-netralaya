import { TrackAppointment } from "@/components/site/track-appointment";

export const metadata = {
  title: "Track Your Appointment",
  description: "Check the status of your Sarada Netralaya appointment using your booking reference and phone number.",
};

export const dynamic = "force-dynamic";

export default function TrackPage() {
  return <TrackAppointment />;
}
