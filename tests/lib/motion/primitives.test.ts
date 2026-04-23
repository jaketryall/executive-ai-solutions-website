import { describe, it, expect } from "vitest";
import { computeFanPositions } from "@/lib/motion/primitives";

describe("computeFanPositions", () => {
  it("spreads N cards symmetrically around origin with even rotation steps", () => {
    const positions = computeFanPositions({
      count: 4,
      spread: 120,      // total degrees of arc
      depth: 80,        // z-axis pull for outer cards
      radius: 500,      // x offset
    });

    expect(positions).toHaveLength(4);

    // Symmetric: first + last should mirror
    expect(positions[0].x).toBeCloseTo(-positions[3].x, 1);
    expect(positions[0].rotation).toBeCloseTo(-positions[3].rotation, 1);

    // Middle cards have less extreme values
    expect(Math.abs(positions[1].rotation)).toBeLessThan(Math.abs(positions[0].rotation));
  });

  it("single card sits at origin with no rotation", () => {
    const positions = computeFanPositions({ count: 1, spread: 120, depth: 80, radius: 500 });
    expect(positions).toEqual([{ x: 0, y: 0, z: 0, rotation: 0, rotationY: 0 }]);
  });

  it("outer cards are deeper on z-axis (further from viewer)", () => {
    const positions = computeFanPositions({ count: 4, spread: 120, depth: 80, radius: 500 });
    // Outermost cards should have larger |z| than inner cards
    expect(Math.abs(positions[0].z)).toBeGreaterThan(Math.abs(positions[1].z));
  });
});
