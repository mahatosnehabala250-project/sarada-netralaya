import type { Metadata } from "next";
import { GalleryPage } from "@/components/site/gallery";

export const metadata: Metadata = {
  title: "Gallery — See Our Clinic",
  description: "Take a visual tour of Sarada Netralaya — our modern operation theater, diagnostic equipment, waiting area, and optical services.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <GalleryPage />;
}
