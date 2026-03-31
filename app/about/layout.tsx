import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Jake Ryall",
  description:
    "I'm Jake Ryall, a web designer and developer based in Arizona. I build websites that convert visitors into customers and rank on Google.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
