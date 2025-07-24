import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./output.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Executive AI Solutions - Your AI Workforce",
  description: "Deploy AI employees that never sleep. Scale without limits. Practical AI solutions for businesses including workflow automation, landing page creation, and AI consulting.",
  keywords: "AI automation, AI workforce, AI employees, workflow automation, AI consulting, landing page creation",
  authors: [{ name: "Executive AI Solutions" }],
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
