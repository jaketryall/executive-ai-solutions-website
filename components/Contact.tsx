"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const budgetOptions = [
    { label: "$1.5k - $3k", value: "$1,500 - $3,000" },
    { label: "$3k - $5k", value: "$3,000 - $5,000" },
    { label: "$5k - $10k", value: "$5,000 - $10,000" },
    { label: "$10k+", value: "$10,000+" },
  ];

  const inputClasses = `w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500
    focus:border-blue-500/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20
    transition-all duration-300`;

  return (
    <section id="contact" className="relative bg-[#0a0a0a] py-32">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
            >
              Get in Touch
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Let's work <span className="text-blue-500">together</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Have a project in mind? We'd love to hear about it.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Info cards */}
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "Email",
                  value: "hello@executiveai.com",
                  href: "mailto:hello@executiveai.com",
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: "Response Time",
                  value: "Within 24 hours",
                },
                {
                  icon: (
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                  ),
                  label: "Availability",
                  value: "Taking new projects",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-500">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-lg text-white hover:text-blue-500 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-lg text-white">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-6"
              >
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {["Twitter", "LinkedIn", "Dribbble"].map((social) => (
                    <motion.a
                      key={social}
                      href="#"
                      className="w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xs font-medium">{social[0]}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="relative p-8 md:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                {/* Blue accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8"
                    >
                      <motion.svg
                        className="w-12 h-12 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-4">Message sent!</h3>
                    <p className="text-zinc-400 text-lg">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm text-zinc-400 mb-3 font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClasses}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm text-zinc-400 mb-3 font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClasses}
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label htmlFor="project" className="block text-sm text-zinc-400 mb-3 font-medium">
                        Project Type
                      </label>
                      <select
                        id="project"
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-[#0a0a0a]">Select a project type</option>
                        <option value="landing" className="bg-[#0a0a0a]">Landing Page</option>
                        <option value="website" className="bg-[#0a0a0a]">Business Website</option>
                        <option value="ecommerce" className="bg-[#0a0a0a]">E-commerce</option>
                        <option value="webapp" className="bg-[#0a0a0a]">Web Application</option>
                        <option value="other" className="bg-[#0a0a0a]">Other</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm text-zinc-400 mb-3 font-medium">
                        Budget Range
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {budgetOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: option.value })}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              formData.budget === option.value
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm text-zinc-400 mb-3 font-medium">
                        Tell us about your project
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`${inputClasses} resize-none`}
                        placeholder="Share your project details, goals, and timeline..."
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 font-semibold rounded-2xl transition-all duration-300 ${
                          isSubmitting
                            ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <motion.span
                              className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Send Message
                            <span>→</span>
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
