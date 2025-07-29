import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MobileOptimizations from "@/components/MobileOptimizations";
import "./output.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // For iPhone X+ notch
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Executive AI Solutions - Your AI Workforce",
  description: "Deploy AI employees that never sleep. Scale without limits. Practical AI solutions for businesses including workflow automation, landing page creation, and AI consulting.",
  keywords: "AI automation, AI workforce, AI employees, workflow automation, AI consulting, landing page creation",
  authors: [{ name: "Executive AI Solutions" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Executive AI",
  },
  formatDetection: {
    telephone: false, // Disable auto phone number detection
  },
  openGraph: {
    title: "Executive AI Solutions - Your AI Workforce",
    description: "Deploy AI employees that never sleep. Scale without limits.",
    url: "https://executiveaisolutions.com",
    siteName: "Executive AI Solutions",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive AI Solutions - Your AI Workforce",
    description: "Deploy AI employees that never sleep. Scale without limits.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Mobile web app capable - modern syntax */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* iOS specific optimizations */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Prevent zoom on form inputs for iOS */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Favicon - Multiple sizes for different contexts */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png?v=2" />
        <link rel="shortcut icon" href="/favicon.png?v=2" />
        
        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} relative`}>
        <MobileOptimizations />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
