# State — EAS /dark (redesign/dark-room)

**How to use this file:** one line per page/route below. Each line names
the step it's at, the last commit that landed, and what's awaiting whom
(Jake's review, a rebuild, a dial). Read this FIRST, before decisions.md
or checks.md — it tells you where the crew left off.

## /dark (branch `redesign/dark-room`)

§01–§06 were built BEFORE the crew existed — there is no `brief.md` or
`storyboard.md` for this page, and none should be generated after the
fact. **Do NOT run the strategist or storyboarder on /dark.** Treat the
plan as already locked; use `decisions.md` as the record of what was
decided and why, and only reach for a builder/verifier/critic step from
here forward.

- §01 hero — sticky-cover climb into §02. Shipped, Jake: "this looks
  great … it is perfect."
- §02 services rows — grow-into-the-room (`fb13710`), spotlight + lens/ride
  (`6b886f2` → `eaf00a2` → `0a2c6a4`), phone trays (`6afdeca`). Awaiting
  Jake's review — untested past the initial spotlight look.
- §03 proof cards — itsjay card port (`0050b34`), flash fix (`efc50c6`),
  cover parallax (`6331d3f` → `cf7ad97`), lerp removed (`140678b`).
  Awaiting Jake's re-check of the flash fix and the parallax.
- §04 how it runs — ruled slab (`ba6ad74`), staircase retired on Jake's
  call — awaiting his review.
- §05/§06 — rebuilt to the Off+Brand ending: §05 is a white card that
  recedes to reveal the lifted ground, §06 is CTA + footer as one room on
  it (`a5bd975`). Shipped and verified at 390/1440/2560; awaiting Jake's
  review.
- The one triggered vocabulary (heading wipes, `f01453c`) still stands.
  The §03→§04 CURTAIN LIFT + light §04 room (`aacb872` → `b58a76e`) was
  REVERTED on Jake's call 2026-09-06 ("i really dont like the site
  changes") after he saw its three frames — code back at `40aec08`: §04 on
  the void, whitespace-only seam (`7d8f466`) stands. What he rejected was a
  light room mid-page; a future dramatic seam here stays on black.

**Next step:** Jake's own top-to-bottom pass of /dark (he has seen nothing
past seam #1 in the flesh). After that: dial whatever he flags, using a
builder step per fix — each fix graduates into `checks.md` so it never
regresses silently. Do not start new sections until this pass happens.
