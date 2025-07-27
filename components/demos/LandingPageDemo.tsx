"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AIGeneratedContent {
  headline: string;
  subheadline: string;
  cta: string;
  benefits: string[];
  colorScheme: string;
  layout: string;
}

const industries = [
  "SaaS Startup",
  "E-commerce Store", 
  "Consulting Firm",
  "Fitness Studio",
  "Restaurant"
];

const tones = [
  "Professional",
  "Friendly",
  "Urgent",
  "Innovative"
];

export default function LandingPageDemo() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("SaaS Startup");
  const [selectedTone, setSelectedTone] = useState<string>("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [optimizationScore, setOptimizationScore] = useState(45);

  const generateAIContent = () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const content: AIGeneratedContent = {
        headline: getAIHeadline(selectedIndustry, selectedTone),
        subheadline: getAISubheadline(selectedIndustry),
        cta: getAICTA(selectedIndustry),
        benefits: getAIBenefits(selectedIndustry),
        colorScheme: getAIColorScheme(selectedIndustry),
        layout: "hero-centered"
      };
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      // Simulate optimization score improvement
      setOptimizationScore(prev => Math.min(prev + Math.random() * 30, 92));
    }, 2000);
  };

  const getAIHeadline = (industry: string, tone: string) => {
    const headlines: { [key: string]: { [key: string]: string } } = {
      "SaaS Startup": {
        "Professional": "Streamline Your Workflow with Intelligent Automation",
        "Friendly": "Work Smarter, Not Harder with Our Easy-to-Use Platform",
        "Urgent": "Limited Time: Transform Your Business Operations Today",
        "Innovative": "The Future of Work Starts Here"
      },
      "E-commerce Store": {
        "Professional": "Premium Quality Products Delivered to Your Door",
        "Friendly": "Discover Amazing Deals on Products You'll Love",
        "Urgent": "Limited Time Sale - Shop Now and Save Big!",
        "Innovative": "Experience Shopping Reimagined"
      },
      "Consulting Firm": {
        "Professional": "Strategic Solutions for Sustainable Growth",
        "Friendly": "Let's Grow Your Business Together",
        "Urgent": "Book Your Free Strategy Session Before Spots Fill Up",
        "Innovative": "Pioneering Next-Generation Business Strategies"
      },
      "Fitness Studio": {
        "Professional": "Achieve Your Fitness Goals with Expert Guidance",
        "Friendly": "Join Our Community and Transform Your Life",
        "Urgent": "New Year Special: 3 Months for the Price of 2",
        "Innovative": "Revolutionary Fitness Programs Powered by Science"
      },
      "Restaurant": {
        "Professional": "Exquisite Dining Experience in the Heart of the City",
        "Friendly": "Come Hungry, Leave Happy - Every Single Time",
        "Urgent": "Book Now - Limited Valentine's Day Reservations",
        "Innovative": "Where Tradition Meets Modern Culinary Art"
      }
    };
    return headlines[industry]?.[tone] || "Transform Your Business Today";
  };

  const getAISubheadline = (industry: string) => {
    const subheadlines: { [key: string]: string } = {
      "SaaS Startup": "Join thousands of companies streamlining their workflows",
      "E-commerce Store": "Fast shipping. Easy returns. Great service.",
      "Consulting Firm": "Experienced team helping businesses scale profitably",
      "Fitness Studio": "Personalized training plans. Real results. No contracts.",
      "Restaurant": "Farm-to-table ingredients. Unforgettable flavors."
    };
    return subheadlines[industry] || "Trusted by thousands of satisfied customers";
  };

  const getAICTA = (industry: string) => {
    const industryCTAs: { [key: string]: string } = {
      "SaaS Startup": "Start 14-Day Free Trial",
      "E-commerce Store": "Browse Collection",
      "Consulting Firm": "Book Free Consultation",
      "Fitness Studio": "Claim Free Week Pass",
      "Restaurant": "Reserve Your Table"
    };
    
    return industryCTAs[industry] || "Learn More";
  };

  const getAIBenefits = (industry: string) => {
    const benefits: { [key: string]: string[] } = {
      "SaaS Startup": ["No credit card required", "Cancel anytime", "24/7 support"],
      "E-commerce Store": ["Free returns", "Secure checkout", "Same-day shipping"],
      "Consulting Firm": ["Confidential service", "Proven methodology", "Results focused"],
      "Fitness Studio": ["All fitness levels", "Expert trainers", "Flexible schedule"],
      "Restaurant": ["Dietary options", "Private events", "Online reservations"]
    };
    return benefits[industry] || ["Quality service", "Great value", "Customer focused"];
  };

  const getAIColorScheme = (industry: string) => {
    const colors: { [key: string]: string } = {
      "SaaS Startup": "from-blue-500 to-purple-500",
      "E-commerce Store": "from-pink-500 to-orange-500",
      "Consulting Firm": "from-slate-600 to-slate-800",
      "Fitness Studio": "from-green-500 to-teal-500",
      "Restaurant": "from-amber-600 to-red-600"
    };
    return colors[industry] || "from-blue-500 to-purple-500";
  };

  useEffect(() => {
    if (selectedIndustry && selectedTone) {
      generateAIContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndustry, selectedTone]);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h4 className="text-lg font-light text-white mb-4">AI-Powered Landing Page Generator</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Controls */}
        <div className="space-y-4">
          <div>
            <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Industry</h5>
            <div className="space-y-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${
                    selectedIndustry === industry
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Tone</h5>
            <div className="space-y-2">
              {tones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${
                    selectedTone === tone
                      ? 'bg-purple-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Landing Page Preview */}
        <div className="lg:col-span-2">
          <div className="relative">
            {/* AI Generation Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-20"
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full mx-auto"
                      />
                    </div>
                    <div className="text-blue-400 text-sm font-light">AI is generating optimized content...</div>
                    <div className="text-zinc-500 text-xs mt-2">Analyzing {selectedIndustry} best practices</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {generatedContent && (
              <motion.div
                key={`${selectedIndustry}-${selectedTone}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-black rounded-lg border border-zinc-800 overflow-hidden"
              >
                {/* Browser Chrome */}
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800 rounded px-3 py-1 text-xs text-zinc-400 inline-block">
                      yourbusiness.com
                    </div>
                  </div>
                </div>

                {/* Page Content */}
                <div className="p-8">
                  {/* Navigation */}
                  <div className="flex justify-between items-center mb-12">
                    <div className="text-white font-light text-lg">{selectedIndustry}</div>
                    <div className="flex gap-6 text-sm text-zinc-400">
                      <span className="hover:text-white transition-colors cursor-pointer">Features</span>
                      <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
                      <span className="hover:text-white transition-colors cursor-pointer">About</span>
                      <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="text-center mb-12">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-light text-white mb-4 leading-tight"
                    >
                      {generatedContent.headline}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto"
                    >
                      {generatedContent.subheadline}
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`bg-gradient-to-r ${generatedContent.colorScheme} text-white px-8 py-3 rounded-lg font-light text-lg shadow-lg`}
                    >
                      {generatedContent.cta}
                    </motion.button>
                  </div>

                  {/* Benefits */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center gap-8 flex-wrap"
                  >
                    {generatedContent.benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-zinc-300"
                      >
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Performance Metrics */}
          <div className="mt-6 space-y-4">
            <h5 className="text-sm text-zinc-400 uppercase tracking-wider">AI Optimization Results</h5>
            
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-400">AI Optimization Score</span>
                <span className="text-xs text-green-400">+{((optimizationScore - 45) / 45 * 100).toFixed(0)}%</span>
              </div>
              <div className="text-2xl text-white mb-2">{optimizationScore}/100</div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                  initial={{ width: "45%" }}
                  animate={{ width: `${optimizationScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-xs text-zinc-400 mb-1">AI Features Used</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-xs text-zinc-300">Smart headline generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-xs text-zinc-300">CTA optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-zinc-300">Color psychology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="text-xs text-zinc-300">Industry best practices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Notice */}
      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="text-xs text-purple-400">
          AI analyzes millions of high-converting pages to generate optimized content, layouts, and CTAs specifically for your industry and target audience
        </div>
      </div>
    </div>
  );
}