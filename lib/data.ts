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
  heroOffset?: string; // CSS top offset for hero image positioning (e.g., "-13%" to push up, "0%" for default)
  gallery: string[];
  liveUrl?: string; // Live website URL for interactive device preview
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

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
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
  pricing: PricingTier[];
  relatedProjects: string[]; // slugs of related projects
  image: string; // Hero image for service page
}

// =============================================================================
// PROJECTS DATA
// =============================================================================

export const projects: Project[] = [
  {
    slug: "desert-wings",
    title: "DESERT WINGS",
    category: "Flight School",
    image: "/Celestial Laptop Mockup.webp",
    heroImage: "/Celestial Laptop Mockup.webp",
    heroOffset: "-13%",
    gallery: [
      "/Celestial Laptop Mockup.webp",
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200&q=80",
      "https://images.unsplash.com/photo-1559628233-100c798642d4?w=1200&q=80",
    ],
    liveUrl: "https://www.desertwingsflightschool.com",
    year: "2024",
    tagline: "Where pilots are born",
    description: "Full website design and development for an Arizona flight school, featuring an interactive pricing calculator and ongoing SEO optimization.",
    challenge: "Desert Wings Flight School needed a professional online presence to compete in Arizona's aviation training market. The site needed to clearly communicate their training programs, build trust with aspiring pilots, and simplify the decision-making process around flight training costs.",
    solution: "I designed and built a custom website featuring an interactive pricing calculator that lets prospective students adjust training hours and see real-time cost estimates. The site showcases all certification programs from Private Pilot through Commercial, with clear pathways for each student type. I continue to manage SEO efforts to improve local search visibility.",
    result: "Live and growing",
    metrics: [
      { label: "Training Programs", value: "7+" },
      { label: "Interactive Calculator", value: "Custom" },
      { label: "Mobile Optimized", value: "100%" },
      { label: "SEO", value: "Ongoing" },
    ],
    testimonial: {
      quote: "The pricing calculator alone has saved us hours of back-and-forth with prospective students. They come in already knowing what to expect.",
      author: "Rick Ryall",
      role: "Founder, Desert Wings Flight School",
    },
    color: "#2a3f5f",
    warmColor: "rgba(255, 200, 150, 0.12)",
  },
  {
    slug: "riled-up",
    title: "RILED UP",
    category: "Pickleball Coaching",
    image: "/Celestial iPhone Mockup.webp",
    heroImage: "/Celestial iPhone Mockup.webp",
    heroOffset: "-8%",
    gallery: [
      "/Celestial iPhone Mockup.webp",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&q=80",
    ],
    liveUrl: "https://www.rileduppickleball.com",
    year: "2024",
    tagline: "Stop losing to players you should beat",
    description: "My pickleball coaching business website, featuring a custom-built CRM system for managing students, scheduling, and tracking progress.",
    challenge: "As a pickleball coach, I needed more than just a booking page—I needed a complete system to manage my coaching business. Off-the-shelf solutions didn't fit my workflow, and I wanted full control over the student experience from first contact through ongoing training.",
    solution: "I built a full coaching platform with a custom CRM integrated directly into the site. The system handles student management, lesson scheduling, progress tracking, and communication—all in one place. The public-facing site is designed to convert visitors into students with clear messaging about my coaching approach and results.",
    result: "Full business platform",
    metrics: [
      { label: "Custom CRM", value: "Built-in" },
      { label: "Scheduling", value: "Integrated" },
      { label: "Student Tracking", value: "Complete" },
      { label: "Platform", value: "All-in-one" },
    ],
    testimonial: {
      quote: "Building my own CRM meant I could design the exact workflow I needed instead of adapting to someone else's software.",
      author: "Jake Ryall",
      role: "Coach & Developer",
    },
    color: "#2d3f2a",
    warmColor: "rgba(200, 255, 150, 0.12)",
  },
  {
    slug: "wings-n-wheels",
    title: "WINGS N WHEELS",
    category: "Design Showcase",
    image: "/Rubber iPhone Mockup.webp",
    heroImage: "/Rubber iPhone Mockup.webp",
    heroOffset: "0%",
    gallery: [
      "/Rubber iPhone Mockup.webp",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    ],
    liveUrl: "https://www.wingsnwheelsdetailing.com",
    year: "2024",
    tagline: "Portfolio concept site",
    description: "A design showcase demonstrating premium service industry website capabilities. Built as a portfolio piece to demonstrate design and development skills.",
    challenge: "I wanted to demonstrate my ability to create premium, service-focused websites for industries like automotive and aircraft detailing. This required building a complete, polished site that could serve as a template for future client work in similar industries.",
    solution: "I designed and developed a full detailing service website as a portfolio piece, showcasing service breakdowns, booking flows, and premium visual design. The site demonstrates the level of quality and attention to detail I bring to client projects. Note: This is a portfolio demonstration site, not an active business.",
    result: "Portfolio showcase",
    metrics: [
      { label: "Purpose", value: "Portfolio" },
      { label: "Design Quality", value: "Premium" },
      { label: "Service Pages", value: "Complete" },
      { label: "Responsive", value: "100%" },
    ],
    testimonial: {
      quote: "This project demonstrates the design and development capabilities I bring to service-industry clients.",
      author: "Jake Ryall",
      role: "Designer & Developer",
    },
    color: "#2d2d3f",
    warmColor: "rgba(180, 200, 255, 0.12)",
  },
  {
    slug: "adventure-air",
    title: "ADVENTURE AIR",
    category: "Gyrocopter Tours",
    image: "/Elegant Black Laptop Mockup.webp",
    heroImage: "/Elegant Black Laptop Mockup.webp",
    heroOffset: "-8%",
    gallery: [
      "/Elegant Black Laptop Mockup.webp",
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
    liveUrl: "https://www.adventureairaz.com",
    year: "2024",
    tagline: "See Arizona from above",
    description: "Website built for a gyrocopter tour company using Wix, meeting the client's specific platform requirements while maximizing visual impact.",
    challenge: "Adventure Air AZ needed a website to showcase their unique gyrocopter tour experience over Arizona's desert landscapes. The client specifically required the site be built on Wix to allow them to manage content independently after launch.",
    solution: "Working within Wix's platform constraints, I designed and built a visually compelling site that captures the thrill of gyrocopter flight. The site features tour information, booking integration, and stunning aerial imagery—all structured so the client can easily update content themselves. This project demonstrated my ability to deliver quality results regardless of platform requirements.",
    result: "Client-managed site",
    metrics: [
      { label: "Platform", value: "Wix" },
      { label: "Client Editable", value: "Yes" },
      { label: "Booking", value: "Integrated" },
      { label: "Training", value: "Provided" },
    ],
    testimonial: {
      quote: "Jake delivered exactly what we needed and made sure we could update the site ourselves going forward.",
      author: "Adventure Air Team",
      role: "Adventure Air AZ",
    },
    color: "#3f2d1f",
    warmColor: "rgba(255, 180, 120, 0.12)",
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
    pricing: [
      {
        name: "Landing Page",
        price: "$2,500",
        description: "Perfect for campaigns and product launches",
        features: [
          "Single high-converting page",
          "Custom responsive design",
          "Basic SEO optimization",
          "Contact form integration",
          "2 rounds of revisions",
          "30-day support",
        ],
        cta: "Get Started",
      },
      {
        name: "Business Website",
        price: "$5,000",
        description: "Complete website for growing businesses",
        features: [
          "Up to 5 custom pages",
          "Sanity CMS integration",
          "Advanced SEO setup",
          "Blog or news section",
          "Analytics dashboard",
          "3 rounds of revisions",
          "60-day support",
        ],
        highlighted: true,
        cta: "Most Popular",
      },
      {
        name: "Custom Platform",
        price: "From $10,000",
        description: "Full-scale web applications and platforms",
        features: [
          "Unlimited pages",
          "Custom functionality",
          "E-commerce or booking systems",
          "User authentication",
          "API integrations",
          "Ongoing maintenance options",
          "Priority support",
        ],
        cta: "Let's Talk",
      },
    ],
    relatedProjects: ["desert-wings", "apex"],
    image: "/Rubber iPhone Mockup.webp",
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
    pricing: [
      {
        name: "SEO Audit",
        price: "$750",
        description: "One-time comprehensive analysis",
        features: [
          "Full technical SEO audit",
          "Keyword opportunity analysis",
          "Competitor benchmarking",
          "Prioritized action plan",
          "30-minute strategy call",
          "Detailed PDF report",
        ],
        cta: "Get Audit",
      },
      {
        name: "Growth",
        price: "$1,500/mo",
        description: "Ongoing SEO for steady growth",
        features: [
          "Monthly SEO optimization",
          "4 blog posts per month",
          "Technical monitoring",
          "Local SEO management",
          "Monthly reporting",
          "Keyword rank tracking",
          "Quarterly strategy reviews",
        ],
        highlighted: true,
        cta: "Most Popular",
      },
      {
        name: "Dominate",
        price: "$3,000/mo",
        description: "Aggressive ranking strategy",
        features: [
          "Everything in Growth",
          "8 content pieces per month",
          "Link building campaigns",
          "Schema markup optimization",
          "Conversion rate optimization",
          "Weekly reporting",
          "Priority support",
        ],
        cta: "Let's Talk",
      },
    ],
    relatedProjects: ["meridian", "vertex"],
    image: "/Celestial Laptop Mockup.webp",
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
    pricing: [
      {
        name: "Custom Solutions",
        price: "Custom",
        description: "Every project is unique—let's discuss yours",
        features: [
          "Workflow analysis & discovery",
          "Custom UI/UX design",
          "Full-stack development",
          "API integrations",
          "Database architecture",
          "Deployment & hosting setup",
          "Training & ongoing support",
        ],
        highlighted: true,
        cta: "Get in Touch",
      },
    ],
    relatedProjects: ["vertex", "meridian"],
    image: "/custom-dashboard-mockup.webp",
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
