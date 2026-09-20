import HeroRoom from "@/components/dark/hero-room";
import { pickGreeting } from "@/lib/greeting";

/* THE PERSONAL MESSAGE IS THE TITLE (2026-09-20, branch hero/greeting):
   the hero's h1 is a first-visit claim or a return-visit greeting
   (lib/greeting.ts), and the honest-capacity day line under it is
   always real — both have to be right on the FIRST paint, no swap for
   a first visit. That needs a genuine per-request server render, not a
   client-only fill-in: `pickGreeting` runs HERE, in a real Server
   Component, on every request (`dynamic = "force-dynamic"`), always
   with `visits = 1` (the server can't read localStorage) and NO persona
   (`{ i: null, svc: null }` — sessionStorage is client-only too; the
   persona table is deferred regardless, see lib/greeting.ts) — the
   return-visit swap and any future persona read both stay client-side,
   in HeroRoom, a "use client" component this page hands the greeting
   to.

   ⚠ VERIFIED, NOT ASSUMED: a "use client" page file does NOT honour
   Next's route segment config — `export const dynamic` declared
   directly on the old all-in-one app/page.tsx built as `○ (Static)`
   regardless (checked against `next build`'s own route table), which
   would have frozen "today" at build day until the next deploy. Moving
   the config onto this thin, genuine Server Component is the only way
   that actually works. */
export const dynamic = "force-dynamic";

/* HERO TRIALS (2026-09-20, branch hero/air — Jake: "theres something
   simple missing in the hero i want to try different variations ...
   always have the text be full width, or maybe theres some sort of
   ambience missing"). `?v=` is a space/plus-separated list of trial
   tokens (wide · light · glow), handed to the hero as a data attribute
   so every variant lives on the one dev server and combines by URL —
   `?v=wide+light`. Read here, on the server, so the first paint is
   already the variant (no flash on hydration). Unknown tokens are
   inert; no `?v=` is the shipped hero. Trial-only: whichever wins is
   folded into the stylesheet as the default and this read goes. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.v;
  /* Jake, shown wide+light against lines: "i like the previous better"
     — wide+light is the branch's default now; `?v=none` is the hero as
     it shipped, `?v=lines` / `?v=glow` the other trials, still there. */
  const variant = (typeof raw === "string" ? raw : "wide light")
    .replace(/\+/g, " ")
    .replace(/[^a-z ]/g, "")
    .replace(/\bnone\b/, "")
    .trim();
  const greeting = pickGreeting(1, { i: null, svc: null }, new Date());
  return <HeroRoom initialGreeting={greeting} variant={variant} />;
}
