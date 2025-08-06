"use client";

export default function Services() {

  const services = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="18" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="4" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="18" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "AI Process Automation",
      description: "Modern, efficiency-focused solutions for workflows and operations.",
      tags: [
        { icon: "📄", label: "Workflow design" },
        { icon: "⚡", label: "SaaS integration" },
        { icon: "🎯", label: "Process optimization" },
        { icon: "🔄", label: "Automation setup" }
      ],
      dots: [true, false, false, false, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M16 4L4 12V20L16 28L28 20V12L16 4Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 28V20" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 12L16 20L28 12" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 9L16 12L22 9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Custom AI Development",
      description: "Perfect for enterprises, startups, and product launches.",
      tags: [
        { icon: "🤖", label: "AI bots to Agents" },
        { icon: "🔧", label: "CMS setup" },
        { icon: "📱", label: "Animation" },
        { icon: "🎯", label: "API optimization" }
      ],
      dots: [true, true, false, true, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M11 16H21" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 6V26" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Brand Identity",
      description: "Visual systems that make your brand memorable and cohesive.",
      tags: [
        { icon: "🎨", label: "Logo design" },
        { icon: "🎨", label: "Color palette" },
        { icon: "📋", label: "Guidelines" },
        { icon: "📱", label: "Social branding" }
      ],
      dots: [true, true, false, false, false]
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
      title: "Marketing Graphics",
      description: "Quick, polished visuals for daily content, campaigns, and launches.",
      tags: [
        { icon: "📱", label: "Social media posts" },
        { icon: "📧", label: "Ad creatives" },
        { icon: "📰", label: "Blog thumbnails" },
        { icon: "✉️", label: "Email visuals" }
      ],
      dots: [true, true, true, true, false]
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 10L12 16L4 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M28 10L20 16L28 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Pitch & Product Collateral",
      description: "Assets that elevate your messaging and boost perception.",
      tags: [
        { icon: "🎯", label: "Pitch decks" },
        { icon: "📊", label: "Case study" },
        { icon: "📝", label: "One-pagers" },
        { icon: "📸", label: "screenshots" }
      ],
      dots: [true, true, true, true, true]
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
                  Let&apos;s discuss your unique AI requirements
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