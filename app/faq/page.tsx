import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillCTA from "@/components/PillCTA";
import FaqList, { type Faq } from "@/components/FaqList";

export const metadata: Metadata = {
  title: "FAQ — Executive AI Solutions",
  description:
    "What a website costs, how long a build takes, who owns the code, and what the AI actually does — answered straight.",
};

// TODO(owner): review answers — especially timeline and process promises.
const FAQS: Faq[] = [
  {
    q: "What does a website cost?",
    a: "Every project is fixed-price, agreed before any work starts. Scope drives the number — a marketing site is different from a site with bookings, portals and automations — so you'll have an exact figure in your proposal within 48 hours of the strategy call. No hourly billing, no surprise invoices.",
  },
  {
    q: "How long does a build take?",
    a: "Most sites go from strategy call to live in two to four weeks. Bigger builds — booking systems, client portals, AI integrations — get a timeline in the proposal, and that date is part of the fixed scope.",
  },
  {
    q: "I already have a website. Can you rebuild it?",
    a: "Yes — most projects are rebuilds. We audit what's working (rankings, content, traffic), keep what earns its place, and rebuild the rest around conversion. Your domain and anything valuable carry over.",
  },
  {
    q: "What's the AI part, actually?",
    a: "Practical tools, not buzzwords: booking systems that fill your calendar, dashboards that show your pipeline, client portals that collect what you'd otherwise chase by email, and automations that handle the follow-up. The goal is fewer admin hours and more booked work.",
  },
  {
    q: "Do you handle hosting, domains and maintenance?",
    a: "Yes. Launch includes hosting and domain setup, and you can hand me ongoing care — updates, content changes, monitoring — or run it yourself. Your call.",
  },
  {
    q: "Can I edit the site myself?",
    a: "If you want to, yes — we can wire up a clean editing setup for the parts you'll actually touch. Most owners prefer to send changes over and have them handled. Either works.",
  },
  {
    q: "Do you do SEO?",
    a: "Technical SEO is built into every project — speed, structure, metadata, schema. Local and content SEO are available as ongoing work after launch if you want to grow search traffic deliberately.",
  },
  {
    q: "What do you need from me to start?",
    a: "The contact form and one call. If you have photos, branding or copy, great — if not, that's part of the build. You won't be assigned homework.",
  },
  {
    q: "Who owns the website?",
    a: "You do — fully. Code, design, domain, content. If we ever part ways, everything goes with you.",
  },
  {
    q: "Do you only work with Arizona businesses?",
    a: "No — based in Arizona, working anywhere. Everything from strategy calls to launch runs remotely without losing anything.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-svh">
      <Navbar />

      <section className="px-5 md:px-10 pt-32 md:pt-40 pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          <header className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="micro text-(--fg-faint)">FAQ</p>
              <h1 className="mt-5 font-extrabold uppercase tracking-[-0.04em] leading-[0.94] text-[clamp(2.4rem,5.5vw,3.8rem)]">
                Questions,
                <br />
                answered<span className="text-oxblood">.</span>
              </h1>
              <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-(--fg-muted)">
                The straight version — no sales gloss. Anything missing,{" "}
                <Link
                  href="/#contact"
                  className="text-(--fg) font-medium underline underline-offset-4 decoration-(--line) hover:decoration-current transition-colors"
                >
                  ask directly
                </Link>
                .
              </p>
              <div className="mt-9 hidden lg:block">
                <PillCTA label="Start a project" href="/#contact" />
              </div>
            </div>
          </header>

          <div className="mt-12 lg:mt-0 lg:col-span-8">
            <FaqList faqs={FAQS} />
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[28px] border border-(--line) bg-(--surface) px-6 md:px-8 py-6">
              <div>
                <p className="micro text-(--fg-faint)">Still deciding?</p>
                <p className="mt-1.5 text-lg font-semibold tracking-tight">
                  The strategy call answers the rest.
                </p>
              </div>
              <PillCTA label="Start a project" href="/#contact" />
            </div>
          </div>
        </div>
      </section>

      <Footer contactEmail={process.env.CONTACT_EMAIL} />

      {/* FAQPage structured data — search + AI answer engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </main>
  );
}
