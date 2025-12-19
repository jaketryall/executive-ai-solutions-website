import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "Executive AI - Web Design Studio",
  description:
    "We create digital experiences that convert. Award-winning design studio crafting premium websites for ambitious brands.",
  keywords:
    "web design, website design, web development, UI/UX design, brand identity, e-commerce, digital agency",
  authors: [{ name: "Executive AI" }],
  openGraph: {
    title: "Executive AI - Web Design Studio",
    description:
      "We create digital experiences that convert. Award-winning design studio crafting premium websites for ambitious brands.",
    url: "https://executiveai.com",
    siteName: "Executive AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive AI - Web Design Studio",
    description:
      "We create digital experiences that convert. Award-winning design studio crafting premium websites.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <SmoothScroll>{children}</SmoothScroll>
        <SpeedInsights />
      </body>
    </html>
  );
}
