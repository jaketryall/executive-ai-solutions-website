"use client";

import { ReactNode, useEffect } from "react";

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Return children directly without wrapper to preserve sticky contexts
  return <>{children}</>;
}
