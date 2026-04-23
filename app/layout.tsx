import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { SoundProvider } from "@/components/SoundManager";
import { PageTransitionProvider } from "@/components/PageTransition";
import ScrollProgress from "@/components/ui/ScrollProgress";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: "variable",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f3f1ee",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jakeryall.com"),
  title: "Jake Ryall — Motion-forward design engineer",
  description:
    "I design and ship interfaces that move — the kind of work most agencies can't pull off. Selected projects, experiments, and case studies.",
  keywords:
    "Jake Ryall, design engineer, motion design, UI engineering, interaction design, GSAP, Framer Motion, Next.js, portfolio",
  authors: [{ name: "Jake Ryall" }],
  openGraph: {
    title: "Jake Ryall — Motion-forward design engineer",
    description: "I design and ship interfaces that move.",
    url: "https://jakeryall.com",
    siteName: "Jake Ryall",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Ryall — Motion-forward design engineer",
    description: "I design and ship interfaces that move.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/video-poster.webp" as="image" type="image/webp" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans`}>
        <SoundProvider>
          <PageTransitionProvider>
            <ScrollProgress />
            <CustomCursor />
            <SmoothScroll>{children}</SmoothScroll>
          </PageTransitionProvider>
        </SoundProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
