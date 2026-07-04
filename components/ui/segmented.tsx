"use client";

/* segmented pill with a sliding thumb (pill-in-pill variant B) — colorway
   comes from the ground: .seg is drawn for the dark chapter, .bld re-inks it
   for the light ground */
export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const n = options.length;
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
      <span
        className="seg-thumb"
        aria-hidden
        style={{
          left: `calc(4px + ${idx} * (100% - 8px) / ${n})`,
          width: `calc((100% - 8px) / ${n})`,
        }}
      />
    </div>
  );
}
