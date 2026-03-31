import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Jake Ryall",
  description:
    "Get in touch to discuss your next web project. I typically respond within 24 hours. Based in Arizona, working worldwide.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
