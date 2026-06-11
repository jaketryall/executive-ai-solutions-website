"use client";

// Muted looping video that plays only while on screen. More reliable than
// the autoplay attribute (Chrome skips it on some hydrated videos) and
// kinder to decoders/battery when several videos share a page.

import { useEffect, useRef } from "react";

export default function AutoVideo({
  src,
  poster,
  className,
  style,
  label,
  startAt = 0,
}: {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  /** Seconds into the clip to begin — desyncs cards sharing one source. */
  startAt?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current!;

    if (startAt > 0) {
      const seek = () => {
        video.currentTime = startAt % (video.duration || startAt + 1);
      };
      if (video.readyState >= 1) seek();
      else video.addEventListener("loadedmetadata", seek, { once: true });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "160px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [startAt]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
      style={style}
    />
  );
}
