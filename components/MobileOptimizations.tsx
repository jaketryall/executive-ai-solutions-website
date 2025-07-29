"use client";

import { useMobileOptimizations, useResourceHints } from "@/hooks/useMobileOptimizations";

export default function MobileOptimizations() {
  useMobileOptimizations();
  useResourceHints();
  
  return null;
}