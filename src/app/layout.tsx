import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://saradanetralaya.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Sarada Netralaya — Advanced Eye Care Hospital in Sakchi, Jamshedpur",
    template: "%s | Sarada Netralaya",
  },
  description:
    "Sarada Netralaya — Advanced Eye Care Hospital in Sakchi, Jamshedpur. Cataract, Glaucoma, Retina. Book appointment online.",
  keywords: [
    "eye hospital Jamshedpur",
    "Sarada Netralaya",
    "cataract surgery Jamshedpur",
    "eye care Sakchi",
    "Dr Nitin Dhira",
    "ophthalmologist Jamshedpur",
    "glaucoma treatment",
    "retina specialist",
    "Phaco surgery",
    "book eye appointment",
  ],
  authors: [{ name: "Sarada Netralaya" }],
  creator: "Sarada Netralaya",
  publisher: "Sarada Netralaya",
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#0b6e8f"/><ellipse cx="50" cy="50" rx="34" ry="20" fill="none" stroke="#fff" stroke-width="6"/><circle cx="50" cy="50" r="11" fill="#34d399"/><circle cx="54" cy="46" r="3.5" fill="#0b6e8f"/></svg>'
          ),
      },
    ],
  },
  openGraph: {
    title:
      "Sarada Netralaya — Advanced Eye Care Hospital in Sakchi, Jamshedpur",
    description:
      "30+ years of trusted eye care. Cataract, Glaucoma, Retina, Oculoplasty. Latest Phaco & laser facility. Book appointment online.",
    url: SITE_URL,
    siteName: "Sarada Netralaya",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Sarada Netralaya — Advanced Eye Care Hospital in Sakchi, Jamshedpur",
    description:
      "30+ years of trusted eye care. Cataract, Glaucoma, Retina. Book appointment online.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "medical",
};

export const viewport: Viewport = {
  themeColor: "#0b6e8f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
