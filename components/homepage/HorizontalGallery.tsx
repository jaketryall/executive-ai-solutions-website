"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const accentColor = "#78736c";

// Mixed content items — mood board style
const items: Array<
  | { type: "image"; src: string; alt: string; tall?: boolean }
  | { type: "quote"; text: string; author: string }
  | { type: "stat"; number: string; label: string }
  | { type: "text"; heading: string; sub: string }
> = [
  { type: "stat", number: "4+", label: "Years Building for the Web" },
  { type: "image", src: "/Celestial Laptop Mockup.webp", alt: "Desert Wings", tall: true },
  { type: "quote", text: "The pricing calculator alone has saved us hours of back-and-forth with prospective students.", author: "Rick Ryall" },
  { type: "image", src: "/Celestial iPhone Mockup.webp", alt: "Riled Up" },
  { type: "stat", number: "100%", label: "Client Satisfaction" },
  { type: "image", src: "/Rubber iPhone Mockup.webp", alt: "Wings N Wheels", tall: true },
  { type: "text", heading: "Design.\nDevelop.\nDeliver.", sub: "End-to-end web solutions" },
  { type: "image", src: "/Elegant Black Laptop Mockup.webp", alt: "Adventure Air" },
  { type: "quote", text: "Jake delivered exactly what we needed and made sure we could update the site ourselves.", author: "Adventure Air AZ" },
  { type: "image", src: "/custom-dashboard-mockup.webp", alt: "Custom Dashboard", tall: true },
  { type: "stat", number: "∞", label: "Attention to Detail" },
];

function GalleryItem({ item, index }: { item: (typeof items)[number]; index: number }) {
  if (item.type === "image") {
    return (
      <div
        className="gallery-item shrink-0 relative rounded-2xl overflow-hidden"
        style={{
          width: item.tall ? "clamp(260px, 20vw, 350px)" : "clamp(320px, 28vw, 460px)",
          height: item.tall ? "clamp(380px, 55vh, 560px)" : "clamp(280px, 38vh, 420px)",
        }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="28vw"
        />
      </div>
    );
  }

  if (item.type === "quote") {
    return (
      <div
        className="gallery-item shrink-0 flex flex-col justify-center px-10"
        style={{
          width: "clamp(350px, 30vw, 500px)",
          height: "clamp(280px, 38vh, 420px)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
            lineHeight: 1.5,
            color: "#e5e1db",
            marginBottom: "1.5rem",
          }}
        >
          &ldquo;{item.text}&rdquo;
        </p>
        <span
          className="text-xs uppercase tracking-[0.2em] font-medium"
          style={{ color: accentColor }}
        >
          — {item.author}
        </span>
      </div>
    );
  }

  if (item.type === "stat") {
    return (
      <div
        className="gallery-item shrink-0 flex flex-col items-center justify-center"
        style={{
          width: "clamp(250px, 22vw, 380px)",
          height: "clamp(300px, 45vh, 480px)",
        }}
      >
        <span
          className="font-black"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(4rem, 8vw, 7rem)",
            lineHeight: 0.9,
            color: accentColor,
            letterSpacing: "-0.03em",
          }}
        >
          {item.number}
        </span>
        <span
          className="text-xs uppercase tracking-[0.25em] mt-4 text-center"
          style={{ color: "rgba(229, 225, 219, 0.4)" }}
        >
          {item.label}
        </span>
      </div>
    );
  }

  if (item.type === "text") {
    return (
      <div
        className="gallery-item shrink-0 flex flex-col justify-center"
        style={{
          width: "clamp(280px, 24vw, 400px)",
          height: "clamp(320px, 48vh, 500px)",
        }}
      >
        <p
          className="font-black leading-[0.95]"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
            color: "#e5e1db",
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {item.heading}
        </p>
        <span
          className="text-sm mt-4"
          style={{ color: "rgba(229, 225, 219, 0.35)" }}
        >
          {item.sub}
        </span>
      </div>
    );
  }

  return null;
}

export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - window.innerWidth;

      // Pin and scrub horizontally
      gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Each item has slight vertical parallax
      const galleryItems = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll(".gallery-item")
      );
      galleryItems.forEach((item, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          item,
          { y: 15 * direction },
          {
            y: -15 * direction,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${totalScroll}`,
              scrub: 1,
            },
          }
        );
      });
    }, section);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="hidden md:block relative"
      data-bg="dark"
      style={{ overflow: "hidden" }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(10,9,8,0.8), transparent)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none"
        style={{
          background: "linear-gradient(to left, rgba(10,9,8,0.8), transparent)",
          zIndex: 2,
        }}
      />

      <div className="h-screen flex items-center">
        <div
          ref={trackRef}
          className="flex gap-8 items-center"
          style={{ paddingLeft: "8vw", paddingRight: "8vw" }}
        >
          {items.map((item, i) => (
            <GalleryItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
