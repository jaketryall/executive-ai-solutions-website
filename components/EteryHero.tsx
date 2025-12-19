"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { getPortfolioProjects } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity";

// Type definition for Portfolio Project
interface PortfolioProject {
  _id: string;
  name: string;
  slug: { current: string };
  type: string;
  url: string;
  description: string;
  previewImage: any;
  color: string;
  tech: string[];
  features: string[];
  stats: {
    visitors: string;
    conversion: string;
    speed: string;
  };
  timeline: string;
  featured: boolean;
  order: number;
}

// Fallback data in case Sanity is not configured or has no data
const fallbackProjects = [
  {
    name: "Elite Construction Co.",
    type: "Construction Company",
    url: "eliteconstructionpro.com",
    previewImage: null,
    description: "Full-service construction company website with project galleries and quote system",
    tech: ["Next.js", "TypeScript", "Tailwind", "Sanity CMS"],
    features: ["3D Project Gallery", "Instant Quote Calculator", "Client Portal", "Mobile Responsive"],
    stats: { visitors: "15K+/mo", conversion: "8.2%", speed: "99/100" },
    timeline: "4 weeks",
    color: "#f39c12"
  },
  {
    name: "Velocity Digital Agency",
    type: "Marketing Agency",
    url: "velocitydigital.agency",
    previewImage: null,
    description: "Modern agency site with case studies, team showcase, and service packages",
    tech: ["React", "Node.js", "MongoDB", "Framer Motion"],
    features: ["Interactive Case Studies", "Real-time Chat", "CRM Integration", "Analytics Dashboard"],
    stats: { visitors: "25K+/mo", conversion: "6.5%", speed: "97/100" },
    timeline: "4 weeks",
    color: "#667eea"
  },
  {
    name: "FreshBite Delivery",
    type: "Food Delivery Platform",
    url: "freshbite.delivery",
    previewImage: null,
    description: "Restaurant delivery platform with real-time tracking and multi-vendor support",
    tech: ["Next.js", "PostgreSQL", "Redis", "Stripe"],
    features: ["Live Order Tracking", "Multi-Restaurant Cart", "Loyalty Program", "Driver App"],
    stats: { visitors: "85K+/mo", conversion: "12.3%", speed: "95/100" },
    timeline: "6 weeks",
    color: "#f5576c"
  }
];

// Portfolio Showcase Component  
function PortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [projects, setProjects] = useState<PortfolioProject[]>(fallbackProjects as any);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  // Only initialize scroll animations after loading is complete
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "center 0.4"] // Optimized for centering the portfolio in view
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.8], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  // Fetch portfolio projects from Sanity
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getPortfolioProjects();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          // Use fallback data if no projects in CMS
          setProjects(fallbackProjects as any);
        }
      } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        // Use fallback data on error
        setProjects(fallbackProjects as any);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);
  
  // Auto-rotate projects
  useEffect(() => {
    // Skip auto-rotation if not playing or if a project is expanded
    if (!isAutoPlaying || expandedProject !== null || projects.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentProject(prev => (prev + 1) % projects.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, expandedProject, projects]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentProject(prev => {
          const projectsCount = projects.length || fallbackProjects.length;
          return prev > 0 ? prev - 1 : projectsCount - 1;
        });
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentProject(prev => {
          const projectsCount = projects.length || fallbackProjects.length;
          return (prev + 1) % projectsCount;
        });
        setIsAutoPlaying(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projects]);


  return (
    <div ref={containerRef} className="relative flex flex-col items-center min-h-[600px] py-20">
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <div className="text-white">Loading portfolio...</div>
        </div>
      ) : !projects.length ? (
        <div className="flex items-center justify-center w-full">
          <div className="text-gray-400">No projects available</div>
        </div>
      ) : (
        <>
      {/* Website Preview - Main Focus */}
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformPerspective: "1200px",
          transformStyle: "preserve-3d"
        }}
        className="relative w-full px-6"
      >
        {/* Blue glow effect behind screen */}
        <div 
          className="absolute inset-0 blur-3xl pointer-events-none scale-150"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.6), rgba(0, 102, 255, 0.3) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute inset-0 blur-2xl pointer-events-none scale-125"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 153, 255, 0.4), rgba(0, 102, 255, 0.2) 50%, transparent 80%)'
          }}
        />
        
        <motion.div
          key={currentProject}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0d0d0d] cursor-pointer border-2 border-zinc-800 border-t-zinc-700 shadow-lg shadow-black/50 transition-all duration-500"
          style={{ 
            background: projects[currentProject].previewImage 
              ? 'none'
              : `linear-gradient(135deg, ${projects[currentProject].color}99 0%, ${projects[currentProject].color}66 100%)`
          }}
        >
          {/* Actual Image or Gradient Fallback */}
          {projects[currentProject].previewImage ? (
            <img 
              src={urlFor(projects[currentProject].previewImage).width(1920).height(1200).url()}
              alt={projects[currentProject].name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          )}
          
          {/* Simple mock browser UI when not hovering */}
          <div className="absolute top-6 left-6 transition-opacity duration-300 group-hover:opacity-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
          </div>

          {/* Mock website content placeholder */}
          <div className="absolute inset-0 p-8 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
            <div className="w-full max-w-3xl">
              <div className="h-8 bg-white/10 rounded mb-4 w-2/3" />
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="h-4 bg-white/5 rounded w-4/6" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="h-32 bg-white/5 rounded" />
                <div className="h-32 bg-white/5 rounded" />
                <div className="h-32 bg-white/5 rounded" />
              </div>
            </div>
          </div>

          {/* Expandable Info Panel - Dark Card Style */}
          <div 
            className={`absolute bottom-6 left-6 right-6 bg-[#0d0d0d]/90 backdrop-blur-sm border border-zinc-800 border-t-zinc-700 shadow-lg shadow-black/50 rounded-2xl overflow-hidden transition-all duration-500 ease-out origin-bottom ${
              expandedProject === currentProject 
                ? 'h-[calc(100%-3rem)]' 
                : 'h-[90px] opacity-0 group-hover:opacity-100'
            }`}
            onClick={() => setExpandedProject(expandedProject === currentProject ? null : currentProject)}
          >
            <div className={`h-full flex flex-col ${expandedProject === currentProject ? 'p-8' : 'px-8 justify-center'}`}>
              {/* Header Section - Always visible in collapsed state */}
              {expandedProject !== currentProject && (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-2xl">{projects[currentProject].name}</h3>
                    <p className="text-zinc-400 text-lg">{projects[currentProject].type}</p>
                  </div>
                  <svg className="w-7 h-7 text-zinc-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}

              {/* Expanded Content - Only visible when expanded */}
              {expandedProject === currentProject && (
                <div className="flex-1 flex flex-col">
                  {/* Main Focus Area - Project Info */}
                  <div className="bg-zinc-900/50 rounded-2xl p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-3xl mb-2">{projects[currentProject].name}</h3>
                        <p className="text-[#0066ff] text-lg font-medium">{projects[currentProject].type}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedProject(null);
                        }}
                        className="w-10 h-10 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-zinc-300 text-base leading-relaxed">
                      {projects[currentProject].description}
                    </p>
                  </div>

                  {/* Key Metrics - Visual Focus */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-green-400 mb-1">{projects[currentProject].stats.visitors}</p>
                      <p className="text-xs text-zinc-400">Monthly Traffic</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-blue-400 mb-1">{projects[currentProject].stats.conversion}</p>
                      <p className="text-xs text-zinc-400">Conversion Rate</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-purple-400 mb-1">{projects[currentProject].stats.speed}</p>
                      <p className="text-xs text-zinc-400">Speed Score</p>
                    </div>
                  </div>

                  {/* Secondary Info - Features and Tech */}
                  <div className="flex-1 grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {projects[currentProject].features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#0066ff] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-zinc-400 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Built With</h4>
                      <div className="flex flex-wrap gap-2">
                        {projects[currentProject].tech.map((tech, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-[#0066ff]/10 text-[#0066ff] rounded-lg text-sm font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA - Clear Action */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://${projects[currentProject].url}`, '_blank');
                    }}
                    className="w-full py-4 bg-[#0066ff] hover:bg-[#0052cc] text-white rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#0066ff]/20"
                  >
                    Visit Live Site
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-8 mt-8">
        {/* Previous Button */}
        <button
          onClick={() => {
            setCurrentProject(prev => prev > 0 ? prev - 1 : projects.length - 1);
            setIsAutoPlaying(false);
            setExpandedProject(null);
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Project Dots Indicator */}
        <div className="flex items-center gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentProject(idx);
                setIsAutoPlaying(false);
                setExpandedProject(null);
              }}
              className={`rounded-full transition-all ${
                currentProject === idx 
                  ? 'w-8 h-2 bg-[#0066ff]' 
                  : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => {
            setCurrentProject(prev => prev < projects.length - 1 ? prev + 1 : 0);
            setIsAutoPlaying(false);
            setExpandedProject(null);
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      </>
      )}
    </div>
  );
}

export default function EteryHero() {
  const metrics = [
    { label: "Sites Built", value: "250+", trend: "Custom & Platform Sites" },
    { label: "Client Satisfaction", value: "98%", trend: "5-Star Reviews" },
    { label: "Avg Page Speed", value: "<2s", trend: "Lightning Fast" },
    { label: "Uptime", value: "99.9%", trend: "Always Online" }
  ];

  return (
    <section className="bg-[#0a0a0a] relative overflow-hidden pb-24">
      {/* Blue flame effect background */}
      <div className="absolute inset-0">
        {/* Primary flame glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-t from-[#0066ff]/40 via-[#0066ff]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-t from-[#0066ff]/60 via-[#0066ff]/30 to-transparent blur-2xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-t from-[#0099ff]/80 via-[#0066ff]/40 to-transparent blur-xl" />
        
        {/* Side flames */}
        <div className="absolute bottom-0 left-1/3 -translate-x-1/2 w-[300px] h-[400px] bg-gradient-to-t from-[#0066ff]/30 via-[#0066ff]/10 to-transparent blur-2xl rotate-12" />
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-[300px] h-[400px] bg-gradient-to-t from-[#0066ff]/30 via-[#0066ff]/10 to-transparent blur-2xl -rotate-12" />
        
        {/* Cyan accent flames */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-gradient-to-t from-cyan-400/40 to-transparent blur-xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-2 h-2 bg-[#0066ff] rounded-full" />
          <span className="text-zinc-400 text-sm">Professional Website Development</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-4"
        >
          Beautiful<br />
          Websites That<br />
          Drive Results
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-lg mb-8 max-w-md"
        >
          Custom-built websites tailored to your brand - designed to convert visitors into customers.
        </motion.p>

        {/* CTA Buttons and Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-8 mb-12"
        >
          {/* Get Started Button */}
          <motion.button
            className="px-8 py-4 bg-[#0066ff] text-white font-medium rounded-lg border border-[#0066ff] border-t-[#0099ff] shadow-lg shadow-black/30 hover:bg-[#0052cc] hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get started
          </motion.button>

          {/* Reviews */}
          <div className="flex items-center gap-4">
            {/* Customer Avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066ff] to-cyan-400 border-2 border-[#0a0a0a] flex items-center justify-center text-white text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            
            <div className="text-sm">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-400">
                5 stars from <span className="text-white font-medium">5.4k+ reviews</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Showcase iPad */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mb-8"
        >
          <PortfolioShowcase />
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-[#0d0d0d]/90 backdrop-blur-sm border border-zinc-800 border-t-zinc-700 rounded-2xl p-6 shadow-lg shadow-black/50"
              >
                {/* Icon placeholder */}
                <div className="w-10 h-10 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-5 h-5 bg-zinc-600 rounded" />
                </div>
                
                <h3 className="text-zinc-400 text-sm mb-2">{metric.label}</h3>
                <p className="text-white text-2xl font-bold mb-3">{metric.value}</p>
                
                <div className="flex items-center gap-2 text-xs">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span className="text-zinc-500">{metric.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="#services"
            className="text-zinc-500 text-sm hover:text-[#0066ff] transition-colors"
          >
            https://executiveaisolutions.com
          </a>
        </motion.div>

        {/* Buy Template button - Fixed position */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button className="px-6 py-3 bg-[#0066ff] text-white font-medium rounded-lg hover:bg-[#0052cc] transition-colors shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}