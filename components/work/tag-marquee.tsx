// The work card's bottom tag ticker — two identical sets so the CSS -50%
// keyframe wraps seamlessly. Shared by the homepage work grid and /work.
export function TagMarquee({ tags }: { tags: string[] }) {
  return (
    <span className="wc-marquee" aria-hidden>
      <span className="wc-track">
        {[0, 1].map((set) => (
          <span key={set} className="wc-set">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
