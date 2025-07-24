"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-medium mb-6 text-white">Get in Touch</h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light">
            Ready to deploy your AI workforce? Let's discuss how we can help transform your business.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:border-[#3b82f6] transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:border-[#3b82f6] transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:border-[#3b82f6] transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className={`px-8 py-4 rounded-md font-medium text-base transition-all duration-300 shadow-sm ${
                status === "sending"
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : status === "success"
                  ? "bg-green-600 text-white"
                  : "bg-white text-black hover:bg-zinc-100"
              }`}
            >
              {status === "sending" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center text-zinc-400"
        >
          <p className="mb-2">Or reach us directly at:</p>
          <a href="mailto:hello@executiveaisolutions.com" className="text-[#93bbfd] hover:text-[#60a5fa] transition-colors duration-300">
            hello@executiveaisolutions.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}