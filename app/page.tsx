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

export default function Page() {
  const greeting = pickGreeting(1, { i: null, svc: null }, new Date());
  return <HeroRoom initialGreeting={greeting} />;
}
