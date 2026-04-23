"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, use } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getProjectBySlug, getNextProject } from "@/lib/data";
import { ease } from "@/lib/motion";
import CountUp from "@/components/ui/CountUp";

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  const next = getNextProject(slug);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  if (!project) notFound();

  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        {/* Hero */}
        <motion.section
          ref={heroRef}
          className="relative h-[85vh] md:h-[100vh] overflow-hidden flex items-end"
        >
          <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
            {project.heroImage.includes("Mockup") ? (
              <>
                <div className="md:hidden absolute inset-0">
                  <Image src={project.heroImage} alt={project.title} fill sizes="100vw" className="object-cover object-top" priority />
                </div>
                <div
                  className="hidden md:block absolute inset-x-0 bottom-0"
                  style={{ top: project.heroOffset || "-13%" }}
                >
                  <Image src={project.heroImage} alt={project.title} fill sizes="80vw" className="object-contain object-top" priority />
                </div>
              </>
            ) : (
              <Image src={project.heroImage} alt={project.title} fill sizes="100vw" className="object-cover" priority />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(243,241,238,0.98) 0%, rgba(243,241,238,0.55) 35%, transparent 75%)" }} />
          </motion.div>

          <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
            <div className="max-w-[1400px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: ease.expoOut }}
                className="flex items-center gap-4 mb-8"
              >
                <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--taupe)" }}>
                  {project.category}
                </span>
                <span className="h-px w-10" style={{ background: "rgba(26,24,22,0.2)" }} />
                <span className="text-[12px] tabular-nums" style={{ color: "var(--taupe)" }}>
                  {project.year}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: ease.expoOut }}
                className="font-display font-semibold leading-[0.96] mb-6"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(3rem, 9vw, 9rem)",
                  letterSpacing: "-0.045em",
                }}
              >
                {toSentence(project.title)}.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: ease.expoOut }}
                className="max-w-xl text-base md:text-lg italic"
                style={{ color: "var(--taupe)" }}
              >
                {project.tagline}
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Overview */}
        <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid md:grid-cols-12 gap-10 md:gap-20 mb-20">
              <div className="md:col-span-3">
                <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--taupe)" }}>
                  Overview
                </p>
              </div>
              <div className="md:col-span-9">
                <p
                  className="leading-[1.25] font-display font-medium text-balance"
                  style={{
                    color: "var(--ink)",
                    fontSize: "clamp(1.4rem, 2.6vw, 2.4rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {project.description}
                </p>
              </div>
            </div>

            {/* Meta */}
            {project.liveUrl && (
              <div
                className="grid md:grid-cols-3 gap-10 py-10 border-y"
                style={{ borderColor: "rgba(26,24,22,0.1)" }}
              >
                <Meta label="Role" value="Design + Engineering" />
                <Meta label="Year" value={project.year} />
                <Meta
                  label="Live"
                  value={
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-hover inline-flex items-center gap-1">
                      Visit site ↗
                    </a>
                  }
                />
              </div>
            )}
          </div>
        </section>

        {/* Challenge / Solution */}
        <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32" style={{ background: "var(--ink-soft)", color: "var(--paper)" }}>
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
            <Block label="Challenge" body={project.challenge} />
            <Block label="Approach" body={project.solution} />
          </div>
        </section>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
            <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-10">
              {project.gallery.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.9, delay: i * 0.05, ease: ease.expoOut }}
                  className="relative aspect-[16/10] rounded-[20px] overflow-hidden"
                  style={{ background: "var(--ink-soft)" }}
                >
                  <Image
                    src={g}
                    alt={`${project.title} - ${i + 1}`}
                    fill
                    className={g.includes("Mockup") ? "object-cover object-top" : "object-cover"}
                    sizes="(max-width: 1400px) 100vw, 1400px"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Outcome */}
        <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-[11px] uppercase tracking-[0.3em] mb-10" style={{ color: "var(--taupe)" }}>
              Outcome
            </p>
            <h3
              className="font-display font-semibold leading-[1.02] mb-16 text-balance"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(2.2rem, 5vw, 4.6rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {project.result}.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {project.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: ease.expoOut }}
                  whileHover={{ y: -4 }}
                  className="relative rounded-[18px] p-6 overflow-hidden group cursor-default"
                  style={{ background: "var(--ink-soft)", color: "var(--paper)" }}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ background: "var(--paper)" }}
                  />
                  <CountUp
                    value={m.value}
                    className="font-display font-semibold mb-2 block"
                    style={{ fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)", letterSpacing: "-0.02em" }}
                  />
                  <div className="text-[12px] uppercase tracking-[0.16em]" style={{ color: "rgba(229,225,219,0.55)" }}>
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pull quote */}
            <div
              className="mt-20 pl-6 md:pl-10"
              style={{ borderLeft: "2px solid var(--ink)" }}
            >
              <p
                className="font-display leading-[1.2] mb-4 text-balance"
                style={{
                  fontSize: "clamp(1.3rem, 2.4vw, 2.2rem)",
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                }}
              >
                "{project.testimonial.quote}"
              </p>
              <p className="text-[13px]" style={{ color: "var(--taupe)" }}>
                — {project.testimonial.author}, {project.testimonial.role}
              </p>
            </div>
          </div>
        </section>

        {/* Next */}
        {next && (
          <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32" style={{ background: "var(--ink-soft)" }}>
            <Link href={`/work/${next.slug}`}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.5, ease: ease.expoOut }}
                className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10 items-center cursor-pointer group"
              >
                <div className="md:col-span-5 order-2 md:order-1">
                  <p className="text-[11px] uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(229,225,219,0.55)" }}>
                    Next piece
                  </p>
                  <h3
                    className="font-display font-semibold mb-4"
                    style={{
                      color: "var(--paper)",
                      fontSize: "clamp(2.2rem, 5vw, 4rem)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {toSentence(next.title)}.
                  </h3>
                  <p className="italic mb-8" style={{ color: "rgba(229,225,219,0.6)" }}>
                    {next.tagline}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-sm transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--paper)" }}
                  >
                    View project <span>→</span>
                  </span>
                </div>
                <div className="md:col-span-7 order-1 md:order-2 relative aspect-[4/3] rounded-[24px] overflow-hidden">
                  <Image
                    src={next.image}
                    alt={next.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className={next.image.includes("Mockup") ? "object-cover object-top" : "object-cover"}
                  />
                </div>
              </motion.div>
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(229,225,219,0.55)" }}>
        {label}
      </p>
      <p
        className="leading-[1.45] text-pretty"
        style={{
          color: "var(--paper)",
          fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
        }}
      >
        {body}
      </p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.24em] mb-2" style={{ color: "var(--taupe)" }}>
        {label}
      </p>
      <p style={{ color: "var(--ink)" }} className="text-[15px]">
        {value}
      </p>
    </div>
  );
}

function toSentence(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
