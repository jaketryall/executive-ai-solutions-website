/* Proof that a transcript came from a real conversation.

   The transcript route emails Jake whatever it is handed. Nothing proved
   the POST came from this site's chat at all, so anyone could put
   invented words in a visitor's mouth and mail them to him as a lead.

   The fix needs a secret, and a secret needs an env var that only Jake
   can add — so this is written to work BOTH WAYS and never to break on
   deploy:

     CHAT_SIGNING_SECRET set    -> the transcript route requires a token
                                   the chat route issued.
     CHAT_SIGNING_SECRET unset  -> verify() passes, the route falls back
                                   to rate limiting exactly as before,
                                   and warns once in the log.

   Set it to any long random string in the Vercel dashboard and the door
   locks itself. Generate one with: openssl rand -hex 32

   WHAT THIS IS NOT: the token carries only an expiry, so it is
   replayable within its hour by whoever holds it. That is deliberate —
   it proves "this came from someone who actually talked to our chat",
   which is the whole claim being made, and it costs no shared state.
   Per-conversation nonces would need a store; if one ever exists, that
   is the upgrade. */

import { createHmac, timingSafeEqual } from "node:crypto";

const TTL_MS = 60 * 60 * 1000; // an hour — longer than any real session

function secret(): string {
  return process.env.CHAT_SIGNING_SECRET?.trim() ?? "";
}

/** A token to hand the client, or null when signing isn't configured. */
export function issue(): string | null {
  const s = secret();
  if (!s) return null;
  const exp = Date.now() + TTL_MS;
  const sig = createHmac("sha256", s).update(String(exp)).digest("hex");
  return `${exp}.${sig}`;
}

let warned = false;

/** True when the token is good — or when signing isn't configured. */
export function verify(token: unknown): boolean {
  const s = secret();
  if (!s) {
    if (!warned) {
      warned = true;
      console.warn(
        "[chat-token] CHAT_SIGNING_SECRET is unset — transcript posts are " +
        "rate-limited only. Set it to require a real chat session."
      );
    }
    return true;
  }

  if (typeof token !== "string") return false;
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const want = createHmac("sha256", s).update(String(exp)).digest("hex");
  const got = Buffer.from(sig ?? "", "hex");
  const expected = Buffer.from(want, "hex");
  return got.length === expected.length && timingSafeEqual(got, expected);
}
