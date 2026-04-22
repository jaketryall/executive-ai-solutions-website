/**
 * Generates a `clip-path: polygon(...)` value for the ink flood effect.
 *
 * The returned polygon has:
 *   - A wavy top edge at Y = (100 - progress*100)%, with 12 vertices
 *     offset by sine wobble so the edge feels like liquid, not a ruler line.
 *   - Two anchor vertices at bottom-right and bottom-left so the interior
 *     of the polygon is the "ink" fill below the wavy edge.
 *
 * @param progress  0 → 1. 0 = ink entirely below viewport (invisible),
 *                  1 = ink entirely covers the viewport.
 * @returns a polygon() string suitable for CSS `clip-path`.
 */
export function generateInkPath(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const numEdgeVertices = 12;
  // Y position of the wave's base (in % of viewport height).
  // progress 0 → 100% (below viewport). progress 1 → 0% (at top).
  const baseY = 100 - clamped * 100;
  // Wobble amplitude in % — keep subtle so the edge reads as "liquid" not "cartoon".
  const amplitude = 2;
  // Phase shifts with progress so the waves visibly travel, not just rise in place.
  const phase = clamped * Math.PI * 2;

  const vertices: string[] = [];
  for (let i = 0; i <= numEdgeVertices; i++) {
    const x = (i / numEdgeVertices) * 100;
    const wobble = Math.sin(i * 0.8 + phase) * amplitude;
    // Clamp to [0, 100] so we never exit the visible box.
    const y = Math.max(0, Math.min(100, baseY + wobble));
    vertices.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  // Close the polygon via the bottom-right and bottom-left anchors.
  vertices.push("100% 100%", "0% 100%");

  return `polygon(${vertices.join(", ")})`;
}
