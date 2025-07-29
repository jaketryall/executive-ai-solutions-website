"use client";

import { ReactNode } from "react";

interface ResponsiveWrapperProps {
  desktop: ReactNode;
  mobile: ReactNode;
  breakpoint?: string;
}

export default function ResponsiveWrapper({ 
  desktop, 
  mobile, 
  breakpoint = "lg" 
}: ResponsiveWrapperProps) {
  return (
    <>
      {/* Mobile version - CSS-only visibility */}
      <div className={`${breakpoint}:hidden`}>
        {mobile}
      </div>
      
      {/* Desktop version - CSS-only visibility */}
      <div className={`hidden ${breakpoint}:block`}>
        {desktop}
      </div>
    </>
  );
}