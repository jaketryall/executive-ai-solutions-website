import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Jake Ryall",
  description:
    "Selected projects and case studies. See the custom websites I've designed and built for ambitious brands.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
