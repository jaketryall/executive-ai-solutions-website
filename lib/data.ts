// Project and Service data with TypeScript interfaces
// Centralized data layer for dynamic routing

// =============================================================================
// TYPES
// =============================================================================

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  heroImage: string;
  gallery: string[];
  year: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: ProjectMetric[];
  testimonial: ProjectTestimonial;
  color: string;
  warmColor: string;
}

export interface ServiceProcess {
  step: string;
  description: string;
}

export interface Service {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  longDescription: string;
  benefits: string[];
  process: ServiceProcess[];
  relatedProjects: string[]; // slugs of related projects
}

// =============================================================================
// PROJECTS DATA
// =============================================================================

export const projects: Project[] = [
  {
    slug: "desert-wings",
    title: "DESERT WINGS",
    category: "Aviation",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2000&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=80",
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200&q=80",
      "https://images.unsplash.com/photo-1559628233-100c798642d4?w=1200&q=80",
    ],
    year: "2024",
    tagline: "Where luxury meets the horizon",
    description: "A complete digital transformation for a premium charter service, replacing dated systems with an experience as refined as the journey itself.",
    challenge: "Desert Wings had built an impeccable reputation for luxury aviation, but their digital presence told a different story. An outdated booking system created friction, their website failed to convey the premium experience, and they were losing high-net-worth clients to competitors with more sophisticated digital touchpoints.",
    solution: "We reimagined every digital interaction from the ground up. A bespoke booking platform with real-time availability, immersive virtual tours of their fleet, and a concierge portal that lets clients manage every detail of their journey. The visual language we developed captures the essence of desert luxury aviation.",
    result: "340% increase in bookings",
    metrics: [
      { label: "Booking Increase", value: "340%" },
      { label: "Client Retention", value: "92%" },
      { label: "Average Booking Value", value: "+67%" },
      { label: "Time to Book", value: "-78%" },
    ],
    testimonial: {
      quote: "They didn't just build us a website. They understood what our clients expect and translated that into every pixel. The results speak for themselves.",
      author: "Marcus Sterling",
      role: "CEO, Desert Wings Aviation",
    },
    color: "#2a3f5f",
    warmColor: "rgba(255, 200, 150, 0.12)",
  },
  {
    slug: "meridian",
    title: "MERIDIAN",
    category: "Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
    ],
    year: "2024",
    tagline: "Presence that commands the room",
    description: "Crafting an executive digital presence that reflects the caliber of counsel within. Every interaction designed to build trust.",
    challenge: "Meridian Consulting had decades of experience advising Fortune 500 executives, but their digital presence was indistinguishable from countless other consultancies. In a world where first impressions happen online, they needed a platform that conveyed their unique positioning and deep expertise.",
    solution: "We developed a thought leadership platform that positions their consultants as the authorities they are. Custom content frameworks, case study presentations that tell compelling stories, and a client portal that reinforces their premium positioning. Every element designed to build trust before the first meeting.",
    result: "87% more qualified leads",
    metrics: [
      { label: "Qualified Leads", value: "+87%" },
      { label: "Engagement Rate", value: "4.2x" },
      { label: "Content Shares", value: "+156%" },
      { label: "Client Inquiries", value: "+94%" },
    ],
    testimonial: {
      quote: "Our digital presence finally matches who we are in the room. Prospects arrive to meetings already trusting us. That's invaluable.",
      author: "Dr. Elena Vasquez",
      role: "Managing Partner, Meridian Consulting",
    },
    color: "#3d2c1f",
    warmColor: "rgba(255, 180, 120, 0.15)",
  },
  {
    slug: "apex",
    title: "APEX",
    category: "Design Studio",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    year: "2023",
    tagline: "Art demands attention",
    description: "An immersive gallery experience for a creative studio, letting their work speak through considered presentation.",
    challenge: "Apex Design Studio creates stunning interior spaces, but their portfolio site was doing their work a disservice. Compressed images, clunky navigation, and a template-based design that looked like every other studio. Their exceptional work deserved an exceptional showcase.",
    solution: "We built an immersive portfolio experience that treats each project as a story worth telling. Full-screen imagery, scroll-driven narratives, and micro-interactions that invite exploration. The site itself became a demonstration of the studio's design philosophy.",
    result: "4.2x project inquiries",
    metrics: [
      { label: "Project Inquiries", value: "4.2x" },
      { label: "Time on Site", value: "+340%" },
      { label: "Portfolio Views", value: "+520%" },
      { label: "Social Shares", value: "+280%" },
    ],
    testimonial: {
      quote: "They understood that for a design studio, the website IS the portfolio. They made our work shine.",
      author: "Jonathan Park",
      role: "Creative Director, Apex Design",
    },
    color: "#2d1f3d",
    warmColor: "rgba(255, 190, 140, 0.12)",
  },
  {
    slug: "vertex",
    title: "VERTEX",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2000&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80",
    ],
    year: "2023",
    tagline: "Clarity in complexity",
    description: "Distilling sophisticated technology into an experience that resonates. Making the complex feel intuitive.",
    challenge: "Vertex had built groundbreaking analytics technology, but struggled to communicate its value. Their product was powerful but their website was dense with jargon. Sales cycles were long because prospects didn't understand what they were buying.",
    solution: "We translated complex technology into compelling narratives. Interactive demonstrations that let visitors experience the product. A progressive disclosure approach that starts simple and reveals depth on demand. Technical accuracy without the intimidation.",
    result: "156% more demos",
    metrics: [
      { label: "Demo Requests", value: "+156%" },
      { label: "Sales Cycle", value: "-42%" },
      { label: "Conversion Rate", value: "+89%" },
      { label: "Documentation Use", value: "+234%" },
    ],
    testimonial: {
      quote: "For the first time, our prospects actually understand what we do before the first call. That changes everything.",
      author: "Sarah Chen",
      role: "VP of Marketing, Vertex Technologies",
    },
    color: "#1f2d3d",
    warmColor: "rgba(255, 200, 160, 0.12)",
  },
];

// =============================================================================
// SERVICES DATA
// =============================================================================

export const services: Service[] = [
  {
    slug: "strategy",
    number: "01",
    title: "STRATEGY",
    subtitle: "The Blueprint",
    description: "We map the terrain before we build. Deep discovery, market analysis, and strategic positioning that ensures every decision serves your goals.",
    details: [
      "Comprehensive brand and market analysis",
      "User research and journey mapping",
      "Strategic roadmap development",
    ],
    longDescription: "Every exceptional digital experience begins with understanding. We don't start with solutions—we start with questions. Who are your users? What do they need? Where are the opportunities your competitors have missed? Our strategy phase is an intensive exploration that uncovers insights and translates them into actionable direction. This isn't strategy theater. It's the foundation that makes everything else possible.",
    benefits: [
      "Crystal clear understanding of your market position",
      "User insights that drive every design decision",
      "A roadmap that aligns teams and stakeholders",
      "Reduced risk through validated assumptions",
      "Competitive advantages you can actually defend",
    ],
    process: [
      { step: "Discovery", description: "Deep dive into your business, users, and market landscape" },
      { step: "Research", description: "User interviews, competitive analysis, and data synthesis" },
      { step: "Analysis", description: "Pattern identification and opportunity mapping" },
      { step: "Strategy", description: "Strategic positioning and actionable recommendations" },
      { step: "Roadmap", description: "Prioritized plan with clear milestones and metrics" },
    ],
    relatedProjects: ["meridian", "vertex"],
  },
  {
    slug: "craft",
    number: "02",
    title: "CRAFT",
    subtitle: "The Making",
    description: "Where vision becomes reality. Meticulous design and development that brings your digital presence to life with precision and care.",
    details: [
      "Award-winning visual design",
      "Performance-focused development",
      "Obsessive attention to detail",
    ],
    longDescription: "This is where the magic happens. Armed with strategic clarity, we move into creation mode. Our designers don't just make things look good—they craft experiences that feel inevitable, where every element earns its place. Our developers don't just write code—they build systems that scale, perform, and delight. We sweat the details others overlook because we know that's where the difference lives.",
    benefits: [
      "Designs that capture attention and build trust",
      "Experiences that feel intuitive and effortless",
      "Code that performs flawlessly at scale",
      "Systems built for long-term maintainability",
      "Details that surprise and delight users",
    ],
    process: [
      { step: "Concept", description: "Visual exploration and design direction" },
      { step: "Design", description: "High-fidelity designs with interaction patterns" },
      { step: "Prototype", description: "Interactive prototypes for testing and validation" },
      { step: "Build", description: "Development with continuous quality checks" },
      { step: "Polish", description: "Refinement and optimization for perfection" },
    ],
    relatedProjects: ["desert-wings", "apex"],
  },
  {
    slug: "legacy",
    number: "03",
    title: "LEGACY",
    subtitle: "The Endurance",
    description: "What we build together should outlast us. Systems designed for evolution, with documentation and support that ensures lasting success.",
    details: [
      "Scalable architecture design",
      "Comprehensive documentation",
      "Ongoing optimization support",
    ],
    longDescription: "We build for the long game. Every project we deliver is designed not just for today's needs, but for tomorrow's growth. Our systems are architected for scale, our code is documented for future teams, and our relationships extend beyond launch. We're not here to build and disappear—we're here to create digital legacies that compound value over time.",
    benefits: [
      "Architecture that scales with your growth",
      "Documentation that empowers your team",
      "Systems designed for easy iteration",
      "Ongoing partnership and optimization",
      "Knowledge transfer that builds capability",
    ],
    process: [
      { step: "Launch", description: "Controlled deployment with monitoring" },
      { step: "Optimize", description: "Performance tuning and conversion optimization" },
      { step: "Evolve", description: "Continuous improvements based on data" },
      { step: "Scale", description: "Architecture adjustments for growth" },
      { step: "Transfer", description: "Knowledge sharing and team enablement" },
    ],
    relatedProjects: ["meridian", "vertex"],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return undefined;
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}

export function getRelatedProjects(projectSlugs: string[]): Project[] {
  return projects.filter((p) => projectSlugs.includes(p.slug));
}
