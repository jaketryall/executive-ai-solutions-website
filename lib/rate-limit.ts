/* ONE rate limiter, not three.

   This was copy-pasted into three routes with three ceilings and three
   separate Maps, and each copy carried the same two faults.

   FAULT 1 — the window is per INSTANCE. Under Fluid Compute the real
   ceiling is (limit x live instances), not (limit). That is worth saying
   plainly rather than pretending otherwise: this is a BRAKE, not a wall.
   It stops a bored visitor and a naive script. It does not stop someone
   determined with concurrency. The wall is Vercel Firewall (dashboard,
   no code) or a shared store — and when either lands, the body of hit()
   is the only thing that changes and every caller is fixed at once.

   FAULT 2 — the old cleanup was `if (size > 2000) clear()`, which resets
   EVERYONE's window at once. Filling the map was therefore a way to
   flush the limiter. Expired entries are now evicted first, and the
   panic-clear only fires if that wasn't enough. */

export type Bucket = { limit: number; windowMs: number };

const buckets = new Map<string, Map<string, number[]>>();

/** Records a hit and returns true if this id is now OVER the limit. */
export function hit(name: string, id: string, { limit, windowMs }: Bucket): boolean {
  let m = buckets.get(name);
  if (!m) { m = new Map(); buckets.set(name, m); }

  const now = Date.now();
  const w = (m.get(id) ?? []).filter((t) => now - t < windowMs);
  w.push(now);
  m.set(id, w);

  if (m.size > 2000) {
    for (const [k, times] of m) {
      if (times.every((t) => now - t >= windowMs)) m.delete(k);
    }
    if (m.size > 2000) m.clear();
  }

  return w.length > limit;
}

/** The caller's IP, as far as the proxy will tell us. "local" in dev. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip")?.trim() || "local";
}
