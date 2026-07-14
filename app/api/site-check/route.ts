import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/* The instant site check — the homepage give (selling-architecture.md law 5:
   the give doubles as the qualifier). Reads the visitor's OWN homepage and
   reports only what we can verify from the fetched document: real findings
   in plain sentences, never an invented score. Trust math: if a finding is
   ever wrong, the give becomes a liability — so every check below errs
   toward silence over speculation. */

export const runtime = "nodejs";

type Finding = {
  id: string;
  status: "good" | "fix";
  title: string;
  detail: string;
};

/* ── rate limit: 6 checks/min per IP, tiny in-memory window ── */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const w = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  w.push(now);
  hits.set(ip, w);
  if (hits.size > 2000) hits.clear(); // never grow unbounded
  return w.length > 6;
}

/* ── SSRF guards: public web only ── */
function privateIp(addr: string) {
  if (isIP(addr) === 4) {
    const [a, b] = addr.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  const v6 = addr.toLowerCase();
  return (
    v6 === "::1" ||
    v6 === "::" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe80") ||
    v6.startsWith("::ffff:") // v4-mapped — re-checked after strip below
  );
}

async function assertPublicHost(hostname: string) {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    h.endsWith(".home.arpa")
  )
    throw new Error("private");
  if (isIP(h) && privateIp(h)) throw new Error("private");
  if (!isIP(h)) {
    const addrs = await lookup(h, { all: true });
    for (const { address } of addrs) {
      const bare = address.toLowerCase().startsWith("::ffff:")
        ? address.slice(7)
        : address;
      if (privateIp(bare)) throw new Error("private");
    }
  }
}

/* fetch with manual redirects so every hop gets the same public-host gate */
async function fetchPublic(url: string) {
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    const u = new URL(current);
    if (u.protocol !== "https:" && u.protocol !== "http:")
      throw new Error("scheme");
    await assertPublicHost(u.hostname);
    const started = Date.now();
    const res = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(9000),
      headers: {
        "user-agent":
          "EAS-SiteCheck/1.0 (+https://executiveaisolutions.com/site-check)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error("redirect");
      res.body?.cancel();
      current = new URL(loc, current).href;
      continue;
    }
    const ttfb = Date.now() - started;
    /* read at most 1.5MB — plenty for any homepage's HTML */
    const reader = res.body?.getReader();
    let html = "";
    let bytes = 0;
    const dec = new TextDecoder();
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += dec.decode(value, { stream: true });
      if (bytes > 1_500_000) {
        reader.cancel();
        break;
      }
    }
    return { res, html, bytes, ttfb, finalUrl: current };
  }
  throw new Error("redirect");
}

/* ── tiny HTML readers (regex is enough for these signals) ── */
const strip = (s: string) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#?\w+;/g, " ")
    .trim();
const grab = (html: string, re: RegExp) => re.exec(html)?.[1] ?? null;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip))
    return NextResponse.json(
      { error: "Easy — a few checks a minute is plenty. Try again shortly." },
      { status: 429 }
    );

  let input: string;
  try {
    const body = (await req.json()) as { url?: string };
    input = (body.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Send a URL." }, { status: 400 });
  }
  if (!input || input.length > 300)
    return NextResponse.json({ error: "Send a URL." }, { status: 400 });
  if (!/^https?:\/\//i.test(input)) input = `https://${input}`;

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return NextResponse.json(
      { error: "That doesn't parse as a web address." },
      { status: 400 }
    );
  }

  try {
    const { res, html, bytes, ttfb, finalUrl } = await fetchPublic(parsed.href);
    if (!res.ok)
      return NextResponse.json(
        {
          error: `The site answered with ${res.status} — we can only read pages that load.`,
        },
        { status: 422 }
      );
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html"))
      return NextResponse.json(
        { error: "That address isn't an HTML page." },
        { status: 422 }
      );

    const findings: Finding[] = [];
    const doc = html.slice(0, 400_000);
    const head = doc.slice(0, 60_000);

    /* HTTPS */
    findings.push(
      finalUrl.startsWith("https://")
        ? {
            id: "https",
            status: "good",
            title: "Secure connection",
            detail: "The site serves over HTTPS — the padlock is there.",
          }
        : {
            id: "https",
            status: "fix",
            title: "No HTTPS",
            detail:
              "The site loads over plain HTTP. Browsers mark that “not secure” right in the address bar — the worst possible first impression.",
          }
    );

    /* speed */
    findings.push(
      ttfb <= 800
        ? {
            id: "speed",
            status: "good",
            title: "Server answers fast",
            detail: `First byte in ${ttfb}ms. The server isn't the bottleneck.`,
          }
        : {
            id: "speed",
            status: "fix",
            title: "Slow to answer",
            detail: `${(ttfb / 1000).toFixed(1)}s before the server sent anything. Visitors from an ad decide in about three; this spends ${Math.round((ttfb / 3000) * 100)}% of that budget on silence.`,
          }
    );

    /* title */
    const title = strip(grab(head, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? "");
    if (!title)
      findings.push({
        id: "title",
        status: "fix",
        title: "No page title",
        detail:
          "The title tag is the headline Google shows. Yours is empty — search results show a bare URL.",
      });
    else if (title.length < 22 || /^(home|welcome|index)\b/i.test(title))
      findings.push({
        id: "title",
        status: "fix",
        title: "Title doesn't sell",
        detail: `Google's headline for this page is “${title.slice(0, 80)}”. That names the page, not the reason to click it — no service, no place, no offer.`,
      });
    else
      findings.push({
        id: "title",
        status: "good",
        title: "Title carries a message",
        detail: `Search engines show “${title.slice(0, 80)}${title.length > 80 ? "…" : ""}” — it's saying something.`,
      });

    /* meta description */
    const desc = grab(
      head,
      /<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["']/i
    ) ?? grab(
      head,
      /<meta[^>]+content=["']([\s\S]*?)["'][^>]*name=["']description["']/i
    );
    findings.push(
      desc && strip(desc).length >= 50
        ? {
            id: "desc",
            status: "good",
            title: "Search description present",
            detail:
              "There's a real meta description — you control the sentence under your name in Google.",
          }
        : {
            id: "desc",
            status: "fix",
            title: "No search description",
            detail:
              "Without a meta description Google improvises the sentence under your link from whatever text it finds. That sentence is doing your selling.",
          }
    );

    /* mobile viewport */
    findings.push(
      /<meta[^>]+name=["']viewport["']/i.test(head)
        ? {
            id: "mobile",
            status: "good",
            title: "Built for phones",
            detail: "A viewport is declared — the page scales for mobile.",
          }
        : {
            id: "mobile",
            status: "fix",
            title: "Not mobile-ready",
            detail:
              "No viewport tag: phones render the desktop page zoomed out. Most local searches happen on a phone.",
          }
    );

    /* tap to call */
    findings.push(
      /href=["']tel:/i.test(doc)
        ? {
            id: "call",
            status: "good",
            title: "Tap-to-call works",
            detail:
              "The phone number is a real tel: link — one thumb from a call.",
          }
        : {
            id: "call",
            status: "fix",
            title: "Phone isn't tappable",
            detail:
              "No tel: link anywhere. A mobile visitor has to memorize the number and dial it themselves — most won't.",
          }
    );

    /* a way to act: form or booking language */
    const hasForm = /<form[\s>]/i.test(doc);
    const askWords =
      /\b(book|schedule|get a quote|free quote|request|estimate|contact us|enquire|inquire)\b/i.test(
        strip(doc).slice(0, 20_000)
      );
    findings.push(
      hasForm || askWords
        ? {
            id: "cta",
            status: "good",
            title: "There's a next step",
            detail: hasForm
              ? "The page carries a form — a visitor can act without leaving."
              : "The page asks for the next step in words, at least.",
          }
        : {
            id: "cta",
            status: "fix",
            title: "No clear next step",
            detail:
              "No form and no ask anywhere on the page. Visitors leave the way they came — interested and unconverted.",
          }
    );

    /* social card */
    findings.push(
      /<meta[^>]+property=["']og:image["']/i.test(head)
        ? {
            id: "og",
            status: "good",
            title: "Shares with a card",
            detail:
              "og:image is set — a shared link shows a preview, not a bare URL.",
          }
        : {
            id: "og",
            status: "fix",
            title: "Shares as a bare link",
            detail:
              "No social image. When someone texts your site to a friend, it arrives as naked text instead of a preview card.",
          }
    );

    /* business structured data. Judged by the FACTS it carries (address,
       hours, phone, geo…), never by a type-name allowlist — a FlightSchool
       is as much a business as a Dentist, and a wrong "invisible to
       machines" verdict on a well-marked-up site is exactly the false
       positive that kills the give's credibility (caught live, 2026-07-14) */
    const ldBlocks =
      doc.match(
        /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi
      ) ?? [];
    const ldFacts = ldBlocks.some((b) =>
      /"(address|openingHours(Specification)?|telephone|geo|areaServed|priceRange)"/i.test(
        b
      )
    );
    findings.push(
      ldFacts
        ? {
            id: "schema",
            status: "good",
            title: "Machine-readable business info",
            detail:
              "Structured data carries your business facts — Google's panels and AI assistants can read who and where you are without guessing.",
          }
        : {
            id: "schema",
            status: "fix",
            title: "Invisible to machines",
            detail: ldBlocks.length
              ? "There's structured data, but none of it carries business facts — no address, hours, or phone a machine can read. Google's panels and AI answers still have to guess."
              : "No structured data we could find. Google's panels and AI search answers have to guess your hours, area, and services — or skip you.",
          }
    );

    const fixes = findings.filter((f) => f.status === "fix").length;
    return NextResponse.json({
      host: new URL(finalUrl).hostname.replace(/^www\./, ""),
      findings,
      summary:
        fixes === 0
          ? "Honestly? Solid. Whoever built this cared."
          : fixes <= 2
            ? `${fixes} thing${fixes > 1 ? "s" : ""} worth fixing — close, but leads leak through small holes.`
            : `${fixes} things worth fixing. Each one is a place paid clicks fall through.`,
      meta: { ttfb, kb: Math.round(bytes / 1024) },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "private" || msg === "scheme")
      return NextResponse.json(
        { error: "We can only check public websites." },
        { status: 400 }
      );
    return NextResponse.json(
      {
        error:
          "We couldn't reach that site from here. Check the address — or if it's really down, that's finding number one.",
      },
      { status: 422 }
    );
  }
}
