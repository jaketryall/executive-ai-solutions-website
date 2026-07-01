/* eslint-disable @next/next/no-img-element */

// Blank canvas — full restart (2026-07-01). Only the logo survives.
// Previous site: git snapshot 3941a43 on redesign/hero-v2.
export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-white">
      <img
        src="/Executive%20Ai%20Solutions%20Logo.svg"
        alt="Executive AI Solutions"
        className="w-40"
        draggable={false}
      />
    </main>
  );
}
