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
    slug: "website-design",
    number: "01",
    title: "Website Design & Development",
    subtitle: "Your Digital Storefront",
    description: "High-converting websites built to grow your business. From stunning landing pages to full-scale platforms, we craft digital experiences that turn visitors into customers.",
    details: [
      "Custom design tailored to your brand",
      "Responsive, mobile-first development",
      "Performance optimized for conversions",
    ],
    longDescription: "Your website is often the first impression you make. We don't build generic templates—we craft bespoke digital experiences that capture your brand essence and drive real business results. Every pixel is purposeful, every interaction is intentional, and every page is optimized to convert. Whether you need a striking landing page or a comprehensive e-commerce platform, we build websites that work as hard as you do.",
    benefits: [
      "Custom designs that stand out from competitors",
      "Lightning-fast load times that keep visitors engaged",
      "Mobile-responsive layouts that work on every device",
      "Conversion-optimized user journeys",
      "Easy-to-manage content systems",
      "Built for growth and scalability",
    ],
    process: [
      { step: "Discovery", description: "Understanding your brand, goals, and target audience" },
      { step: "Strategy", description: "Mapping user journeys and conversion pathways" },
      { step: "Design", description: "Creating stunning visuals that align with your brand" },
      { step: "Development", description: "Building with clean code and modern technologies" },
      { step: "Launch & Optimize", description: "Going live and fine-tuning for peak performance" },
    ],
    relatedProjects: ["desert-wings", "apex"],
  },
  {
    slug: "seo",
    number: "02",
    title: "Search Engine Optimization",
    subtitle: "Get Found, Get Chosen",
    description: "Get found by the people who matter most. We build data-driven SEO strategies that drive organic traffic, improve rankings, and deliver measurable results.",
    details: [
      "Technical SEO audits and fixes",
      "Content strategy and optimization",
      "Local SEO and Google Business",
    ],
    longDescription: "Ranking on Google isn't luck—it's strategy. We combine technical expertise with creative content strategies to help your business climb the search rankings and stay there. Our approach goes beyond keywords; we optimize your entire digital ecosystem to signal authority and relevance to search engines. The result? More qualified traffic, better leads, and sustainable organic growth.",
    benefits: [
      "Higher rankings for keywords that matter",
      "Increased organic traffic month over month",
      "Better quality leads from search",
      "Reduced dependence on paid advertising",
      "Long-term sustainable visibility",
      "Detailed reporting and ROI tracking",
    ],
    process: [
      { step: "Audit", description: "Comprehensive analysis of your current SEO health" },
      { step: "Research", description: "Identifying high-value keywords and opportunities" },
      { step: "Technical Fix", description: "Resolving issues that hurt your rankings" },
      { step: "Content Strategy", description: "Creating content that ranks and converts" },
      { step: "Monitor & Adapt", description: "Tracking results and refining the approach" },
    ],
    relatedProjects: ["meridian", "vertex"],
  },
  {
    slug: "custom-solutions",
    number: "03",
    title: "Custom Business Solutions",
    subtitle: "Tools Built for You",
    description: "Streamline your operations with tailored software solutions. From CRM systems to workflow automation, we build the tools your business needs to scale efficiently.",
    details: [
      "Custom CRM development",
      "Workflow automation systems",
      "API integrations and data sync",
    ],
    longDescription: "Off-the-shelf software forces you to adapt to its limitations. Custom solutions adapt to you. We build bespoke business tools that streamline your operations, automate repetitive tasks, and give you insights that generic software can't provide. Whether it's a custom CRM, an internal dashboard, or complex API integrations, we create solutions that fit your workflow perfectly.",
    benefits: [
      "Tools designed around your exact workflow",
      "Automation that saves hours every week",
      "Data insights you can't get from generic tools",
      "Seamless integration with existing systems",
      "Scalable architecture for future growth",
      "Reduced operational costs over time",
    ],
    process: [
      { step: "Analysis", description: "Deep dive into your current processes and pain points" },
      { step: "Architecture", description: "Designing the optimal technical solution" },
      { step: "Development", description: "Building with rigorous testing at every stage" },
      { step: "Integration", description: "Connecting with your existing tools and data" },
      { step: "Training & Support", description: "Ensuring your team gets maximum value" },
    ],
    relatedProjects: ["vertex", "meridian"],
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
