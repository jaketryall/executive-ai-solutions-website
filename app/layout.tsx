import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { SoundProvider } from "@/components/SoundManager";
import { PageTransitionProvider } from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
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
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans`}>
        <SoundProvider>
          <PageTransitionProvider>
            <CustomCursor />
            <SmoothScroll>{children}</SmoothScroll>
          </PageTransitionProvider>
        </SoundProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
