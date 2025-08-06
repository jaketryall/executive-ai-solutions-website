"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { getFeaturedTestimonial } from "@/lib/sanity.queries";

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  image?: any;
  rating?: number;
  metrics?: Array<{ label: string; value: string }>;
}

export default function AIBYTestimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const data = await getFeaturedTestimonial();
        setTestimonial(data);
      } catch (error) {
        console.error('Error fetching testimonial:', error);
        // Fallback testimonial
        setTestimonial({
          _id: '1',
          quote: "Executive AI Solutions transformed our operations completely. The AI chatbot they developed handles 80% of our customer inquiries automatically, saving us over 30 hours per week. Their team understood our needs perfectly and delivered beyond expectations. The ROI has been incredible - we've seen a 3x increase in customer satisfaction scores.",
          author: "Sarah Johnson",
          role: "CEO",
          company: "TechCorp Industries",
          rating: 5,
          metrics: [
            { label: "Time Saved", value: "30+ hrs/week" },
            { label: "Satisfaction", value: "3x increase" },
            { label: "Response Time", value: "90% faster" },
            { label: "Cost Reduction", value: "65%" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonial();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0066ff]/5 to-black" />
      <div className="absolute left-1/4 top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-[#0066ff]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 w-1/3 h-1/3 bg-gradient-to-tl from-cyan-400/5 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            What{" "}
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              Customers
            </span>{" "}
            Say
          </h2>
        </motion.div>

        {/* Single Large Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="bg-zinc-900/80 border border-zinc-700 rounded-3xl p-8 lg:p-16 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/10 via-transparent to-transparent" />

            {/* Quote Mark */}
            <div className="absolute top-8 left-8 lg:top-16 lg:left-16 text-[#0066ff]/20 text-6xl lg:text-8xl font-serif">
              &ldquo;
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10 space-y-8">
              {/* Quote Text */}
              <p className="text-2xl lg:text-4xl font-light text-white leading-relaxed">
                Working with Executive AI has been a{" "}
                <span className="text-[#0066ff] font-medium">game-changer</span> for our business. 
                Their AI solutions have{" "}
                <span className="text-[#0066ff] font-medium">automated 70% of our customer service</span> inquiries 
                and improved response times by 10x. The team understood our unique needs and delivered 
                a solution that actually works. 
                <span className="text-[#0066ff] font-medium"> Highly recommend!</span>
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between flex-wrap gap-8">
                <div className="flex items-center space-x-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#0066ff] to-cyan-400 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                    JM
                  </div>
                  
                  {/* Name & Title */}
                  <div>
                    <h4 className="text-xl lg:text-2xl font-bold text-white">Jordan Mitchell</h4>
                    <p className="text-zinc-400 font-light">CEO at TechStart Inc.</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-[#0066ff]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Achievement Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -top-8 -right-8 bg-[#0066ff] text-white rounded-2xl p-4 shadow-2xl"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">70%</div>
              <div className="text-sm">Automation</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -bottom-8 -left-8 bg-zinc-800 text-white rounded-2xl p-4 shadow-2xl"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">10x</div>
              <div className="text-sm">Faster Response</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-zinc-400 mb-8">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {["TechStart", "InnovateCo", "FutureAI", "SmartFlow", "DataPro"].map((company, index) => (
              <div key={index} className="text-zinc-600 text-xl font-light">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}