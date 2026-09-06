# CMS decision — Executive AI Solutions
*2026-09-05, revised the same day after two rounds of objections. Written for Jake. Every product claim carries its source; anything not re-verified today is marked RECALLED; anything counted or timed by hand is marked MEASURED with the date. The recommendation is unchanged in kind (one Payload starter, nothing else) and changed in two specifics: no editor ships at launch without evidence, and every site gets an owner-editable Status global. §8 answers each objection directly.*

---

## 1. The diagnosis

**Sanity on Desert Wings was ~70% a wiring bug and ~30% a tool-fit problem, and the wiring bug is why it "never works as intended."**

The wiring bug, in plain words: every page reads Sanity through `sanityFetch` from `defineLive` (`sanity/lib/live.ts`). In production, next-sanity 12 issues those reads as `fetch(..., { next: { revalidate: false, tags } })` — cache forever, only a tag can un-freeze it (verified from the published dist of `next-sanity@12.3.0`, `dist/live.js` line 28: `fetchOptions?.revalidate !== void 0 ? fetchOptions.revalidate : NODE_ENV === 'production' ? false : undefined`; source at https://github.com/sanity-io/next-sanity). Three things were supposed to send that tag and none of them did:

- `<SanityLive />` — the component whose whole job is to turn a publish into a tag invalidation — was gated behind draft mode in `app/layout.tsx` (commit `35beb7a`, buried in a cookie-consent change). Public visitors never triggered it. Ironically that gate also protected the site from a documented next-sanity 12 + Next 16 prefetch cascade (4–10x request load), so un-gating it as-is is not the fix — https://www.sanity.io/docs/help/nextjs-16-sanitylive-status.
- The webhook in `app/api/revalidate/route.ts` whitelists 7 of 14 types (`TAGGABLE_TYPES`, unchanged since `403d4a8`); instructors, testimonials, home copy, journey rows, career-pilot modules return `Ignored type` forever. And the webhook itself did not exist until 2026-07-30 (`4c18398`), eight weeks after launch.
- `export const revalidate = 3600` on the news pages is a no-op against a per-fetch `revalidate: false` (Next 16.2.9 docs: segment values do not override fetch-level values; Vercel Data Cache persists across deployments — https://vercel.com/docs/caching/runtime-cache/data-cache). The posts that "came back" in July did so because the GROQ text changed and with it the cache key. That is why sometimes a deploy fixed it and sometimes it didn't.

The tool-fit problem: the content model was built from the code outward. `sanity/schemas/pageSeo.ts` is a 75-field god-document per route (31 docs), `homeContent.ts` a 100-field singleton including "Sending…" button text. MEASURED 2026-09-05 (counted by hand from the dataset export against the page components, not a tool figure): ~8% of visible copy reaches the page from Sanity while the Studio presents ~40% as editable; three types (`fleetAircraft`, `alumni`, `redirect`) and one singleton (`siteSettings`, never created) edit nothing. The client's July edits to `/pricing` hero and prose have never rendered because `app/pricing/page.tsx` never calls `getPageContent('/pricing')`. Seven seed scripts in `scripts/` and `apply-content-edits.mjs` are how content actually got in — you were the CMS. Sanity's own docs warn that embedding the Studio makes the model "too website-centric" (https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs). On the Free plan the only roles are Administrator and Viewer (read-only) — there is no non-admin write role, so anyone who edits is an Administrator who can delete datasets and mint tokens (https://www.sanity.io/docs/user-guides/roles, https://www.sanity.io/pricing).

What actually got used in three months: 39 blog posts (11 new, two bulk-retitle sessions by an SEO writer), four meta edits, one 10-minute owner session. Read that split carefully, because the whole recommendation hangs on it: **the contractor used the editor; the owner did not.** A blog and per-page meta for a writer, a handful of lists, and — the thing the schema never offered — a way for the owner to say "closed today." That is the real spec for every client you have.

---

## 2. The recommendation

**Ship no CMS at launch. Give every site an owner-editable Status global (hours override, announcement bar, "today" notice) that goes live from a phone in under a minute. When — and only when — a named person is going to post weekly, install one Payload starter that exposes the 3–5 things that actually change, and sell everything else as "I edit it" under a paid retainer.** Do not build your own CMS. Do not carry Sanity forward. Do not move to Webflow.

What changed from the first draft and why: the first draft put "Editor build" in every brochure+blog quote. DW's own data says the owner opened the editor once in three months, and the third-party rating of Payload's admin for non-technical users is 2/5 (https://www.luckymedia.dev/insights/payload-cms). So the editor is triggered by evidence — a contractor named in the contract, or 60–90 days of retainer tickets showing someone posting weekly — not sold on intent. And the first draft put weather closures, holiday hours and price changes on "designed pages" behind a two-day SLA. That is the edit a flight school makes most and the one it will put on Facebook instead if the site can't take it. The Status global fixes that without a CMS.

Why Payload, when an editor is earned, over the alternatives:

- **It is the hand-rolled CMS with the 9–16 weeks already spent by someone else.** MIT (LICENSE.md, "Copyright (c) 2018-2026 Payload CMS, LLC"), installed into your Next app as an `app/(payload)/` route group beside `app/(site)/`, one Vercel deployment, config in TypeScript in your repo, your Postgres — https://payloadcms.com/docs/getting-started/installation. Figma acquired it 2025-06-17 and the announcement says it "will remain an open-source product" (https://www.figma.com/blog/payload-joins-figma/); v3.88.0 shipped 2026-08-11 (https://github.com/payloadcms/payload/releases). Whether the team or release cadence changed is RECALLED-grade and not load-bearing. Payload Cloud is Enterprise-only ("Project creation is only available for Enterprise teams", https://payloadcms.com/new), which is irrelevant: you self-host inside the same Vercel project.
- **It removes the exact failure class that burned you.** Pages read content with the Local API (`payload.find` in a server component) — a function call, never a `fetch`, so it never lands in the Data Cache, and it is immune to the shared-cache LRU eviction that Vercel documents for Pro teams (https://vercel.com/docs/caching/runtime-cache/data-cache). Freshness = an `afterChange` hook calling `revalidatePath` in the same process. No webhook, no signature secret, no Live API, no external Function — https://payloadcms.com/docs/local-api/overview, https://github.com/payloadcms/payload/blob/main/packages/payload/skills/payload/reference/HOOKS.md. Publish → CDN is one hop. That is the single number to judge any CMS on.
- **It never touches your DOM.** Server live preview is `router.refresh()` driven by the Local API, no stega characters inside strings, so no `data-sanity` plumbing on split-text animations — https://payloadcms.com/docs/live-preview/server. The admin is a separate route group and adds nothing to the site bundle.
- **It has roles — with one correction to how they work.** Field-level `access` functions let an `seo` role write `meta.*` and posts and nothing else. Precisely: `access.update` restricted to `admin` makes a field *read-only* for everyone else — Payload silently discards the value, it does not hide the field. Hiding non-meta fields from the seo role's screen needs `admin.condition` (or `admin.hidden`) keyed on the user's role. `access.read: false` also strips the field from API responses, so it must never be used on a field the site renders — https://payloadcms.com/docs/access-control/fields. This is more config than "it hides the rest," and it goes in the starter once. Sanity Free cannot do any of it; Keystatic cannot at all ("permissions remain team-wide" — https://keystatic.com/docs/cloud).
- **Rich text with images in prose, drafts, versions, media with focal point, scheduled publish, soft-delete, SEO/forms/redirects plugins** all exist on day one — https://payloadcms.com/docs/versions/drafts, https://payloadcms.com/docs/trash/overview, https://payloadcms.com/docs/plugins/seo, https://payloadcms.com/docs/plugins/form-builder. Building those yourself is 1–3 weeks each (own-CMS estimate, §1 of that brief).
- **Cost:** $0 licence; Neon Postgres via the Vercel Marketplace, Free plan = 0.5 GB/project, 100 CU-hours/project/month, scale-to-zero after 5 min, 6-hour history window, no point-in-time restore, 1 manual snapshot, 10 branches/project — https://neon.com/pricing; Vercel Blob for media at $0.023/GB-mo — https://vercel.com/docs/vercel-blob/usage-and-pricing; Resend for auth mail, Free plan includes 3 verified domains (https://resend.com/pricing), so client-branded reset mail caps at three clients before Resend Pro (RECALLED $20/mo) or sending from executiveaisolutions.com. Marginal ≈ $0–5/mo per client on top of the Vercel Pro seat you already pay **until the measurements in item 9 say otherwise** — Neon Launch and a keep-warm are the likely first paid upgrades. Do not put anything on Supabase Free — projects pause after a week idle and the plan allows only 2 active projects (https://supabase.com/pricing).

The honest price of Payload is not money, it is discipline — and, since the first draft, a named security-patching cost:

1. **Next version lock.** `@payloadcms/next@3.88.0` peers `>=15.2.9 <15.3.0 || >=15.3.9 <15.4.0 || >=15.4.11 <15.5.0 || >=16.2.6 <17.0.0` (https://raw.githubusercontent.com/payloadcms/payload/v3.88.0/packages/next/package.json). Next 16 GA shipped 2025-10-22 (https://endoflife.date/nextjs); a stable pairing existed only from Next 16.2 (published 2026-03-18), required by Payload v3.73.0 (2026-01-23, https://github.com/payloadcms/payload/releases/tag/v3.73.0). Latest Next today is 16.3.4 with 16.4 canaries; no v17 (https://github.com/vercel/next.js/releases). Expect to run a quarter behind on Payload sites. EAS (16.2.9) qualifies today; Desert Wings (16.2.4) does not.
2. **Security patching is a scheduled cost, not a pin.** Payload has published 10 security advisories in 2026 so far (https://github.com/payloadcms/payload/security/advisories): two Criticals — unauthenticated SQL injection in the Postgres/SQLite adapters (GHSA-xx6w-jxg9-2wh8, CVE-2026-25544, 2026-02-05) and pre-auth account takeover via password recovery (GHSA-hp5w-3hxx-vmwf, CVE-2026-34751, CVSS 9.1, 2026-04-01, fixed in 3.79.1 only, no backport listed) — plus a High field-level write-access bypass on 2026-08-27. SECURITY.md publishes no supported-versions policy (https://raw.githubusercontent.com/payloadcms/payload/main/SECURITY.md). So "pin minors" means "stay vulnerable." The policy instead: subscribe to the advisories; on any High/Critical, every client is on the patched minor within 48–72 h; Renovate (or Dependabot) opens grouped `payload*` PRs; CI boots the admin and runs `payload generate:importmap` — the exact thing 3.27→3.29 broke (https://github.com/payloadcms/payload/issues/11813) — so a bad minor fails in CI, not in a client's browser. Every Payload site also exposes `/admin`, `/api/*`, forgot-password and upload endpoints where a static site exposes nothing; that is the strongest single argument for the no-CMS default.
3. **Payload 4.0 is on npm today, not a hypothetical.** `4.0.0-canary.31` is published under the `canary` dist-tag (https://registry.npmjs.org/-/package/payload/dist-tags); the 2026-06-09 announcement targets a beta "within the next quarter," with a full admin UI redesign, Sass removal and a new framework-adapter layer (https://payloadcms.com/posts/blog/payload-40-admin-ui-redesign-tanstack-mcp-and-more); no v3 support window or migration guide is published. Plan a starter-first 4.0 migration in H1 2027 and budget one day per client for fan-out. Keep admin customisation config-only — hidden fields, labels, logo — so the redesign costs config edits, not component rewrites. Budget the training video to be re-recorded then.
4. **Migrations, stated as rules in the starter's README and `vercel.json`, not as advice.** Production `DATABASE_URL` lives only in Vercel's Production environment; Preview and Development point at a Neon branch (10 per project on Free). Build command is `payload migrate && next build` with `push: false` in the prod config; Vercel runs that same build for every preview deployment, so without per-environment DBs a feature-branch push migrates production and two concurrent builds run migrate concurrently — "do not mix push and migrations" on one database (https://payloadcms.com/docs/database/migrations). Never run migrate from a laptop against prod. That per-environment wiring is manual per client and (RECALLED) the most common way Payload-on-Vercel sites corrupt their ledger; the starter makes it the default rather than a step to remember at 11 pm.
5. **Backups.** Neon Free's 6-hour history and lack of PITR mean a contractor's Friday-night bulk edit found on Monday is gone. The starter enables `trash: true` on every content collection (https://payloadcms.com/docs/trash/overview) — which covers deletes, not bad edits — and the retainer includes a nightly `pg_dump` to Vercel Blob, or Neon Launch for 7-day history on clients who ask for it. Drafts/versions cover per-document edit history.
6. **Serverless friction.** Scheduled publish needs a Vercel Cron hitting `/api/payload-jobs/run` (`autoRun`: "Never use on serverless") — https://payloadcms.com/docs/jobs-queue/overview. Use `@payloadcms/db-postgres` with a pooled Neon URL and `attachDatabasePool` rather than `@payloadcms/db-vercel-postgres`, which is a supported adapter (https://payloadcms.com/docs/database/postgres) but sits on `@vercel/postgres`, the package Vercel is winding down — https://neon.com/docs/guides/vercel-postgres-transition-guide, https://vercel.com/kb/guide/connection-pooling-with-functions.
7. **Editor UX is developer-facing out of the box** (2/5 for non-technical editors, "Significant customization needed" — https://www.luckymedia.dev/insights/payload-cms; pagepro.co gives no score but calls it "primarily developer-facing" — https://pagepro.co/blog/payload-vs-sanity/). The fix is in your config and it is a checklist, not a vibe. **Edit-safe by construction:** `maxLength` on every title/excerpt that renders in a fixed-height component; upload `limits` (max file size), required alt, `imageSizes` with focal-point defaults; Lexical restricted to paragraph/bold/italic/link/list/H2–H3 with paste sanitisation; `versions.drafts.autosave` on, with a plain-English label explaining Save Draft vs Publish; live preview configured in the starter so nobody publishes blind; 3–5 collections, everything else hidden, white-label logo, no layout builder. That is the opposite of `pageSeo.ts`, and the discipline DW lacked.
8. **The login path is tested before handover, per client.** Payload admin is email + password. If the email adapter is not configured, forgot-password only logs the recipient and subject — reset mail silently never arrives (Payload v3 migration guide). So: `@payloadcms/email-resend` with the client's verified domain (or yours, after the third), the receptionist actually receives a reset mail before the handover call, `maxLoginAttempts`/`lockTime` set deliberately and told to the client (docs example 5 attempts / 10 min — RECALLED whether those are the defaults).
9. **Hard gate before selling Payload to anyone — two stopwatch numbers recorded in this document with a date.** Deploy the starter on Vercel Fluid + Neon Free, leave it idle overnight, then measure (a) admin login-to-usable and (b) Publish-to-CDN. The only published cold-start figure is third-party, 2025-05-16, "~seven seconds," no after-fix number, no version stated (https://allaboutpayload.com/blog/fixing-cold-starts-vercel-payload-nextjs — RECALLED-grade). Neon's scale-to-zero after 5 min stacks a DB wake on that, and a client who opens the admin monthly is always idle. If (a) exceeds ~4 s, Neon Launch or a keep-warm cron goes into the care price *before* the first quote, not after the first complaint. **Status: not yet measured.**
10. **The starter is a product you own, and it is budgeted.** Build once: 3–5 days. Upkeep: ~1 day per quarter for Payload/Next minors, plus the 4.0 migration above. It is priced in §3 as its own line.

The exceptions to "Payload":

- **The Status global — every site, CMS or not.** One row: announcement bar (on/off, text, expiry), opening-hours overrides, a "today" notice. The owner edits it from a phone; a Server Action writes the row and calls `revalidatePath`; live in under a minute. On a Payload site it is a Payload global. On a no-CMS site it is the one permitted hand-roll: one Neon table, one `/admin/status` page behind magic-link auth (Auth.js email provider through Resend — RECALLED, verify the current package), ~200 lines, 1–2 days, built once into the starter. Neon, not Supabase: same scale-to-zero, no week-idle pause, no two-project cap. The old "≤8 scalar fields" hand-roll exception is withdrawn — it contradicted the Supabase warning, and a second mini-framework for race calendars is exactly the maintenance trap this document exists to avoid. **If it has an editor beyond Status, it's Payload; if it doesn't, it's JSON in the repo.**
- **Nothing else changes on a schedule**: no CMS. Content in TSX/JSON, you edit under retainer. This is most local-business brochure sites.

### Decision matrix

| Site type you sell | Jake edits (retainer) + Status global | Keystatic (git) | **Payload (in-repo)** | Sanity (fixed) | Own CMS | Webflow |
|---|---|---|---|---|---|---|
| **Brochure + blog** (DW's real shape: posts, meta, 3 lists) | **Default at launch.** Static pages, Status global for the owner, posts written by you under "momentum." | Good: $0, 2-min publish, email login via Cloud (≤3 users free) — but no roles for an SEO contractor | **Pick when earned:** a contractor is named in the contract, or 60–90 days of tickets show a person posting weekly. Then posts + SEO + 2–3 lists from the starter, 2–4 days; roles for the writer; one-hop revalidation | Only if reshaped to ≤5 types and the cache chain rebuilt; Free plan makes every editor an Administrator | 4–6 weeks for a blog editor you then maintain alone | Wrong stack for a hand-coded Next site |
| **Content-heavy with collections** (Lando: races, calendar, news, media) | No — too many edits | Marginal: dates/relations work, but no drafts/scheduling/media library | **Pick.** Typed collections + relationships + uploads with focal point + scheduled publish; page stays static | Works but Studio + Function + webhook + token where a table and a rebuild would do | 9–16 weeks | This is literally how landonorris.com is built — but see row 3 |
| **Client insists on self-editing layout/pages** | Refuse — they will not accept it | No (content only) | No — Payload edits content, not your motion pages; don't fake a page builder | No (same problem, plus stega on split text) | Never | **Pick — as a separate, plainly-labelled product.** Edit Mode + free Client Seats, Content Editor/Marketer roles, Premium $25/mo — https://www.paddlecreative.co.uk/blog/webflow-edit-mode-client-seats-guide (2026 third-party; webflow.com blocked fetches). Different stack, 50k-char code caps, no server logic. Or walk away. |
| **No editing needed** (landing pages, micro-sites, most brochure clients) | **Pick.** Static, `content/*.json` in repo, Status global only, edits in five minutes, billed | Overkill | Overkill — install nothing you don't need | No | No | No |

---

## 3. The operating model

**What you tell clients:** the site has three kinds of content. Things that are urgent — hours, closures, prices, safety notices — they change themselves, from a phone, live in a minute. Things that change on a schedule — posts, events, team, FAQs, every page's SEO fields — get an editor with named logins once there is a person who will use it. The designed pages stay in your hands; they send the change and it's live within two business days, same day for anything in the urgent class. That is how the sites they admire are run: the Lando Norris team edits race data, not the layout.

**Ownership and exit, in writing, in every contract:** the repo lives in a GitHub org the client owns (you are a collaborator); the Vercel project is in the client's team or transferable to it; Neon and Resend are registered under the client's email; DNS stays in their registrar; and there is a one-page "if Jake is unavailable" procedure (where the repo is, how to deploy, who else can). The reason the first draft's sentence read as a trap was not the SLA, it was that Payload-in-your-repo on your Vercel seat on your Neon on your Resend gave the client nothing to walk away with. Now they own everything; you are the mechanic.

**The exact sentence when a client asks "can I edit it myself?":**

> "Yes. Anything urgent — hours, a closure, a price — you change yourself from your phone and it's live in a minute. Posts, events, your team and the SEO fields get their own logins the moment you have someone who'll use them. The designed pages are mine to edit: same day if it's urgent, two business days otherwise, so nothing you're paying for gets broken by a stray edit. And you own all of it — the code, the hosting, the domain. I'm the mechanic, not the landlord."

**What to charge** (market: small-business care plans $50–$500/mo — https://www.apexure.com/blog/website-maintenance-cost; Ahrefs' 2024 survey of 439 providers puts the most common SEO retainer band at $501–$1,000/mo (20.4%) — https://ahrefs.com/blog/seo-pricing/, updated 2024-08-15; the SLA numbers below are yours, not the market's):

| Line | Price | Includes |
|---|---|---|
| Care + edits | **$150–$300/mo** | Hosting, monitoring, Status global, ~2 h of content/copy edits, same-day for the urgent class, 2-day SLA otherwise, nightly backup |
| Care + monthly publishing ("momentum") | **$500–$1,000/mo** | Above + one substantive page or post per month written/built by you, quarterly review; bundle on the Google Ads invoice |
| Security patching + platform upkeep (Payload sites only) | **$50–$100/mo per site** (your number, RECALLED-grade market fit) | Advisory monitoring, patched minor within 48–72 h of any High/Critical, CI smoke test, Next minors, share of starter upkeep, the 2027 4.0 migration day. Named on the invoice, never hidden inside "edits" |
| Editor build | **Fixed line item, added when earned** | Payload starter configured: posts, lists, SEO fields, redirects, roles, login path tested, training video (re-recorded at 4.0). "CMS" is scoped, never assumed |
| SEO implementation for a third-party SEO | **$100–$150/h** or included hours | Redirects, schema, new landing pages as tickets |
| Webflow build (only if they insist on self-editing layout) | Separate quote | Client pays Webflow Premium via client payments; you say plainly it's a different stack |

**What to refuse:** page-builder or section-reordering access on motion pages; raw HTML/script fields; shared logins; "unlimited edits" without scope (offer "unlimited small text/image edits, 2-day SLA" instead); any field that does not render (the DW anti-pattern); and any promise that publishing is instant until you have pressed Publish and watched the CDN change with your own eyes.

**Evidence you can lean on when a client pushes back:** developers report clients rarely self-manage a CMS, "always came back asking me to do the edits," and lose their logins (https://dev.to/madza/how-do-you-deal-with-content-editing-after-the-site-has-been-shipped-1oad, comments Oct 2020); Joost de Valk (Yoast founder) argues a small site with a blog does not need a CMS at all (https://joost.blog/do-you-need-a-cms/). Counter-evidence to stay honest: Clutch says 61% of small businesses update weekly — "adjusting hours, featuring new products" — and 75% are on no-code (41%) or low-code (34%) platforms (https://clutch.co/resources/state-of-small-business-websites-2025). The weekly edit is the hours edit; that is why the Status global is mandatory and why the blog editor is not. Model the behaviour, not the intent.

---

## 4. Newsletters and the SEO person

**Newsletters: the CMS is not involved.** Pick the tool by who writes the email.

- **You or automation write it** (monthly "what's new," post-publish digest, form → contact): **Resend Broadcasts**, already in your stack. Free to 1,000 marketing contacts; Marketing Pro $40/mo for 5,000 — https://resend.com/pricing. Editor with slash commands, per-recipient unsubscribe via `{{{RESEND_UNSUBSCRIBE_URL}}}`, contacts via CSV or API, Broadcast API for programmatic sends — https://resend.com/docs/dashboard/broadcasts/editor. No hosted signup form exists in the docs: you build the form calling `contacts.create` and implement double opt-in yourself.
- **The client writes it**: **Kit** (free to 10,000 subscribers — https://kit.com/pricing) or **beehiiv** (free to 2,500, hosted archive — https://www.beehiiv.com/pricing). Give them the tool; don't route it through the site.
- The only glue between CMS and newsletter is "publish a post → send a broadcast." In Payload that is one `afterChange` hook on `posts` calling the Resend Broadcast API. Payload has no bulk sending of its own (`@payloadcms/email-resend` is for auth and form mail — https://payloadcms.com/docs/email/overview); the community newsletter plugin's maintenance status is unverified. Do not sell a newsletter *product* out of the CMS.

**The SEO contractor: the CMS is involved, narrowly, and it's the reason to pick Payload over Keystatic — and the one editor user DW's data proves exists.**

What they actually change (DW's dataset: posts, `/news` meta, two rating-page metas in three months; industry onboarding checklists ask for GSC, GA4, GTM, CMS editor, hosting for redirects — https://rankai.ai/articles/seo-onboarding-checklist-for-new-clients): per-page title/description/canonical/noindex/OG image, blog posts, FAQ items, redirects, schema, occasional landing pages.

What you give them:

- A named `seo` role in Payload. `pages.access.update` allows `seo`; every non-meta field has `access.update` restricted to `admin`, which makes those fields read-only for the seo role (their writes are silently discarded — https://payloadcms.com/docs/access-control/fields); the SEO plugin's `meta` group stays writable. To keep their screen clean, non-meta fields carry an `admin.condition` that hides them when the user's role is `seo` — not `access.read: false`, which would also strip the field from the API and from the context they need. Their API key inherits the same access rules, and the same read-only-not-hidden caveat — https://payloadcms.com/docs/authentication/api-keys.
- Write access to `posts`, `faqs`, and a `redirects` collection (official plugin) consumed by `next.config` at build. `trash: true` on all three, because two bulk-retitle sessions already happened on DW.
- GSC/GA4/GTM come from the client, not you. Schema (JSON-LD) and new landing pages are tickets you build at the hourly rate — that is design work, not content.

What you never give them: raw HTML/script fields, layout access, a shared login, a hosted Studio with a stale schema.

---

## 5. Desert Wings — fix, don't migrate

Migrating a live site whose client is actively posting is the wrong project, and DW's Next 16.2.4 is below Payload's 16.2.6 floor anyway. Fix Sanity in place, prune the schema, wire the one thing the owner needs, leave it. Two paths for the cache; pick A unless you want to spend the extra day.

**Path A — stay on next-sanity 12, make it self-healing (~8 h)**

1. `sanity/lib/live.ts`: add `fetchOptions: { revalidate: 300 }` to `defineLive` so the Data Cache expires on its own (v12 reads `fetchOptions?.revalidate` — verified in the published dist, §1). Change `apiVersion: 'vX'` to a date string; `vX` is experimental and "may also cause data loss" — https://www.sanity.io/docs/content-lake/api-versioning. *Do not* un-gate `<SanityLive />` on v12 + Next 16 (prefetch cascade, https://www.sanity.io/docs/help/nextjs-16-sanitylive-status). — 1 h
2. `app/api/revalidate/route.ts`: revalidate on any `_type` instead of `TAGGABLE_TYPES`. — 0.5 h
3. Confirm the Sanity webhook targets `https://www.desertwingsflightschool.com/api/revalidate` with the secret, that `SANITY_REVALIDATE_SECRET` is set in Vercel prod, and read the delivery log for 401s (`parseBody` returns `isValidSignature: null` and the route 401s if either side is missing). — 1 h
4. Vercel → CDN → Caches → purge "Runtime and Data Cache" once. **This is team-wide, not per-project:** "On Hobby and Pro, your projects share a single cache, so purging deletes the cached data for every project in your team in that environment" (https://vercel.com/docs/caching/runtime-cache/data-cache, updated 2026-08-21). Do it once, off-hours, and expect a cold-fetch blip on EAS and every other client. — 0.25 h
5. Clean the 6 malformed slugs and 5 missing `publishedAt` values in the dataset; remove the 4-way slug match in `sanity/lib/queries.ts` and the strip in `components/page/news/NewsCard.tsx`. — 1.5 h
6. Wire `/pricing` to `getPageContent('/pricing')` so the client's July edits render, **or** delete that tab from `pageSeo.ts`. Do one or the other; a field that doesn't render is the whole problem. — 2 h
7. Deploy, publish a test post, watch it appear without a redeploy; then tell the client. — 1 h

**Path B — upgrade to next-sanity 13 + Sync Tag Function (~16–20 h)**: next-sanity 12.3.0 → 13.3.4 (breaking: `fetchOptions`/`stega` options removed), sanity 5.21 → 6.x, `@sanity/client` ≥7.26.2; `<SanityLive />` unconditional; deploy a Blueprint with `defineSyncTagInvalidateFunction` → `/api/revalidate-tags`; `waitFor="function"` — https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/MIGRATE-v12-to-v13.md, https://www.sanity.io/docs/changelog/7a491dd1-67e8-41e0-9a89-eb9704055dc6. Only worth it if you want true "publish → live" instead of a 5-minute window. Note v13's default is deliberately "less live" because of a Next.js regression Sanity is still waiting on (vercel/next.js#93210).

**Schema prune (either path, ~14–18 h):** delete `fleetAircraft`, `alumni`, `redirect`, `siteSettings` (0 docs, renders nowhere), the `homeContent` a11y/i18n strings, and every `pageSeo` tab whose fields have no consumer (`/`, `/team`, `/contact`, `/news`, `/career-pilot`, `/pricing` decoys). **Do not delete the `announcement*` fields — wire them** to a site-wide banner with an on/off and expiry, revalidated by the existing webhook (~2 h). The first draft had this backwards: it is the only field on the site a flight school actually needs on a Tuesday when the wind is up. Remove `proxy.ts`'s per-request Sanity fetch for zero redirects. Delete `lib/getFaqs.ts`'s dead `getAllFaqs` or wire `/faqs` to it. What remains — posts, per-route meta, announcement, instructors, testimonials, journey stages, career modules, FAQs — is a model the client can actually understand.

**Total: ~3.5 working days.** Then leave it alone. Side note: the research run authenticated the Vercel CLI on this Mac as `jaketryall` via device-code login; nothing was deployed or changed.

Sanity MCP `CONNECTION_CLOSED`: almost certainly the 7-day OAuth session lapsing and Claude Code failing to reconnect (https://www.sanity.io/docs/ai/mcp-server; https://github.com/anthropics/claude-code/issues/56208). `/mcp` → re-authenticate, or `claude mcp remove Sanity` and re-add. Not a Sanity outage (https://www.sanity-status.com/).

---

## 6. The "races" case

Lando's "next race" banner is a Webflow CMS collection baked to static HTML (verified: 3 `w-dyn-list` occurrences and `data-wf-domain="landonorris.com"` on https://landonorris.com/, curl 2026-09-05; case study https://www.itsoffbrand.com/our-work/lando-norris). Under the recommendation it is a Payload collection rendered by your component at build time, regenerated on publish:

```ts
// collections/Races.ts
export const Races: CollectionConfig = {
  slug: 'races',
  trash: true,                                        // soft-delete; Neon Free has no PITR
  admin: { useAsTitle: 'name', defaultColumns: ['round', 'name', 'date', 'status'] },
  defaultSort: 'date',
  access: { read: () => true },                       // public read; write = logged-in editor
  hooks: {
    afterChange: [() => { revalidatePath('/'); revalidatePath('/calendar') }],
    afterDelete: [() => { revalidatePath('/'); revalidatePath('/calendar') }],
  },
  fields: [
    { name: 'round',   type: 'number', required: true, index: true },
    { name: 'name',    type: 'text',   required: true, maxLength: 40 },   // fits the banner at 320px
    { name: 'circuit', type: 'relationship', relationTo: 'circuits', required: true },
    { name: 'date',    type: 'date',   required: true, index: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } } },
    { name: 'status',  type: 'select', defaultValue: 'upcoming',
      options: ['upcoming', 'live', 'complete', 'cancelled'] },
    { name: 'result',  type: 'group', admin: { condition: (d) => d.status === 'complete' },
      fields: [{ name: 'position', type: 'number' }, { name: 'fastestLap', type: 'checkbox' }] },
    { name: 'poster',  type: 'upload', relationTo: 'media' },           // media enforces size/alt/imageSizes
  ],
}

// app/(site)/calendar/page.tsx — fully static; rebuilt only by the hook above
export const revalidate = 86400                       // "next race" rolls over daily without an edit
export default async function CalendarPage() {
  const payload = await getPayload({ config })
  const { docs: races } = await payload.find({ collection: 'races', sort: 'date', depth: 1, limit: 30 })
  const next = races.find((r) => r.status !== 'complete' && new Date(r.date) >= new Date())
  return (<><NextRaceBanner race={next} /><RaceLedger races={races} /></>)   // your GSAP/Lenis components, untouched
}
```

Field APIs verified at https://payloadcms.com/docs/fields/date, /docs/fields/relationship, /docs/hooks/collections. The CMS holds seven scalar fields, a relation and an upload; every pixel of `NextRaceBanner` and `RaceLedger` is yours. A race calendar has a relation, an upload and a status workflow — it is over the hand-roll line by construction, so there is no "if this were the only thing" escape hatch any more: it is Payload, or it is a JSON file you edit under retainer. The only hand-roll on any site is the Status global (§2).

---

## 7. What would change my mind

- **Keystatic instead of Payload** — if the next three clients need only a blog and a writer (no SEO contractor, no roles, no images-in-prose beyond a hero), Keystatic Cloud is $0, has no database, no cache layer, no admin endpoints to patch and no migrations by construction; content is files, publish is a Vercel build (MEASURED 2026-09-05 from your Vercel deployment logs: EAS 19–22 s, DW ~1 min; not a benchmark). Its costs: still labelled experimental at 0.6.9, 2.4k stars, team-wide permissions only (3 free users) — https://github.com/Thinkmill/keystatic, https://registry.npmjs.org/@keystatic/core/latest, https://keystatic.com/docs/cloud. Revisit if it ships 1.0 or roles.
- **Keep Sanity** — if a client arrives already on Sanity Growth ($15/seat, https://www.sanity.io/pricing) with real Editor roles and a multi-person content team using comments/tasks/releases. Then Sanity's differentiators are load-bearing and Path B above is the work.
- **Webflow as a real second line** — if two clients in a row want a marketing person building landing pages weekly. OFF+BRAND's business exists because Webflow clients self-manage; the design ceiling is Awwwards-high. Sell it as Webflow, priced as Webflow, and keep the Next.js line for the sites that need Next.js.
- **Payload loses** — if the §2 item 9 measurement on Vercel Fluid + Neon Free comes back over ~4 s and Neon Launch/keep-warm does not fix it (clients will call it broken); if Next 17 ships and Payload's stable pairing lags past a quarter on a site that needs the new Next; if the advisory rate stays at ~10/year *and* 4.0 lands with breaking config changes so that the patch-and-migrate line in §3 exceeds what a client will pay. The 4.0 migration itself is no longer a "what would change my mind" — it is scheduled and budgeted. Mitigation is the §2 patch policy and a config-only starter, not pinning.
- **Build your own** — never, beyond the Status global. The day the word "blog" appears, you are rebuilding Payload's first 20% with none of its docs — and none of its advisories, which is the same thing as none of its patches.
- **The hidden number to watch:** hops between the client pressing Publish and the CDN serving new HTML. Payload in-process: one. Git-based: one build. Sanity 13 with Function: four, two of them Sanity-deployed artifacts. If any option's count goes up, its rank goes down. The second number, added today: minutes per year per site spent on forced upgrades. Static: zero. Keystatic: near zero. Payload: ~5 minor bumps × build/migrate/smoke, automated by Renovate + CI or it eats the retainer.

---

## 8. Objections answered

1. **"The patch treadmill is the real price; 'pin minors' means stay vulnerable."** Accepted and adopted: §2 item 2 replaces pinning with a 48–72 h patch policy, Renovate + CI importmap smoke test, and a named invoice line in §3. It does not change the pick, because the alternative with an editor (Keystatic) has no roles and the alternative without one (static) is already the default.
2. **"Payload 4.0 is on npm today, not hypothetical."** Correct; §2 item 3 now treats it as scheduled — H1 2027 starter-first migration, one day per client, config-only admin customisation, training video re-recorded then.
3. **"Migrate-at-build on Vercel previews is a 2 am foot-gun."** Adopted verbatim into §2 item 4: prod `DATABASE_URL` only in Production, Neon branch per preview, `push: false`, never from a laptop — enforced by the starter's `vercel.json` and README, not by memory.
4. **"Neon Free has a 6-hour restore window and no PITR."** True; §2 item 5 adds `trash: true` everywhere, a nightly `pg_dump` to Blob as a retainer deliverable, and Neon Launch for clients who want 7-day history. Scale-to-zero latency is now a hard measurement gate (item 9), not a promise.
5. **"The hand-roll exception contradicts the Supabase warning."** It did; the ≤8-field exception is withdrawn. The only hand-roll left is the Status global, on Neon, and §6 no longer offers a Supabase escape hatch.
6. **"Data Cache purge is team-wide on Pro."** Fixed in §5 step 4, with the LRU-eviction point added to §2 as one more reason the Local API path matters.
7. **"The starter does not exist and its upkeep is unpriced."** Now budgeted (§2 item 10: 3–5 days to build, ~1 day/quarter, plus 4.0) and priced (§3 patching + upkeep line).
8. **"Time-sensitive edits land on the wrong side of the split; deleting DW's announcement fields is backwards."** Right on both counts. Every site now gets an owner-editable Status global with a same-day SLA class behind it (§2, §3), and §5 wires DW's `announcement*` fields instead of deleting them.
9. **"Your own evidence says the client won't use the editor you're selling."** The owner won't; the contractor did — 39 posts. So the matrix default for brochure+blog is no editor at launch, Payload only when a named person is posting weekly; the editor is built for the writer, never sold on the owner's intent.
10. **"The editing UI can break the design."** Addressed by the edit-safe checklist in §2 item 7 — `maxLength`, upload limits, required alt, restricted Lexical, autosave + Draft/Publish labelling, live preview in the starter — and shown in the §6 schema.
11. **"'I edit it for you' reads as a trap without ownership and exit."** §3 now puts repo, Vercel project, Neon, Resend and DNS in the client's name with an "if Jake is unavailable" procedure, and the client sentence says so.
12. **"The login path is unspecified and will fail first."** §2 item 8: Resend adapter with a verified domain (three free, then yours or Pro), reset mail received by the actual editor before handover, lockout limits set and communicated, video re-recorded at 4.0.
13. **"The cost story hides a latency story."** Agreed; the $0–5/mo figure is now conditional on the stopwatch gate in §2 item 9, and Neon Launch/keep-warm is the expected first paid upgrade rather than a surprise.

---

*Sources fetched 2026-09-05 unless noted, cited inline. MEASURED items (by hand, 2026-09-05, not benchmarks): EAS/DW build times from Vercel deployment logs; DW dataset copy-coverage percentages. RECALLED-grade items: Payload admin cold-start figure (third-party, 2025-05-16, no version); `maxLoginAttempts`/`lockTime` defaults; Resend Pro price; Auth.js email-provider package for the Status global; per-environment Neon wiring as the most common Payload-on-Vercel corruption path; Figma acquisition's effect on team/cadence; `payload.db.pool` exposure for `attachDatabasePool`; `admin.condition` receiving `{ user }` in v3; the $50–$100/mo patching line's market fit; Webflow pricing figures come from 2026 third-party guides because webflow.com blocked direct fetches — re-verify before quoting to a client. Open measurement: §2 item 9 admin cold start and publish-to-CDN on Vercel Fluid + Neon Free — record here with a date before the first Payload quote.*
