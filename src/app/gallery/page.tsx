import type { Metadata } from "next";
import { GalleryPage } from "@/components/site/gallery";

const title = "Gallery — See Our Clinic";
const description =
  "Take a visual tour of Sarada Netralaya — our modern operation theater, diagnostic equipment, waiting area, and optical services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title,
    description,
    url: "/gallery",
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
  return <GalleryPage />;
}
