export default function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-medium mb-4 text-white">Executive AI Solutions</h3>
            <p className="text-zinc-500 mb-4 font-light">
              Deploy AI employees that never sleep. Scale without limits.
            </p>
            <p className="text-sm text-zinc-600">
              © 2025 Executive AI Solutions. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-zinc-500 hover:text-[#93bbfd] transition-colors duration-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#use-cases" className="text-zinc-500 hover:text-[#93bbfd] transition-colors duration-300">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#about" className="text-zinc-500 hover:text-[#93bbfd] transition-colors duration-300">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-zinc-500 hover:text-[#93bbfd] transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <a href="mailto:hello@executiveaisolutions.com" className="hover:text-[#93bbfd] transition-colors duration-300">
                  hello@executiveaisolutions.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}