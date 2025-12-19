"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Executive AI</h3>
            <p className="text-zinc-500 text-sm">
              Beautiful websites that convert.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-8">
            {[
              { label: "Work", href: "#work" },
              { label: "Services", href: "#services" },
              { label: "Process", href: "#process" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-zinc-500 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">
            © {currentYear} Executive AI Solutions
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-500 text-sm">Available for new projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
