# Survivor review — security + cost, four API routes

2026-09-10. Report only, no files changed except this one. Scope:
`app/api/chat/route.ts` (156 lines), `app/api/chat/transcript/route.ts`
(80 lines), `app/api/site-check/route.ts` (558 lines),
`app/api/contact/route.ts` (46 lines). No `middleware.ts` / `vercel.json`
exists — nothing sits in front of these routes at the edge, so every
protection has to be in the route file itself.

Pricing used below (Claude Haiku 4.5, current API rates): $1.00 / MTok
input, $5.00 / MTok output.

---

## 1. Rate limiting / abuse

**chat/route.ts L13-22.** A 10-msg/min-per-IP limiter, but it's a plain
`Map` in module scope — memory local to ONE warm serverless instance.
Vercel spins concurrent instances under concurrent load, and each gets
its own empty `Map`. A single visitor running a `for` loop with even
modest concurrency (10-20 parallel connections, not a botnet) is not
meaningfully capped by this code; the real ceiling becomes whatever
Anthropic's account-level RPM/TPM tier allows. No IP allowlist, no
auth, no origin check (Route Handlers don't enforce CORS by default),
no captcha, no per-key spend cap.

**Cost math (L124-134):** the full `SYSTEM` string — `knowledge()`
serializes all of `lib/services.ts` (15.5KB source) into the prompt —
is rebuilt and resent on **every** call with no `cache_control`
anywhere in the request body. That's roughly 3,000-3,500 input tokens
per call even for a one-word message, plus up to 300 output tokens
(L126). Per-request cost ≈ $0.0035-0.005.
- If the 10/min cap actually held (it doesn't, above a few concurrent
  connections): 600 req/hr × ~$0.0045 ≈ **$2.70/hr** from one IP.
- A trivial concurrent loop (20-50 parallel workers, no botnet needed)
  plausibly reaches **tens to low hundreds of dollars/hour**, bounded
  only by Anthropic's own account rate-limit tier — not by anything in
  this file.

**site-check/route.ts L22-30.** Same per-instance-`Map` limiter (6/min),
same concurrency bypass. No Anthropic key here, but each check can hold
a Vercel function open for up to ~15s wall-clock (9s primary fetch +
6s second-opinion timing fetch, L90/L213) and does real outbound
egress — under concurrent abuse this is the second route that spends
real money, via Vercel compute-seconds/bandwidth rather than a
per-token API bill.

**contact/route.ts — no rate limiter at all.** No `hits` Map, no
per-IP check, nothing (confirmed: the whole 46-line file has none).
A stranger cannot send mail *as* his domain to third parties — `to`
is the fixed `CONTACT_EMAIL` env var, not attacker-controlled — but
they can flood **his own inbox** with unlimited fake "quote request"
emails at will. That's an attention-DoS on real leads, and it shares
a Resend account/quota with `transcript/route.ts` (same
`onboarding@resend.dev` sender, same `RESEND_API_KEY`) — enough
junk volume can push the account into throttling or a plan's send cap,
which risks failing the one path that must never fail. This is the
route judged as "must keep working," so the fix must be additive only
(see §7).

**chat/transcript/route.ts L13-21.** 4/min-per-IP, same per-instance
gap, plus a structural issue under §3.

## 2. Input validation

**chat/route.ts L101-114** — solid: role/type checks, 600-char cap per
message, ≤16 messages, last message must be `role: "user"`. This is
fine as written.

**contact/route.ts L10-15** — `email` is required and regex-checked;
fine. But `name`, `business`, `message`, `summary` have **no length
cap** before being interpolated into the email HTML (only `build`/
`buildUrl` are `.slice()`d, L37). Not an XSS risk (`esc()` at L23-24
escapes correctly) but an unbounded-size / spam-quality gap the other
three routes don't have.

**site-check/route.ts SSRF (L32-77, L79-123)** — this is the strongest
file of the four and largely **this is fine**: `privateIp()` (L33-55)
covers 0.0.0.0, 10/8, 127/8, 100.64/10 (CGNAT), **169.254/16 (covers
169.254.169.254, the cloud metadata address)**, 172.16/12, 192.168/16,
plus IPv6 loopback/ULA/link-local and v4-mapped addresses. `.local`,
`.internal`, `.home.arpa`, `.localhost` hostnames are blocked (L59-65).
Redirects are followed manually, capped at 4 hops (L82), with the
public-host check re-run on **every** hop (L86) — a redirect to an
internal address is caught, not just the first request. Timeout is
9s (L90) via `AbortSignal.timeout`, which aborts on wall-clock even
against a slow-drip response. Response body is capped at 1.5MB by
byte-counting the stream, not trusting `Content-Length` (L106-119).

The one real gap: **DNS-rebinding TOCTOU.** `assertPublicHost()`
resolves and validates the hostname (L69), but the actual `fetch()`
call (L88) re-resolves DNS itself when it connects — a fast-flipping
DNS answer between the check and the connect could still land on a
private address. This is a known, narrow bypass class; fixing it
needs pinning the validated IP and connecting to it directly (custom
`dispatcher`/`lookup`, sending the original `Host` header) rather than
re-resolving the hostname at fetch time. Given everything else this
route already does right, this is a worthwhile hardening, not an
emergency.

## 3. Prompt injection

**This does not apply the way the brief assumes, and that's worth
saying plainly.**

`site-check/route.ts` has **no LLM call anywhere in the file** —
confirmed end to end (558 lines). Every "finding" is produced by
regex/string matching against the fetched HTML (title, meta, viewport,
`tel:`, forms, `og:image`, JSON-LD, tracking tags, robots.txt). There
is no prompt for fetched content to poison. This is fine — genuinely
the safest possible design for reading untrusted third-party content.

`chat/route.ts`'s knowledge base (`knowledge()`, L25-59) is compiled
**only** from `lib/services.ts` — first-party, developer-controlled
content, never from a visitor-supplied URL or any external fetch. So
the classic "poisoned webpage instructs the LLM" vector isn't present
in these four files either. The residual risk is narrower: a visitor
crafting their *own* chat message to coax the model into an off-brand
promise (a specific ROI, a discount, a claim rule 2 forbids). The
system prompt has real mitigations (L64-70: cite only-these-facts,
never invent prices/results, ignore in-message rule changes) but there
is no output-side guardrail — nothing checks the `reply` text (L140-146)
before it's returned. Given this is the owner's own site talking to
his prospects, a cheap regex check on outbound replies (e.g., flag any
`$` figure not present in `knowledge()`) would catch the highest-value
failure mode without much engineering.

## 4. Secret handling

**This is fine across all four routes.** `ANTHROPIC_API_KEY` (chat
L78, L120), `RESEND_API_KEY` (transcript L27/L70, contact L17/L19),
and `CONTACT_EMAIL` (transcript L26, contact L18) are read server-side
only, sent only in server-to-server calls or as an email `to` address,
and never appear in a response body. No `NEXT_PUBLIC_` prefix is used
on any of them (grepped the whole `app/`/`lib/` tree — zero hits). No
route logs a key or a raw request body anywhere.

## 5. Error paths

**None of the four files call `console.error` (or any logger)
anywhere** — every failure, from a malformed body to an Anthropic 5xx
to a rejected Resend send, is swallowed into a generic client-facing
message with zero server-side record. That's an operational blind
spot behind every other finding here: there is currently no way to
notice abuse, upstream outages, or lost leads except a customer
complaining.

Per-route leak check (all four: **fine, nothing leaks**):
- `chat/route.ts` L147-155: catch returns a canned string, never the
  upstream status or body.
- `chat/transcript/route.ts` L77-79: catch returns `{ok:false}`, 502.
- `site-check/route.ts` L543-556: catch distinguishes only "private/
  scheme" (SSRF block) from a generic unreachable message — never
  `e.message`, no internals.
- `contact/route.ts` L43-45: catch returns `{error:"Send failed"}`,
  500 — **but the catch doesn't bind the error at all** (`catch { ... }`,
  no `(e)`), so even a local log statement couldn't be added without
  first naming the variable. Combined with §1's missing rate limit,
  this is the file's biggest problem: **a Resend failure — bad key,
  bounced domain, quota hit — is invisible. The lead is gone and
  nobody knows.** This is exactly the "lost lead" scenario the brief
  calls the worst outcome on the site.

## 6. Runtime

**This is fine — no carry-forward problem.** `chat/route.ts` (L11),
`chat/transcript/route.ts` (L11), and `site-check/route.ts` (L12) all
explicitly declare `export const runtime = "nodejs"`. `contact/route.ts`
declares no `runtime` export at all, which is also fine functionally —
Next.js Route Handlers default to the Node.js runtime already — but
it's the one file that doesn't match the other three's explicit style;
adding the line costs nothing and removes the inconsistency. No route
declares `edge`.

## 7. Verdict per route

**app/api/contact/route.ts — CARRY WITH NAMED FIXES**, smallest first,
none of which touch the happy path:
1. Bind the error in the catch (`catch (e) { console.error("contact send failed", e); ... }`) — one line, zero behavior change, ends the silent-loss problem in §5.
2. Add the same in-memory per-IP limiter pattern already proven in the other three routes (copy the `hits`/`limited()` shape, e.g. 5-8/min) — stops the unlimited-inbox-flood in §1 without adding friction (no captcha, no extra field).
3. Add length caps on `name`/`business`/`message`/`summary` mirroring the other routes' `.length <= N` checks.
4. Add `export const runtime = "nodejs"` for consistency (cosmetic).
Do not add a captcha or an extra required field here — the brief is
explicit that this path must not be put at risk, and none of the above
changes the shape of a legitimate submission.

**app/api/chat/route.ts — CARRY WITH NAMED FIXES**, smallest first:
1. Add `cache_control: {type:"ephemeral"}` on the `system` block (L130) — the knowledge base changes only when `lib/services.ts` changes, so this is a pure win, cuts steady-state input cost roughly 90% on repeat traffic, no behavior change.
2. Log on the upstream-failure and rate-limit-hit paths (one `console.error` each) — visibility with no functional change.
3. Move the rate limiter to shared storage (Vercel KV / Upstash) so the 10/min cap is a real ceiling instead of a per-instance one — this is the fix that actually bounds spend under concurrency.
4. Consider a hard daily/monthly spend circuit-breaker (a KV counter that short-circuits the Anthropic call past a $ threshold) given this route spends real money per anonymous request by design.

**app/api/chat/transcript/route.ts — CARRY WITH NAMED FIXES**:
1. Same shared-storage rate limiting as chat (smallest, proven pattern).
2. Add logging on the Resend-failure path.
3. Structural: tie a transcript POST to a real chat session server-side (e.g., a short-lived signed id minted by `/api/chat` on first message, required here) so the endpoint can't be hit directly with a fabricated conversation — this is the fix that actually closes the gap in §1/§5, the others just soften it.

**app/api/site-check/route.ts — CARRY WITH NAMED FIXES**. This is the
best-built of the four — keep its SSRF/timeout/size-cap design intact,
don't rewrite it:
1. Shared-storage rate limiting (same pattern as chat).
2. Log blocked-SSRF attempts (`msg === "private"`) — repeated probing is itself a signal worth seeing.
3. Close the DNS-rebinding TOCTOU gap: resolve once in `assertPublicHost`, reuse that pinned IP for the actual connect (custom dispatcher/lookup + original `Host` header) instead of letting `fetch()` re-resolve.

None of the four need a REWRITE — the validation, SSRF guarding, and
secret handling are all sound; the gaps are additive (limiting,
logging, one session check, one caching line).

## Ranked by cost if ignored (worst first)

1. **contact/route.ts, no rate limit + unbound catch (L43-45, no limiter present)** — a stranger can flood Jake's own inbox and, by sharing Resend quota with the transcript route, can cause the one required path to fail with zero record of it happening. *Fix: bind+log the catch error, add the existing limiter pattern.*
2. **chat/route.ts, uncapped spend under concurrency (L13-22 per-instance limiter; L124-134 uncached ~3k-token system prompt every call)** — realistic to run up tens-to-hundreds of dollars/hour from one visitor with a simple concurrent loop. *Fix: cache_control on system + move limiter to shared storage.*
3. **chat/transcript/route.ts, no session provenance (L45-56)** — arbitrary POSTs can fabricate "transcripts" straight into Jake's inbox, compounding finding #1's quota risk. *Fix: require a session id minted by /api/chat.*
4. **site-check/route.ts, DNS-rebinding TOCTOU (L57-77 vs. L88)** — narrow, but the one real residual SSRF path in an otherwise strong design. *Fix: pin the resolved IP for the actual fetch.*
5. **All four routes, zero server-side logging** — every issue above is currently undetectable in production; this is what turns a fixable bug into a permanent blind spot. *Fix: one `console.error` per catch block.*
6. **contact/route.ts, unbounded field lengths (L10-15)** — spam/cost nuisance, not a security hole (escaped correctly). *Fix: length-cap like the other routes.*
7. **contact/route.ts, missing explicit runtime export** — cosmetic only, Node.js is already the default. *Fix: add the line for consistency.*
