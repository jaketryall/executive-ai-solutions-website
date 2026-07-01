import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Executive AI Solutions",
  description: "Premium web design, SEO & Google Ads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
