"use client";

import { motion } from "framer-motion";

export default function EteryNews() {
  const articles = [
    {
      id: 1,
      date: "Jan 25, 2025",
      title: "How AI Agencies Are Transforming Modern SaaS Platforms",
      image: "/news/ai-saas.jpg", // Placeholder
      link: "#",
      category: "AI Innovation"
    },
    {
      id: 2,
      date: "Jan 10, 2025",
      title: "5 AI Features Every SaaS Product Should Consider in 2025",
      image: "/news/ai-features.jpg", // Placeholder
      link: "#",
      category: "Product Strategy"
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
            Latest News
          </h2>
          <motion.a
            href="#"
            className="text-[#0066ff] hover:text-[#0052cc] transition-colors flex items-center gap-2"
            whileHover={{ x: 5 }}
          >
            <span>All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <a href={article.link} className="block">
                <div className="relative h-64 lg:h-80 bg-[#0d0d0d] rounded-2xl overflow-hidden mb-6">
                  {/* Placeholder gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 bg-[#0066ff] rounded-full flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 mb-3">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                    <span>{article.category}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#0066ff] transition-colors">
                    {article.title}
                  </h3>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-zinc-500 text-sm mt-16"
        >
          https://executiveai.com/blog how-ai-agencies-are-transforming-modern-saas-platforms
        </motion.p>
      </div>
    </section>
  );
}