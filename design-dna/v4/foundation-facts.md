# Foundation facts — Next.js 16.3.4 / React 19.2.4 / Tailwind v4 / Vercel

Researched 2026-09-10 via context7 (`/vercel/next.js`, docs snapshot dated 2026-08-25, `version: 16.3.4` stamped on the fetched pages) and official docs (nextjs.org, vercel.com, webkit.org, caniuse.com). Every claim below is sourced; anything I could not verify against a primary source is marked **UNVERIFIED**. Stack: Next.js 16.3.4, React 19.2.4, Tailwind v4, Vercel, TypeScript strict.

---

## 1. App Router file conventions, current (16.3)

**ANSWER:** The convention set is unchanged in name for `layout`/`page`/`loading`/`error`/`not-found`/`template`/`route`/`default`, but three things moved under you since May: `middleware.ts` is deprecated in favor of `proxy.ts` (16.0), `error.tsx` is still mandatorily a Client Component and in 16.3 also receives a stable `retry()` prop, and there's a new **experimental** `global-not-found.tsx` root-level 404 convention.

Complete file list, from the Next.js webpack app-loader's own source (`FILE_TYPES`/`AppDirModules`):

| File | Purpose | Required? |
|---|---|---|
| `layout.tsx` | Shared UI wrapping a segment + children; root layout is mandatory | Root layout: **required**. Nested: optional |
| `page.tsx` | Makes a segment publicly reachable (route leaf) | Required to expose a route |
| `loading.tsx` | Instant Suspense fallback for the segment while it streams in | Strongly recommended (every segment that fetches data) |
| `error.tsx` | Client-side error boundary for the segment | Strongly recommended per segment that can throw |
| `global-error.tsx` | Root-level error boundary; replaces the root layout, must render its own `<html>`/`<body>` | Recommended once, at `app/global-error.tsx` |
| `not-found.tsx` | UI shown when `notFound()` is called or a segment 404s | Recommended (root + any dynamic segment) |
| `global-not-found.tsx` | **Experimental** (`experimental.globalNotFound: true`) — one 404 for the whole app, skips the root layout entirely | Optional, opt-in |
| `template.tsx` | Like layout, but remounts (fresh state) on navigation; wraps `error`/`loading`/`not-found`/`page`, does **not** wrap `layout` | Rarely needed on a marketing site |
| `route.ts` | API endpoint (Route Handler) — mutually exclusive with `page.tsx` in the same segment | Required for the 4 API routes in this build |
| `default.tsx` | Fallback for unmatched parallel-route slots on hard navigation/reload | Only needed if you use parallel routes (unlikely here) |

`error.tsx` / `global-error.tsx` signature, confirmed for 16.3 (retry stabilized in 16.3.0, was unstable in 16.2.0):

```tsx
'use client' // Error boundaries must be Client Components

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
```

`global-error.tsx` must render its own `<html>`/`<body>` (it replaces the root layout):

```tsx
'use client'

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
```

`generateStaticParams`, current shape — with Cache Components enabled it **must return at least one param** (an empty array now errors: `empty-generate-static-params`), unlike pre-16 where `[]` silently deferred every path to runtime:

```tsx
export async function generateStaticParams() {
  return [{ slug: '1' }, { slug: '2' }, { slug: '3' }]
}

export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <Content slug={slug} />
}
```

`generateMetadata`, current shape (async, receives typed `props` + `parent`):

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params, searchParams }: PageProps<'/work/[slug]'>,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const project = await fetch(`https://.../${slug}`).then((r) => r.json())
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: project.title,
    openGraph: { images: [project.ogImage, ...previousImages] },
  }
}
```

New in 16.3, not file-convention but adjacent: `PageProps<'/route/[slug]'>` is a **globally generated helper type** (via `next dev`/`next build`/`next typegen`) — no import needed, and `params`/`searchParams` are always Promises that must be awaited.

**Citation:** context7 `/vercel/next.js` — `docs/01-app/03-api-reference/03-file-conventions/{error,not-found,template,default,route,dynamic-routes}.mdx`, `docs/01-app/03-api-reference/04-functions/generate-metadata.mdx`, `docs/01-app/02-guides/migrating-to-cache-components.mdx`, plus the webpack app-loader source (`packages/next/src/build/webpack/loaders/next-app-loader/index.ts`). Applies to 16.3.x (docs snapshot dated 2026-08-25).

---

## 2. Caching and rendering in 16.3

**ANSWER:** Partial Prerendering is no longer called "PPR" and no longer lives behind `experimental.ppr` — it's now **Cache Components**, turned on with a single top-level flag `cacheComponents: true`, and it is still **opt-in, not the default**, in 16.3. `experimental.ppr` and the `experimental_ppr` route-segment export were **removed** in Next.js 16 (there's a codemod). A second, separate opt-in flag, `partialPrefetching: true`, layers "Instant Navigations" (client-side prefetch shells) on top — also not-default in 16.3.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,     // Cache Components + PPR (replaces experimental.ppr)
  partialPrefetching: true,  // Instant Navigations (16.3, opt-in)
}

export default nextConfig
```

**Caching defaults, without `cacheComponents` (i.e. classic behavior, still what you get if you don't opt in):**
- `fetch()` is **not cached by default** — this changed in Next.js 15 (was cache-by-default in 14). Opt in per-call with `{ cache: 'force-cache' }`, or per-segment with `export const fetchCache = 'default-cache'`.
- `GET` Route Handlers are **dynamic by default** since 15.0-RC (used to be static-by-default). Opt a specific handler into static generation with `export const dynamic = 'force-static'`.
- Route segment config values, unchanged surface: `dynamic: 'auto' | 'force-dynamic' | 'error' | 'force-static'`, `revalidate: false | 0 | number`, `fetchCache: 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'`.

**With `cacheComponents: true`:** nothing is cached or prerendered unless you explicitly mark it. The primitive is the `'use cache'` directive (stable since November 2025 per the 16.3 blog post), which can be applied to a function, a component, or a whole file:

```tsx
async function ProductList() {
  'use cache'
  const products = await db.product.findMany()
  return <List items={products} />
}
```

With Cache Components on, `GET` Route Handlers follow the **same prerendering model as pages** — they're dynamic unless a cacheable function inside is marked `'use cache'`. `revalidateTag` also changed shape: the single-argument form is deprecated, it now takes a `cacheLife` profile as a second argument: `revalidateTag('posts', 'max')` instead of `revalidateTag('posts')`.

For this build (marketing site, four API routes, mostly static content): given the target budgets (LCP ≤600ms desktop, zero long tasks), turning on `cacheComponents: true` is worth it specifically so case-study/service pages prerender fully static by default and only the contact-form route handler is dynamic — but it is a deliberate, documented opt-in, not a fallback you get for free.

**Citation:** context7 `/vercel/next.js` — `docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.mdx`, `docs/01-app/03-api-reference/01-directives/use-cache.mdx`, `docs/01-app/02-guides/{caching-without-cache-components,migrating-to-cache-components,upgrading/version-15,upgrading/version-16}.mdx`, `docs/01-app/03-api-reference/03-file-conventions/route.mdx`; and https://nextjs.org/blog/next-16-3 (published 2026-08-03). Applies to 16.3.x specifically — this is the single fastest-moving area of the framework and the guide names it explicitly ("paving the way for the next major version").

---

## 3. `next/font`

**ANSWER:** API surface is unchanged from what you'd remember, but subsetting for **local** fonts (unlike Google fonts) is NOT automatic — you must pre-subset the file yourself before pointing `next/font/local` at it.

```tsx
// app/fonts.ts
import localFont from 'next/font/local'

export const brandSans = localFont({
  src: [
    { path: './fonts/Brand-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Brand-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-brand',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: 'Arial', // local-font default is 'Arial' (google default is boolean true)
})
```

```tsx
// app/layout.tsx
import { brandSans } from './fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${brandSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
```

Wiring the variable into Tailwind v4's `@theme` (CSS-first, no `tailwind.config.js` fontFamily needed):

```css
/* app/globals.css */
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-brand);
}
```

Full options reference (`font/local` column): `src` (required — string or array of `{path, weight?, style?}`), `weight`, `style`, `display` (`'auto'|'block'|'swap'|'fallback'|'optional'`, default `'swap'`), `preload` (boolean, default `true`), `fallback` (string array, no default), `adjustFontFallback` (for local: `'Arial' | 'Times New Roman' | false`, default `'Arial'`; for Google: boolean, default `true`), `variable` (string, declares the CSS var), `declarations` (array of `@font-face` descriptor overrides, e.g. `[{ prop: 'ascent-override', value: '90%' }]`).

**Subsetting confirmed NOT automatic for local fonts.** Google Fonts loaded via `next/font/google` ARE auto-subset (you just declare `subsets: ['latin']` to pick which to preload) — but `next/font/local` only self-hosts and optimizes loading (`display`, size-adjusted fallback metrics, no external request); it does **not** strip unused glyphs from your file. Current tooling to do this ahead of time: **pyftsubset** (part of `fonttools`) or **glyphhanger** (a wrapper around pyftsubset — same output either way), run in a build/CI step against your actual rendered character set. Both correctly handle variable fonts, preserving the variation axes/interpolation while dropping unused glyph outlines.

**Citation:** context7 `/vercel/next.js` — `docs/01-app/03-api-reference/02-components/font.mdx` (fetched verbatim, `version: 16.3.4`, `lastUpdated: 2025-08-06`); tooling claim per WebSearch (fonttools/pyftsubset + glyphhanger, 2026 sources — general web-font-optimization consensus, not Next.js-specific documentation, flagged as such).

---

## 4. `next/image`

**ANSWER:** The single biggest gotcha: **`priority` is deprecated as of Next.js 16.0.0**, replaced by `preload`. Default `formats` is WebP only — AVIF is opt-in, not on by default.

Current props table (16.3.4, from `nextjs.org/docs/app/api-reference/components/image`):

| Prop | Default | Status |
|---|---|---|
| `src`, `alt` | — | Required |
| `width`, `height` | — | Required unless `fill` or static import |
| `fill` | `false` | — |
| `sizes` | none (assumes `100vw` if `fill`/responsive and omitted) | — |
| `quality` | `75` | — |
| `preload` | `false` | **new in 16.0**, replaces `priority` |
| `priority` | — | **deprecated since 16.0**, use `preload` |
| `loading` | `'lazy'` | `'lazy' \| 'eager'` |
| `placeholder` | `'empty'` | `'empty' \| 'blur' \| 'data:image/...'` |
| `fetchPriority` | inherited HTML attr, not a documented Next prop but passes through | use for above-the-fold non-LCP cases |
| `decoding` | `'async'` | `'async' \| 'sync' \| 'auto'` |
| `overrideSrc` | — | keep old `src` attribute for SEO when migrating from `<img>` |
| `onLoadingComplete` | — | **deprecated since 14.0**, use `onLoad` |

`next.config.js` current defaults:
```js
module.exports = {
  images: {
    formats: ['image/webp'],                                   // default — AVIF is NOT on by default
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // default
    imageSizes: [32, 48, 64, 96, 128, 256, 384],                // default
    qualities: [75],                                            // default AND now an enforced allowlist (16.0+)
  },
}
```

To get AVIF+WebP (AVIF preferred, WebP fallback):
```js
module.exports = {
  images: { formats: ['image/avif', 'image/webp'] },
}
```

**(a) Full-bleed hero:**
```jsx
<Image
  src={hero}
  alt="Hero"
  fill
  sizes="100vw"
  preload         // was `priority` pre-16 — this is the LCP element
  style={{ objectFit: 'cover' }}
/>
```

**(b) Card in a 3-up grid:**
```jsx
<Image
  src={card}
  alt="Case study thumbnail"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
```

`preload` vs `loading="eager"` vs `fetchPriority`: use `preload={true}` **only** for the single image that is the actual LCP element (it inserts a `<link rel="preload">` in `<head>`) — docs explicitly warn against using it when there are multiple candidate LCP images per viewport, or alongside `loading`/`fetchPriority` (pick one strategy). For most "above the fold but not LCP" cases, docs now recommend `loading="eager"` or `fetchPriority="high"` over `preload`.

Placeholder options: `'empty'` (default, no placeholder), `'blur'` (needs `blurDataURL`, auto-generated for static imports of jpg/png/webp/avif unless animated), or a raw `data:image/...` URL.

**Citation:** context7 `/vercel/next.js` `docs/01-app/03-api-reference/02-components/image.mdx` + full WebFetch of https://nextjs.org/docs/app/api-reference/components/image (page metadata stamped `version: 16.3.4`, `lastUpdated: 2026-08-25`), including its own Version History table confirming `preload` added / `priority` deprecated / `qualities` default changed to `[75]` all landed in **v16.0.0**.

---

## 5. `vercel.ts`

**ANSWER:** Confirmed real and current (changelog entry + full docs page live as of 2026-08-25). It is a **superset**, not a replacement — `vercel.json` is still fully, equally valid; you use one or the other, never both.

Package: **`@vercel/config`**, imported from **`@vercel/config/v1`**.

```bash
npm i @vercel/config
```

```ts
// vercel.ts
import { routes, deploymentEnv, type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'npm run build',

  // Security headers on every route, plus long-cache immutable static assets
  headers: [
    routes.header('/(.*)', [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    ]),
    routes.cacheControl('/_next/static/(.*)', {
      public: true,
      maxAge: '1 year',
      immutable: true,
    }),
  ],

  redirects: [
    routes.redirect('/old-pricing', '/pricing', { permanent: true }),
  ],
};
```

Key facts from the docs:
- `vercel.js`, `.mjs`, `.cjs`, `.mts` are also valid filenames for this convention.
- `vercel.ts` **executes at build time** (unlike static `vercel.json`), so it can fetch from APIs, read env vars, or branch on `process.env` to build config dynamically — that's the entire reason it exists.
- Migration is literally: paste your `vercel.json` object into `export const config = {...}` in `vercel.ts`, then optionally adopt the `routes.*` helpers for type safety.
- CSP/redirects/rewrites/headers all support conditional matching via `has`/`missing` (header, cookie, host, or query presence checks) — same primitives as `vercel.json`, now typed.
- `images` config (AVIF/WebP formats, `remotePatterns`, `qualities`) can also live here instead of `next.config.ts`, controlling Vercel's own Image Optimization API layer.

**Citation:** https://vercel.com/docs/project-configuration/vercel-ts (fetched verbatim, `last_updated: 2026-08-25`) and https://vercel.com/changelog/vercel-ts. `@vercel/config` package confirmed via the same page's install instructions.

---

## 6. Security headers + CSP

**ANSWER:** Set headers in `next.config.ts` (`headers()` function) for static, unconditional cases, or in `proxy.ts` (the **16.0 rename of `middleware.ts`**) when you need a per-request CSP nonce. A strict CSP breaks two things in a default Next.js app: Next's own inline bootstrap script (needs a nonce or `'unsafe-inline'`) and any inline `<style>` Tailwind/critical-CSS injects (also needs a nonce, or `'unsafe-inline'` on `style-src` if you don't want to thread nonces through every styled element).

Recommended header set for this project:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Content-Security-Policy` | see below — includes `frame-ancestors 'none'` (replaces `X-Frame-Options`) |

Nonce-based CSP via `proxy.ts` (the 16.0+ file, formerly `middleware.ts` — note it now runs on **Node.js only**, edge runtime is not supported in `proxy`):

```ts
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
  const csp = cspHeader.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

Reading the nonce server-side to apply it to `next/script`, and note that any page reading the nonce must be forced dynamic (a nonce is inherently per-request, incompatible with static prerendering unless you accept that page opting out of static generation):

```tsx
import { headers } from 'next/headers'
import { connection } from 'next/server'
import Script from 'next/script'

export default async function Page() {
  await connection() // forces dynamic rendering so the nonce is real
  const nonce = (await headers()).get('x-nonce')
  return <Script src="https://www.googletagmanager.com/gtag/js" strategy="afterInteractive" nonce={nonce} />
}
```

Since this project has "no third-party scripts," the simpler path is to **skip the nonce dance entirely**: a static CSP with `script-src 'self'` and `style-src 'self' 'unsafe-inline'` (Tailwind's compiled output is a static stylesheet, not inline styles at runtime, so `'unsafe-inline'` on style-src is a much smaller concession than on script-src — but it is still a concession; check whether any GSAP/inline `style=` attributes trigger it). Static headers this simple can live directly in `next.config.ts`:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ]
  },
}
```

**Citation:** context7 `/vercel/next.js` — `docs/01-app/02-guides/content-security-policy.mdx`, and the canonical `examples/with-strict-csp/middleware.js` (which itself needs updating to `proxy.js` per the 16 upgrade guide — the example in the repo hadn't been renamed as of this snapshot, a live inconsistency worth flagging); `docs/01-app/02-guides/upgrading/version-16.mdx` for the middleware→proxy rename and its Node-only runtime constraint. HSTS/Permissions-Policy values per MDN/OWASP consensus (WebSearch, not Next-specific).

---

## 7. SEO + AEO

**ANSWER:** Metadata API shape is stable and unchanged in spirit; the file conventions (`opengraph-image`, `icon`, `apple-icon`, `sitemap.ts`, `robots.ts`) are all current and unchanged. `llms.txt` remains a **community convention with no formal ratification** — do not oversell it. FAQPage rich results were **turned off by Google as of May 7, 2026**, though the schema itself is still valid and may still feed AI-answer surfaces.

Static + dynamic metadata:
```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://executiveaisolutions.com'),
  title: { default: 'Executive AI Solutions', template: '%s · Executive AI Solutions' },
  alternates: { canonical: '/' },
  openGraph: { title: 'Executive AI Solutions', type: 'website', siteName: 'Executive AI Solutions' },
}
```

```tsx
// app/work/[slug]/page.tsx
export async function generateMetadata(
  { params }: PageProps<'/work/[slug]'>
): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  return {
    title: project.title,
    alternates: { canonical: `/work/${slug}` }, // resolves against metadataBase
    openGraph: { images: [project.ogImage] },
  }
}
```

File conventions, all current, all file-based (no imports needed, discovered by filename):
- `app/opengraph-image.tsx` — generates OG image via `next/og`'s `ImageResponse`; export `alt`, `size = {width, height}`, `contentType`.
- `app/icon.tsx` / `icon.png` and `app/apple-icon.tsx` / `apple-icon.png` — favicon/touch-icon, static or dynamically generated.
- `app/sitemap.ts` — default export returns `MetadataRoute.Sitemap` (array of `{url, lastModified, changeFrequency, priority, alternates, images, videos}`); cached by default unless it uses request-time APIs.
- `app/robots.ts` — default export returns `MetadataRoute.Robots`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/private/' },
    sitemap: 'https://executiveaisolutions.com/sitemap.xml',
  }
}
```

**`llms.txt`, current state (as of ~June 2026 data):** authored by Jeremy Howard/Answer.AI (Sept 2024), lives at `llmstxt.org`, still a **community proposal, not an IETF/W3C standard** — a June 2026 W3C standardization *proposal* exists but has not been adopted. Adoption is thin and skews technical: ~8.7% of the top 1,000 sites overall, higher (~28%) among SEO-technical audiences. Consumption is inconsistent — named AI crawlers are ~19.5% of traffic to these files, but bots that actually drive AI-search citations are only ~1.1%; several major AI labs (including Anthropic) contribute to the convention but none guarantee they parse it. Treat it as low-cost, low-certainty insurance, not a load-bearing SEO tactic. For a small marketing site, keep it short (well under 2,000 words): H1 site name, one-paragraph blockquote summary, then a flat categorized list of your most important pages with a one-line description each (home, services, pricing, 3 case studies, contact) — markdown, at `/llms.txt` in the public root.

JSON-LD types that fit an agency site: `Organization` (or `ProfessionalService`, a subtype, if you want to lean into LocalBusiness-style rich results), `Service` (one per offering), `FAQPage` (still valid schema even though Google dropped the rich-result surface — may still feed AI answer engines), `BreadcrumbList` (on nested pages like `/work/[slug]`). Verbatim example (`Organization` in the root layout, rendered server-side, no hydration cost):

```tsx
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Executive AI Solutions',
    url: 'https://executiveaisolutions.com',
    logo: 'https://executiveaisolutions.com/logo.png',
    sameAs: ['https://www.linkedin.com/company/executive-ai-solutions'],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

**Citation:** context7 `/vercel/next.js` — `docs/01-app/03-api-reference/04-functions/{generate-metadata,image-response}.mdx`, `docs/01-app/03-api-reference/03-file-conventions/01-metadata/{sitemap,robots}.mdx`, `packages/next/src/lib/metadata/is-metadata-route.ts` (for the exact static-icon filename/extension table). llms.txt adoption stats via WebSearch (rankability.com "LLMS.txt Adoption," June 2026 data) and aeo.press "State of llms.txt in 2026" — third-party analyses, not a spec authority, flagged as such. FAQPage rich-result removal date (May 7, 2026) per WebSearch summary of SEO trade coverage — **UNVERIFIED against Google's own changelog**, corroborate before treating as fact.

---

## 8. Tailwind v4

**ANSWER:** Setup for Next 16 is unchanged from Tailwind v4's general CSS-first model. `tailwind.config.js` is **not gone** — it's optional/legacy, loaded explicitly via `@config` if you need JS-side plugins or content overrides — but a from-scratch build should not create one.

```bash
npm i -D tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.mjs
export default {
  plugins: { '@tailwindcss/postcss': {} },
}
```

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --color-ink: #0a0a0a;
  --color-accent: #4c6b7c;
  --radius-card: 1rem;
}
```

Referencing a `next/font` CSS variable — use `@theme inline` (not plain `@theme`) so the variable is inlined as-is rather than treated as a static theme value that needs its own fallback resolution:

```css
@theme inline {
  --font-sans: var(--font-brand);
  --font-mono: var(--font-brand-mono);
}
```

`tailwind.config.js` is fully supported still, but only pulled in if you explicitly reference it — there is no implicit auto-load in v4:
```css
@config "../../tailwind.config.js";
```

**Dark mode in v4:** the `darkMode` key in `tailwind.config.js` is gone. It's now a CSS-first `@custom-variant`:
```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
```
Default behavior with **no** `@custom-variant` declared: `dark:` follows OS `prefers-color-scheme` automatically, zero config. Add the line above only if you want a manual/class-toggled dark mode (e.g. driven by `data-theme` instead of `.dark`, swap the selector accordingly).

**Citation:** context7 `/vercel/next.js` `docs/01-app/01-getting-started/13-fonts.mdx` ("With Tailwind CSS" section, verbatim `@theme inline` example); Tailwind v4 PostCSS package name and `@custom-variant` dark-mode mechanism per WebSearch (tailwindcss.com blog + community sources on the v4 CSS-first rewrite) — general Tailwind v4 behavior, not Next-version-specific, so lower confidence than the context7-sourced Next.js claims; recommend a direct read of tailwindcss.com/docs before finalizing if precision matters here.

---

## 9. CSS scroll-driven animations

**ANSWER:** Chrome/Edge have supported `animation-timeline: scroll()`/`view()` since version 115 (mid-2023). **Safari shipped support in Safari 26** (released alongside iOS 26/macOS Tahoe in Sept 2025 — so about a year of production availability by this project's ship date). **Firefox does not support it in its current stable release (Firefox 155, Sept 2026)** — caniuse lists it landing around Firefox 158, which had not shipped as of Sept 10, 2026 (stable was 155, Beta 156, Nightly 157) — so Firefox support is imminent but not yet real. Net: use it, but behind a `@supports` fallback that defaults to fully visible content, never to hidden-until-scrolled content, so Firefox users see correct (if unanimated) content.

```css
/* Default: fully visible, no animation dependency (this is the fallback path) */
.reveal {
  opacity: 1;
  transform: none;
}

@supports (animation-timeline: view()) {
  .reveal {
    animation: fade-in-up linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

**Citation:** caniuse.com (`mdn-css_properties_animation-timeline_scroll`, fetched 2026-09-10 — Chrome/Edge 115, Firefox 158, Safari 26.0) cross-checked against WebSearch for current Firefox release number (Firefox 155 stable / 156 beta / 157 nightly as of Sept 2026 — confirms Firefox 158 is not yet shipped) and webkit.org's own scroll-driven-animations guide (confirms Safari 26 as the shipping version, originally published against the Safari 26 beta). **Firefox's exact ship version/date for stable support is UNVERIFIED** — caniuse's "158" is a target, not a confirmed shipped release, as of this research date.

---

## 10. CI

**ANSWER:** `next lint` was **removed in Next.js 16** — lint directly via ESLint's own CLI against a flat `eslint.config.mjs` (ESLint 9 default), which `create-next-app` now generates without the `next lint` wrapper. Node 24 is Active LTS as of Sept 2026 (Node 22 is now maintenance-only); Next.js 16's documented minimum is Node 20.9. `actions/checkout` and `actions/setup-node` are both at major version **v7** (July 2026 releases).

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint .
      - run: npm run build
```

Notes: `npm ci`, not `npm install`, for reproducible installs off the lockfile. `next build` no longer runs lint as a build step (also removed in 16), so the explicit `eslint .` step is load-bearing, not redundant. If chasing faster CI type-checking, Next.js 16.3 supports TypeScript 7 (`npm i -D typescript@^7`) for a markedly faster `tsc`/`next build` type-check pass — optional, not required.

**Citation:** WebSearch — Next.js 16 `next lint` removal (chris.lu, iloveblogs.blog, zenn.dev migration guides, cross-checked against the `next-lint-to-eslint-cli` codemod name); Node.js LTS schedule (endoflife.ai/nodejs, Sept 2026 snapshot: Node 24 Active LTS since Oct 2025, Node 22 maintenance since ~mid-2026, Node 26 is "Current" until Oct 2026); `actions/checkout@v7` / `actions/setup-node@v7` current-major status (github.com/actions/checkout and actions/setup-node releases, July 2026). Next.js 16 minimum Node version (20.9) per nextjs.org/docs/app/guides/upgrading/version-16 as summarized by WebSearch — recommend a direct doc check before final CI config since this one came from a search summary, not a context7/WebFetch primary read.

---

## CHANGED SINCE MAY 2026

These are the things most likely to break code written from pre-2026 or "current as of May 2026" knowledge:

1. **`priority` prop on `next/image` is deprecated (Next.js 16.0.0), replaced by `preload`.** Old code using `priority` still works but is on borrowed time; new code should use `preload={true}` on the actual LCP image only.
2. **`middleware.ts` is deprecated, renamed to `proxy.ts` (Next.js 16.0).** The exported function is renamed `middleware` → `proxy`. Critically, `proxy.ts` runs **Node.js only** — the Edge runtime is not supported there; if you need edge, you must keep the old `middleware.ts` file (Vercel says edge instructions for `proxy` are coming "in a follow-up minor release").
3. **Partial Prerendering is now "Cache Components," gated by `cacheComponents: true` — `experimental.ppr` and `experimental_ppr` are both REMOVED, not just renamed.** A codemod exists. This is still opt-in in 16.3, not a default.
4. **`next lint` is removed entirely in Next.js 16.** `next build` no longer auto-lints. CI and local workflows must call ESLint's own CLI (`npx eslint .`) against a flat `eslint.config.mjs` (ESLint 9). Biome is now an official alternative offered by `create-next-app`.
5. **`images.qualities` is now a required allowlist (default `[75]`), not an open range** (Next.js 16.0). A `quality` prop value outside the configured list is silently coerced to the nearest allowed value, or 400s if hit directly via the optimization API.
6. **Default `next/image` `formats` is WebP only — AVIF is opt-in**, unchanged in substance but worth confirming since AVIF is commonly assumed to be default-on by now.
7. **`revalidateTag('tag')` single-argument form is deprecated** — it now expects a `cacheLife` profile as a second argument: `revalidateTag('tag', 'max')`.
8. **`vercel.ts` is a genuinely new (2026) config surface** — a typed, executable alternative to `vercel.json` via the `@vercel/config` package, not a rename or a deprecation of the JSON file, which remains equally valid.
9. **`global-not-found.tsx` exists but is still experimental** (introduced 15.4, needs `experimental.globalNotFound: true` in 16.3) — don't build a foundation assuming it's stable.
10. **Safari shipped scroll-driven animations (`animation-timeline`) in Safari 26 (Sept 2025) — this is no longer a Chrome-only feature** — but Firefox still has not shipped it in a stable release as of Sept 2026, so the `@supports`-gated, visible-by-default fallback pattern is still mandatory, not legacy caution.
11. **`generateStaticParams` returning `[]` now hard-errors under Cache Components** (`empty-generate-static-params`) instead of silently deferring every path to request time, as it did pre-16.
12. **FAQPage rich results were reportedly dropped by Google (~May 2026)** — the schema is still valid and worth keeping for AI-answer-engine consumption, but don't sell it internally as a Google SERP win anymore. (Flagged UNVERIFIED against Google's own primary changelog — corroborate before repeating as fact.)
