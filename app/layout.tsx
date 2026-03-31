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
  metadataBase: new URL("https://executiveaisolutions.com"),
  title: "Jake Ryall — Web Designer & Developer",
  description:
    "I design and build high-converting websites for ambitious brands. Custom web design, development, and SEO in Arizona.",
  keywords:
    "Jake Ryall, web designer, web developer, Arizona, freelance, portfolio, website design, web development, UI/UX design, SEO",
  authors: [{ name: "Jake Ryall" }],
  openGraph: {
    title: "Jake Ryall — Web Designer & Developer",
    description:
      "I design and build high-converting websites for ambitious brands. Custom web design, development, and SEO in Arizona.",
    url: "https://executiveaisolutions.com",
    siteName: "Jake Ryall",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Ryall — Web Designer & Developer",
    description:
      "I design and build high-converting websites for ambitious brands. Custom web design, development, and SEO in Arizona.",
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
    <html lang="en" className="bg-[#0a0908]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preload hero video poster for instant display */}
        <link rel="preload" href="/video-poster.webp" as="image" type="image/webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Jake Ryall",
              jobTitle: "Web Designer & Developer",
              url: "https://executiveaisolutions.com",
              description:
                "I design and build high-converting websites for ambitious brands. Custom web design, development, and SEO in Arizona.",
              address: {
                "@type": "PostalAddress",
                addressRegion: "AZ",
                addressCountry: "US",
              },
              sameAs: [
                "https://www.linkedin.com/in/jake-ryall",
                "https://github.com/jaketryall",
                "https://instagram.com/exec.ai.solutions",
                "https://dribbble.com/jake-ryall",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans bg-[#0a0908]`}>
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
