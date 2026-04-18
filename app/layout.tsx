import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pixel Bouquet",
    template: "%s | Pixel Bouquet",
  },
  description:
    "Craft and share personalized digital flower bouquets with heartfelt messages.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Pixel Bouquet",
    title: "Pixel Bouquet",
    description:
      "Craft and share personalized digital flower bouquets with heartfelt messages.",
    images: [
      {
        url: "/Quiet Love Bouquet.png",
        width: 1200,
        height: 630,
        alt: "Pixel Bouquet floral arrangement preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Bouquet",
    description:
      "Craft and share personalized digital flower bouquets with heartfelt messages.",
    images: ["/Quiet Love Bouquet.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "gifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
