/* The email test and the HTML escaper, once.

   Both were hand-pasted into three route files. One copy each, so a fix
   lands everywhere instead of in whichever file someone remembered.

   The escaper's fallback also drops a non-null assertion: the old
   `[c]!` was sound only because the regex and the table happened to
   agree, which is exactly the kind of invariant nothing enforces. */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isEmail(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const t = v.trim();
  return t.length > 0 && t.length <= 254 && EMAIL.test(t);
}

const ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);
}
