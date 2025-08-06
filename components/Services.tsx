"use client";

export default function Services() {

  const services = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 14H28" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8" cy="11" r="1" fill="currentColor"/>
          <circle cx="12" cy="11" r="1" fill="currentColor"/>
          <circle cx="16" cy="11" r="1" fill="currentColor"/>
        </svg>
      ),
      title: "Website Development",
      description: "Modern, responsive websites built with the latest technologies.",
      tags: [
        { icon: "⚡", label: "Next.js & React" },
        { icon: "🎨", label: "Custom Design" },
        { icon: "📱", label: "Mobile First" },
        { icon: "🚀", label: "Fast Loading" }
      ],
      dots: [true, true, true, false, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 12H26" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V26" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 16L20 20M20 16L16 20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "E-commerce Solutions",
      description: "Complete online stores with AI-powered recommendations.",
      tags: [
        { icon: "🛒", label: "Shopping Cart" },
        { icon: "💳", label: "Payment Gateway" },
        { icon: "🤖", label: "AI Recommendations" },
        { icon: "📊", label: "Analytics" }
      ],
      dots: [true, true, false, true, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 16L28 10" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 16L4 10" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 16V28" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Web Applications",
      description: "Custom web apps with intelligent features and automation.",
      tags: [
        { icon: "⚙️", label: "SaaS Platforms" },
        { icon: "🔐", label: "User Auth" },
        { icon: "🎯", label: "Custom Logic" },
        { icon: "📱", label: "Progressive Web" }
      ],
      dots: [true, true, true, false, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="10" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 6L16 10L22 6" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 16H24" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 20H20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Landing Pages",
      description: "High-converting pages optimized for your marketing campaigns.",
      tags: [
        { icon: "🎯", label: "A/B Testing" },
        { icon: "📈", label: "Conversion Optimized" },
        { icon: "⚡", label: "Fast Loading" },
        { icon: "📱", label: "Mobile Ready" }
      ],
      dots: [true, false, true, true, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 12H22" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 16H18" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 20H14" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "CMS Integration",
      description: "Headless CMS setup with AI content generation tools.",
      tags: [
        { icon: "📝", label: "Content Management" },
        { icon: "🤖", label: "AI Writing Tools" },
        { icon: "🔄", label: "Easy Updates" },
        { icon: "👥", label: "Multi-user" }
      ],
      dots: [true, true, false, false, true]
    }
  ];

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0066ff]/5 to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group"
            >
              <div className="bg-zinc-900/50 rounded-3xl p-10 h-full hover:shadow-xl hover:shadow-[#0066ff]/10 transition-shadow duration-300 border border-zinc-800 hover:border-zinc-700">
                {/* Top Section with Icon and Dots */}
                <div className="flex items-start justify-between mb-8">
                  {/* Icon */}
                  <div className="text-white">{service.icon}</div>
                  
                  {/* Decorative Dots */}
                  <div className="flex gap-1.5">
                    {service.dots.map((isActive, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-[#0066ff]' : 'bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* Tags Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {service.tags.map((tag, tagIndex) => (
                    <div
                      key={tagIndex}
                      className="flex items-center gap-2.5"
                    >
                      <span className="text-zinc-500 text-lg">{tag.icon}</span>
                      <span className="text-zinc-400 text-sm">{tag.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Extra Card - if odd number of services */}
          <div className="group lg:col-span-1">
            <div className="bg-zinc-900 rounded-3xl p-10 h-full hover:shadow-xl transition-shadow duration-300 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Need Something Custom?
                </h3>
                <p className="text-zinc-400 mb-6">
                  Let&apos;s discuss your unique website requirements
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 bg-[#0066ff] text-white font-medium rounded-full hover:bg-[#0052cc] transition-colors duration-300"
                >
                  Get Started
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}