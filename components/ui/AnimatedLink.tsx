"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface AnimatedLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}

export default function AnimatedLink({
  children,
  href,
  className = "",
  external = false,
}: AnimatedLinkProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} {...linkProps} className={`group relative inline-flex items-center gap-2 ${className}`}>
      <span className="relative">
        {children}
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-current origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ width: "100%" }}
        />
      </span>
    </Link>
  );
}
