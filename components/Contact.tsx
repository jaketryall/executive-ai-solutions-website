"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", company: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Name", required: true },
    { name: "email", type: "email", placeholder: "Email", required: true },
    { name: "company", type: "text", placeholder: "Company", required: false },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          // Use deterministic values based on index
          const startX = (i * 137) % 1000;
          const startY = (i * 241) % 800;
          const endX = ((i + 10) * 173) % 1000;
          const endY = ((i + 10) * 293) % 800;
          const duration = 20 + (i % 10) * 2;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
              initial={{
                x: startX,
                y: startY,
              }}
              animate={{
                x: [startX, endX, startX],
                y: [startY, endY, startY],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 sm:mb-12 text-white">
              <span className="text-gradient-shine">Contact</span>
            </h2>
            <p className="text-lg sm:text-xl text-zinc-500 font-light mb-8 sm:mb-12">
              Let's discuss how AI can transform your business.
            </p>
            
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-light text-white mb-2">Email</h3>
                <a href="mailto:hello@executiveaisolutions.com" className="text-zinc-400 hover:text-white transition-colors duration-300">
                  hello@executiveaisolutions.com
                </a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card rounded-lg sm:rounded-xl p-4 sm:p-6"
              >
                <h3 className="text-lg font-light text-white mb-2">Response Time</h3>
                <p className="text-zinc-400">
                  Within 24 hours
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {fields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  required={field.required}
                  className="w-full px-0 py-4 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 focus:outline-none transition-all duration-300"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: focusedField === field.name ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative"
            >
              <textarea
                id="message"
                name="message"
                placeholder="How can we help?"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                required
                rows={4}
                className="w-full px-0 py-4 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 focus:outline-none transition-all duration-300 resize-none"
              />
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ width: "0%" }}
                animate={{ width: focusedField === "message" ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.button
                type="submit"
                disabled={status === "sending"}
                className={`relative text-white px-8 py-4 rounded-full font-light text-base overflow-hidden transition-all duration-300 ${
                  status === "sending"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {/* Background gradient animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  animate={{
                    x: status === "success" ? [0, 100, 0] : 0,
                    opacity: status === "success" ? [1, 0, 1] : 1,
                  }}
                  transition={{ duration: 1 }}
                />
                <span className="relative z-10">
                  {status === "sending" ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Sending...
                    </motion.span>
                  ) : status === "success" ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      Message sent!
                    </motion.span>
                  ) : (
                    "Send message →"
                  )}
                </span>
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}