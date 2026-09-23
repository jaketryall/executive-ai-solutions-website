# The ground — Lando's quiet layer, run the length of the page (plan, 2026-09-22)

Jake: "i want a visually impressive animation … the lando site … im going wow the whole time. but it also doesnt take away from what they are trying to show its always moving … every time i try … i can never quite get there" → "the lando site specifically is the one i love not any of the others … lando site is perfection".

Method: the same motion census (31 stations, ambient diff + scroll-residual diff) on landonorris.com and on EAS (`?v=answer+show`), a deep pass on Lando (at-rest motion per section, every hover, seams, carried objects, phone), a gap analysis, three Lando-derived systems, and a judge. The raw results are in `decodes/lando-census-2026-09-22.json` and the frames in `frames/census/` (gitignored).

## The answer, measured

SAME AMOUNT OF SCROLL MOTION: average share of the screen that changes per scroll step 20.2% on Lando vs 19.8% on EAS (median 17.5 vs 14.5). Biggest single moment 52.9% vs 49.8%. Stops where content is moving 61.3% vs 58.1%. Still stops 16.1% on both. DIFFERENT MOTION WHEN YOU STOP SCROLLING: stops with visible motion on their own (at least 0.3% of the frame) are 16/31 on Lando vs 5/31 on EAS. All 5 of EAS's are in the first 1,800px of a 14,125px page. Longest run of stops with nothing moving on its own: Lando 6 (1800 to 4050, and that stretch is covered by his busiest scroll motion, the photo wall at 32–46%). EAS 26 (2250 to 13225, 10,975px, 78% of the page). By thirds of the page, stops with their own motion: Lando 5/4/7, EAS 5/0/0. Lando's quietest third for scroll motion (8.5% average) has the most of its own motion (7 of 10 stops). EAS's back third runs at 13.6% scroll motion with 0/10. TECH, INVERTED: Lando has 0 videos, about 21 canvases (1 Three.js backdrop plus a set of Rive icons), and 0 running CSS/WAAPI animations at every stop, yet it never stops moving. EAS has 1 video (hero only, the source of all 5 of its self-moving stops), 0 canvases, and 19–60 running CSS/WAAPI animations, yet its median self-moving reading is 0.06% (Lando 0.38%). The fixed atmos/grain/vignette layers read under 0.1% everywhere; the atmos layer moves only with the cursor (±78/±46). STRUCTURE: Lando has one horizontal section, 3,143px (23.1% of the page), no pins in the back 43%, and one ground-colour flip that runs across about 2,358px. EAS has two pinned horizontal rails, Work at about 4,500px and Runs at about 2,250px, so about 48% of the page scrolls sideways, and the second rail sits at 67–83% of the page. The ground is one flat rgb(11,11,11) end to end on this route. The `paper` token, which is Lando's measured ramp and which Jake said he liked, is off. HOVER: on Lando every CTA icon reacts (a Rive arrow flip, 150–300ms), the STORE label rolls (about 520ms), and the helmet cards wipe to an action shot (about 300ms to look done, 0.75s declared). On EAS, 'Book the call' hover measured 0.52% (no visible change), the work tile 0.05%, and the nav only flips its weight. HOW EAS WAS BUILT: 318 commits since the Lando decode (2026-09-05). The hero alone has 32 logged decisions and 109 commits since 09-13. decisions.md has 20 explicit SUPERSEDES. 8 other-site decodes are on file (apple-highlights, cosmos, cosmos-works, hugeinc, itsjay, leoparpeix, offbrand, velour), and 'THE MODEL' changed 3 times (itsjay×eloqwnt on 07-01, Huge on 09-19, now Lando). By my count of about 21 visible motion items in the current default: about 11 come from sites other than Lando, about 5 from Lando (mostly plumbing: the engine, Lenis, data-wipe, the scrawl, the pen logo), and about 5 are EAS's own. The three loudest (the hero entrance, the §02a poster, the work rail) are all leoparpeix. LANDO RESTRAINT (from the section-grammar pass): only 6.9% of 1,775 elements ever change a paint property, and 78% of those changes are transforms.

## Root cause

Your site doesn't move less than Lando's. It moves the same amount. When you scroll, about 20% of the screen changes on both sites (20.2% on his, 19.8% on yours), and your work rail's biggest moment (49.8%) is about as big as his biggest (52.9%). The difference is when things move, what moves, and whose it is. On his site something keeps moving even when you stop scrolling: the thin wavy lines behind everything drift on their own, words run past behind his photo, and a strip of logos rolls under the partners and again along the bottom of the footer. You catch that at 16 of 31 stops, spread from the top of the page to the bottom. On yours, after the first two screens, everything stops the moment your hand stops, for 26 stops in a row (78% of the page). Next, Lando's words never move once they've landed. They wipe in one time and then hold, and the movement happens behind and around them. And everything that moves is his: his face, his helmet, his signature. Even the wavy background lines are the same swirl that's printed on his helmet and his jacket. On yours, the headline itself swaps words on a timer, and the soft glow behind it could be on anyone's site. The main reason, though, is this. His site was designed once, by one studio, as one character. Yours was built one section at a time, and each section came from a different site you loved. The title rise, the big poster and the work rail came from leoparpeix. The rotating word, the paragraph beat and the tile slot came from Huge. The bento and the blur-in title came from Apple, the card recede and the corner switch from Off+Brand, and the film placement from Cosmos and Clay. Each one is good by itself, which is why you liked each one. Side by side, though, they move in different ways, so the page reads as a collection instead of one person. Another reference or more animation won't fix this. The fix is to pick EAS's own version of the helmet: one pattern and one object that belong only to you (the EA mark, the real sites and phones you ship, and you). Then run Lando's quiet always-moving layer and one way of moving text through the whole page.

## Lando's system vs his assets

Lando's SYSTEM is small and portable, and EAS already owns half of it. The half EAS has: the declarative scroll engine (data-sp is the same architecture as his data-h-color-from/to), Lenis lerp 0.1 plus per-effect damping, scrubbed structure, one-shot line wipes (data-wipe), transform/opacity discipline, and the card-recede ending, which comes from OFF+BRAND, the same studio. The half EAS lacks: (1) a full-page backdrop that moves on its own and draws the brand's own pattern (his contour lines are his helmet's swirl), at about 1–2% of the frame; (2) two moving type or logo strips placed as section-level ambient, one behind the hero's subject and one along partners and the footer, at 4–8%; (3) one ground flip across the horizontal section, over about 2,358px (EAS's `paper` is exactly this and is off); (4) one axis switch, at 23% of the page; (5) one text vocabulary plus one ticker type; (6) small hovers on every control, with the one big hover showing content; (7) a bookend footer. None of that needs his face. The ASSETS are what no motion can stand in for: his face (hero, marquee card, menu bento, most of the wall), a 3D helmet with real livery that assembles onto his head every ~3.4s, 14+ liveries photographed identically plus 12 matched studio/action pairs, dozens of dated real-life photos, his handwriting in 3 places, the McLaren laurel, and 15+ real sponsor logos. Of the census's 12 'wow' moments, by my count only 3 are pure system (the white-to-olive cut, the 3,000px colour ramp, the fanned-card layout). 5 are carried mainly by assets (the helmet HUD, the signature, the helmet grid, the gold LN1 merch, the dark-room photo passage), and 4 need both (the wall's parallax, the ON scribble, the logo marquee, the footer). So roughly half of 'wow the whole time' is Lando himself. EAS's honest equivalents: Lando's face = Jake. 'Built by the person you talk to' is EAS's own claim, yet no photo of him exists (the about beat is owed). The helmet = the deliverable: the three photographed shots in public/services (the laptop+phone duo, 'Booked · Sat 9:00', the won search) plus the reel, which is already the page's best moving moment. The helmet livery pattern = the EA mark, one filled path that could be tiled or traced into a drifting pattern. The signature = Jake's handwriting (the scrawl is owed; logopen exists). The sponsor strip = client names, but there are 3 clients and the quotes are placeholders. The dated trip photos have no equivalent. The risk right now: the only object that recurs is Desert Wings' airplane (hero film, §02 laptop, bento, rail card 1, voices avatar, with AAHG also aviation), so the page's accidental motif is a client's product, not EAS.

## Not the problem

- The amount of scroll motion. Average screen change per scroll step is 20.2% on Lando vs 19.8% on EAS. Stops with content moving: 61.3% vs 58.1%. Still stops: 16.1% on both. EAS's middle third (31.0%) is louder than any third of Lando's.
- Engineering or performance. EAS already runs Lando's architecture (the declarative data-sp engine, Lenis lerp 0.1, scrubbed structure, transform-only motion) at a measured 8–10ms per frame.
- 3D or WebGL itself. The helmet is an asset, and Jake doesn't want a 3D object (motion-decodes §8). The part that transfers, the drifting line layer, is 2D and could be canvas 2D or SVG.
- A missing reference. There are 8 other-site decodes on file plus Lando's, and 'THE MODEL' has changed 3 times since July. Every lift was right on its own. Adding a ninth source would make the collage wider.
- Dark vs light. The ground has swapped about 6 times in a week. Lando's feel comes from how and when the ground changes (once, slowly, under the loudest section), not from which colour it is.
- The hero film. Motion that is the deliverable is Lando's hero logic, and EAS's first third already outdoes Lando on motion of its own (3.6% vs 1.7% average).
- Video. Lando's homepage has 0 <video> elements. Its cinematic feel is stills, cuts and procedural drawing, so EAS doesn't need more footage to get it.
- The number of animations running. EAS runs 19–60 WAAPI/CSS animations and still reads as dead at rest. Lando runs 0 and never stops. The count says nothing; what visibly moves while you read is what matters.

## Scores

- **THE SURVEY: one ground under the whole page**: 7.4. Wow 7 · no stealing 8 · ordinary assets 9 · Jake's decisions 5 · buildable 6 · Lando 9. It goes straight at the measured gap: the page goes still when you stop scrolling, and it is built from many sources. It uses the one Lando device that runs under every section: a fixed contour field whose ink each section sets for itself (verified in the grammar §2.13: Partners declares `data-gl-change-from="white, dark-green-tint-1-low"` → `"white, white"`). The words hold. It needs no new asset. Penalties: (1) The terrain is the EA mark's distance field. On 2026-09-20 Jake removed the drifting background mark ('can we take my logo out of the background'; the hero-room.tsx comment still records it). (2) The live strip of three domains contradicts decision 105, Jake's own reasoning that a three-name marquee 'advertises how short the list is'. (3) It keeps lines drifting under §02a after he turned the orbs off there. (4) Its main pass criterion can't be met. The census diff (360×225 greyscale, threshold >12 levels, 700ms) reads Lando's own field as 0.00 on his olive (stations 1800–4050) and only 0.38–1.97% on his cream (4500–6300). A builder chasing ≥13/31 in the dark room would raise the ink until the lines compete with the words. (5) Raw WebGL2 plus an EDT is real work, though it is justified and has fallbacks.
- **THE RELAY: choreographed seams**: 7.1. Wow 7 · no stealing 9 · ordinary assets 7 · Jake's decisions 4 · buildable 9 · Lando 9. It is the most rigorously measured of the three: every seam comes from the grammar ledger, and it uses only the curve lando.css actually ships. It needs no dependency, its coverage maths is honest, and it caught a real bug: MarkSvg's hard-coded ids (dr-mark-pen, dr-mark-glyph) collide on a second mount. It loses on fit to the diagnosis. Its four loud seams add scroll motion, which EAS doesn't lack (19.8% vs 20.2%). It also hands off the field, and the field is the part that makes the page one room. Conflicts: it retires the settled hero title rise ('this looks good'); it runs paper to the page end and retires the close's return to dark; it cuts rail travel 420→260 and adds a pre-roll, which changes the approved arrival; it sets strips at 36px/s against Jake's 'moving too fast' ruling (21px/s, room.css .dr-logos-track); and it uses EA-mark separators against 'no dots between the items (Jake): the space is the separator'.
- **THE SCREEN: EAS's helmet**: 5.4. Wow 5 · no stealing 5 · ordinary assets 7 · Jake's decisions 4 · buildable 7 · Lando 6. The instinct is right: Lando restages one object everywhere. Its STILL → IN USE hover is the best hover proposed, a faithful take on his helmet card that shows the real work only when asked. It admits it does nothing for the 26 stops in a row where nothing moves, and that is the measured gap. BECOME moves the service photographs, which decision 10 removed ('the animation on the images… drags my eyes to it'). The close replays the film next to the call-to-action copy, a moving image beside words. 'The Screen is the helmet' is an analogy, not a measurement. It makes the Desert Wings airplane motif louder, and it needs a 4k re-export before step 1 can pass.

## The system (judge's synthesis)

THE GROUND: Lando's quiet layer, run the length of EAS's page.

THE RULE. Motion belongs to the ground, the strips and the thing under your hand, never to the words. Structure stays a function of scroll on the existing engine, unchanged. Life is a function of time. Words land once and hold.

WHAT THE CENSUS SAYS THE LAYER HAS TO BE (a judge's reading of design-dna/frames/census/lando/results.json). Lando has 16 stops that move at rest:
- About 8 are strips and tickers: the message ticker at 450/900/1350 reads 4.30/8.13/4.29%; the Partners marquee at 11250 reads 4.73%; the footer strip at 12600–13500 reads 0.89–1.30%.
- About 6 are the contour field, and only on cream: 0.38–1.97% at 4500–6300. On olive the census reads 0.00 at 1800–4050.
- 1 is the helmet.

So the system needs three parts: the field for the single ground, the strips for most of the at-rest count, and the light ground so the field can be seen.

1. THE GROUND (the Survey, corrected)
- One fixed canvas draws contour lines that drift on time and travel at 1:10 of scroll.
- Each section declares the lines' ink and drift, as Lando's sections declare his GL colours (data-gl-change-from/to).
- Line cores are one tint off the ground: +10…+17 levels on the void, −15…−31 in the day room.
- The default height source is hills only, which is Lando's own form. That avoids reversing 'take my logo out of the background'. The EA mark's distance field is a separate token that only Jake can promote.
- §02a declares drift 0 and low ink. The lines are still there but stop moving under the poster. That honours his orbs-off call, and Lando's own statement stop reads 0.00 on his census.

2. THE STRIPS (the Relay's runner, the Survey's placement, Jake's content and speed)
- One runner: four clones with a JS-written translate. Direction latches to the last scroll direction, with a ±10% scroll offset crossing zero at viewport centre (grammar §2.13).
- Speed is 21px/s and the space is the separator, both Jake's standing calls.
- Band 1: the six audiences, in two rows under the film. This is Lando's message ticker, and it takes the rotating word's motion out of the poster.
- Band 2: the services TICKER from lib/proof.ts, Jake's own decision 105 swap. It is Lando's Partners strip in the tiles' slot, and it returns along the close's bottom edge as his footer strip. There is never a three-name client marquee.
- Strips always sit in their own bands, never behind words.

3. ONE GROUND CHANGE. `paper` across the rail, which Jake liked. The field's line colour follows --flip, and the light ground is where the field actually registers, as it does on Lando's cream.

4. HOVER
- Small hovers everywhere: 'Book the call' rolls its label like Lando's STORE (about 520ms), and every → flips through its edge-on sliver like his btn-ui arrow (150–300ms).
- ONE big hover, grafted from the Screen: STILL → IN USE on the show wells and rail tiles. The real screen rises from the bottom edge through a transform slit (not a clip-path inside a translating card, per decision 14). It is armed only after decode(), only on pointer:fine, and on the rail only while the rail is at rest.
- The curve is (.19,1,.22,1) at .6s, the only one lando.css ships, until the deep-pass token (.65,.05,0,1) is re-read on the live site.

LAWS
- Words land once. data-wipe fires at top 90%, and nothing inside a sentence runs on a timer.
- Rail captions cut, never crossfade.
- The hero's settled rise is the one flagged exception. Every other vocabulary change is its own token and Jake's call.
- One pin: runs leaves the homepage, as decided on 2026-09-20.
- The bookend, grafted from the Relay: the close's mark writes itself once, scrubbed on Lando's measured signature curve, with the services strip still running underneath. It needs MarkSvg per-instance ids first.

DROPPED
- The Survey's terrain collapsing into the mark: it is derived, not measured, and it puts the mark back in the background.
- The Relay's loud seams (plate, flap, curtain): they add scroll motion, which EAS already has at Lando's level.
- The Screen's BECOME: it moves the evidence photographs.
- The Survey's three-domain strip: decision 105.

EXPECTED COVERAGE after steps 1–9, on the census method:
- Film: y 0–450.
- Audience band: about 3 stops.
- Field on paper across the rail, voices and objections: about 5–7.
- Services strip at the tiles and the close: about 3–4.
- Total about 14–16 of 31, with at least 4 in every third and the longest run with nothing moving at rest down from 26 to 6 or fewer. Lando: 16/31, split 5/4/7, longest run 6.

## Grafts

- From THE RELAY: the one strip runner, components/dark/strip.tsx (4 clones, JS-written translate, direction latched to the last scroll, stopped when off screen or hidden). It runs at Jake's 21px/s with the space as separator (room.css .dr-logos-track), not the Relay's 36px/s with EA-mark separators.
- From THE RELAY: the bookend. The close's mark writes itself once, and the MarkSvg per-instance id fix (useId) comes first. This replaces the Survey's terrain-collapses-into-the-mark zoom, which is derived, not measured, and puts the mark back in the background.
- From THE RELAY: use only the curve lando.css ships, cubic-bezier(.19,1,.22,1) at .6s, for every hover until the deep pass's (.65,.05,0,1) token is re-read on the live site.
- From THE RELAY: count coverage honestly by source. Checked against the census: about half of Lando's 16 stops moving at rest are strips and tickers, about 6 are the field on cream, and his field reads 0.00 on olive. So the strips and paper are essential, not polish.
- From THE SCREEN: STILL → IN USE as the page's one big hover, on the show wells and rail tiles (dw-tour, dw-mobile-booking, dw-mobile-hero, the case tours). It rises from the bottom edge through a transform slit, the outline lights at the same moment, and it is ~90% done by 300ms.
- From THE SCREEN: hover arms only after img.decode(), only on pointer:fine, and on the rail only while the rail is at rest. Never a clip-path inside a translating card (decision 14).
- From THE SURVEY, kept as the spine: sections declare the field's ink and drift through one resolver writing in document order (Lando's data-gl-change-from/to); the canvas boots when idle; DPR is capped at 1.25; it draws at 30fps at rest and stops when hidden; under reduced motion it is one static frame; the cursor is light on the lines, never a sliding sheet (a later token).
- Judge's correction: the strips carry Jake's own content, the six audiences and lib/proof.ts TICKER (decision 105). Never a marquee of the three client names or domains.
- Judge's correction: §02a declares drift 0 and low ink, rather than the Survey's .45/.5. Jake turned the ambience off for the second section, and Lando's own statement stop reads 0.00 on the census.
- Judge's correction: the field's pass criteria are calibrated against landonorris.com with the same full-res diff. The census method can't see tint-level lines on a dark ground; it doesn't even see Lando's.

## Build order (each a `?v=` token, one at a time, measured against Lando with the same script)

1. **1 · ?v=survey**: THE GROUND, hills only. A fixed WebGL2 canvas draws drifting contour lines: tint-level, 1:10 scroll travel, per-section declared ink and drift, §02a at drift 0. No cursor, no lamps, no paper, no strips. The .dr-atmos parallax is left untouched, so this is the only change.  
   _Why:_ This is the measured gap: 26 stops in a row where nothing moves on its own, and a page that reads as a collection. Lando's fixed contour field with section-declared ink (grammar §2.13) is the one device under every section. It unifies the borrowed sections without rebuilding any of them. Hills-only respects the 09-20 'logo out of the background' ruling.
2. **2 · ?v=aud**: THE AUDIENCE TICKER. Two rows of the six OFFER_ROT_WORDS run in opposite directions in the band between the film's bottom edge and §02a: 21px/s, direction latched to scroll, a ±10% scroll offset crossing 0 at viewport centre, ink-3 on the void, aria-hidden. Build the shared runner components/dark/strip.tsx here: 4 clones, one JS-written translate, stopped when off-screen or when the tab is hidden, standing at X=0 under reduced motion.  
   _Why:_ Lando's message ticker is the largest at-rest reading after his hero (4.30/8.13/4.29% at y 450/900/1350). The runner is reused twice later. The rotating word's six values get a place to move that isn't inside the sentence.
3. **3 · ?v=hold**: The §02a audience word stops cycling. It states the persona's audience (lib/persona.ts), or 'owner-run businesses.' by default, and holds.  
   _Why:_ Lando's statement lands and holds (census 1800: 0.00% at rest, 1.27% on scroll). This ends the frame where 'flight schools.' sits over 'owner-run businesses.' It conflicts with the rotating-word decisions, so it is its own token and Jake's call.
4. **4 · ?v=roll**: Small hovers everywhere. 'Book the call' rolls its label: two stacked copies, translateY 0→−100%, settled by ~520ms. Every → (the doors, Live ↗, the rail arrows) flips: rotateY 0→90°, swap glyph, −90→0, 220ms. Both use cubic-bezier(.19,1,.22,1). Hover-capable pointers only. No text hovers.  
   _Why:_ This is Lando's STORE roll and his btn-ui arrow on every CTA. EAS's 'Book the call' hover measured 0.52%, a change you can't see. It is Jake's standing love, and it's cheap.
5. **5 · ?v=inuse**: THE ONE BIG HOVER on the show wells and rail tiles. The still photo gives way to the real screen: Websites → /work/dw-tour.jpg, Automation → /work/live/dw-mobile-booking.jpg, Ads → /work/live/dw-mobile-hero.jpg, and each rail case → its tour. It rises from the bottom edge through a transform slit (outer translateY(101%)→0, inner −101%→0), ~90% done by 300ms, and the outline lights on the same timing. pointer:fine only, armed after img.decode(), and on the rail only while the rail is at rest.  
   _Why:_ This is Lando's helmet-card hover (studio shot → in use), grafted from the Screen. Evidence stays still unless someone asks (decision 10), and the transform slit avoids decision 14's flicker.
6. **6 · ?v=cut**: Rail captions: the outgoing info line clips out, then the incoming one wipes in (inset(0 100% 0 0)→0, 0.6s power2.out). Two names are never on screen together.  
   _Why:_ This fixes the census frame at y=5400 ('AAHG Nonprofit' over 'Desert Wings Aviation') and brings the rail into the page's one text vocabulary.
7. **7 · ?v=paper as default, plus the field following --flip**: Paper becomes the default ground across the rail (Jake's call). The field's line colour and alpha cross with --flip (white α .055 → black α .09), read from the engine's store and never from getComputedStyle per frame.  
   _Why:_ This is Lando's one ground flip under his one axis switch. It is also measured: his field only registers on cream (0.38–1.97% at 4500–6300) and reads 0.00 on olive. It conflicts with THE PAGE IS DARK, so Jake decides.
8. **8 · ?v=svc**: THE SERVICES STRIP, lib/proof.ts TICKER on the same runner: full-bleed under the tiles, and again along the close's bottom edge above the util row. Its own band, 21px/s, the space as separator.  
   _Why:_ This is Lando's Partners strip (4.73%) and footer strip (0.89–1.30%): back-third life, where Lando has 7/10 stops moving and EAS 0/10. The content is Jake's own decision 105, not a three-name client loop.
9. **9 · ?v=sign**: First give MarkSvg per-instance ids (useId) for its clipPath and masks. Then the close's lockup mark writes itself once, scrubbed on Lando's signature curve (0% until p .2, 45% at .4, 88% at .6, 97% at .8, 100% at 1), with p running from .95vh to .5vh. It then holds, and hover rewrites it (logopen). Under reduced motion it is already written.  
   _Why:_ This is Lando's bookend (law 12: his signature draws once more in the footer). Without the id fix, a second mount would follow the nav's mask.
10. **10 · runs off the homepage**: Carry out the 2026-09-20 call: remove the runs rail from the homepage. The voices' converting card needs a new landing, or it ends.  
   _Why:_ Lando switches axis once and has 0 pins in his back 43%. This removes the second sideways pin at 67–83% of the page.
11. **11 · ?v=mark (offered, never defaulted)**: The field's height takes the EA mark's distance field: a 512² fill of D from mark-svg.tsx plus a 2-pass EDT, laid 2.6 screens wide, plus the hills.  
   _Why:_ It gives EAS its own pattern, the way Lando's lines are his helmet's swirl. It is an explicit CONFLICT with 'can we take my logo out of the background' (2026-09-20), so it exists only as a choice for Jake.
12. **12 · ?v=lamp**: The cursor becomes light on the lines: radius 200px, +α .10 (half that in the day room), chased .08, ×1.5 over clickables. It replaces .dr-atmos's ±78/±46 parallax under the token.  
   _Why:_ This is Lando's backgroundScene cursor (CURSOR_INTENSITY .15). Light moves and the sheet never does, which answers Jake's 09-22 complaint ('i see the whole background move').
13. **13 · ?v=w2b, ?v=wvoice**: §02b's scrubbed sweep → data-wipe, and the voices title's focus-pull → data-wipe. Each is its own token.  
   _Why:_ One text vocabulary, as Lando has. Each reverses a vocabulary Jake approved (decision 38 and the §02b sweep), so each is his call, one at a time.

## Step 1 spec

STEP 1: `?v=survey`, THE GROUND (hills only). Not added to DEFAULT in app/page.tsx. Builder: one Sonnet agent, one Haiku verifier.

FILES (root /Users/jakeryall/Documents/cursor_projects/Executive AI Solutions Website)
- NEW components/dark/survey.tsx, a client component.
- components/dark/hero-room.tsx: mount `{has("survey") && <Survey />}` between the `.dr-atmos` div and `.dr-grain` (about lines 760–768). Nothing else there changes. The .dr-atmos quickTo parallax stays: one change at a time.
- NEW components/anim/field-store.ts, modelled on lenis-store.ts. It exports `field = { ink, drift }`.
- components/dark/scroll-engine.ts: the resolver, inside the engine's existing frame. It is the only writer of `field`.
- app/room.css:
  `.dr-survey{position:fixed;inset:0;z-index:1;pointer-events:none}`
  `.dr-survey canvas{display:block;width:100%;height:100%}`
  Grain (z1, later in the DOM) and the vignette (z2) sit over it.
- No new dependency.

ELEMENT: `<div className="dr-survey" aria-hidden><canvas/></div>`

BOOT
- requestIdleCallback with timeout 1200, falling back to setTimeout 450ms after mount.
- Context: WebGL2 {alpha:true, premultipliedAlpha:true, antialias:false, depth:false, stencil:false, powerPreference:'low-power'}. Fall back to WebGL1 with OES_standard_derivatives. If neither exists, render nothing.
- webglcontextlost: hide the canvas and stop the rAF. On restore, rebuild.
- DPR = min(devicePixelRatio, 1.25), Lando's cap. Buffer = CSS size × DPR, resized by a ResizeObserver on the wrapper, never per frame.

SHADER: one full-screen triangle.
- Uniforms: uRes (CSS px), uDpr, uScroll (px), uTime (s, integrated), uInk, uDay.
- P = top-left CSS px + vec2(0, 0.1·uScroll). That is 1:10 travel, Lando's hero ratio (decodes §10).
- h = K·fbm(P/620 + uTime·vec2(0.021, −0.013)). fbm: 4 octaves, gain .5, lacunarity 2. K starts at 6.0.
- line = 1 − clamp(abs(fract(h+.5)−.5)/fwidth(h) − .5, 0, 1). That gives a 1 CSS px antialiased line.
- Output, premultiplied: dark room = white at α .055·uInk·line; day room = black at α .09·uInk·line.

CALIBRATE BEFORE GRADING, against design-dna/frames/census/lando-deep ambient frames:
- Tune K and 620 until the median line spacing is within ±25% of Lando's.
- Tune the alphas until line cores (the max across 20 cross-sections, full-res, DPR 1) read 21–28 on the void (11) and 200–216 on the day ground (231).
- Tune the velocity until the median line displacement is 2–4 CSS px/s.

DRIVER: survey.tsx's own rAF.
- scroll = Lenis animatedScroll via onLenis(), else window.scrollY on touch.
- uTime += clamp(dt, 0, .05) × field.drift. A section slows the clock and never jumps it.
- Draw every frame while scroll or field is changing, otherwise every second frame (30fps).
- No draws when ink < .005 and settled. Pause on document.hidden and reset dt on resume.
- uDay is read at mount and on the root/html class change (dr-day / eas-day, via MutationObserver), never per frame.

RESOLVER
- Cache every [data-field-ink] element in document order, with untransformed tops from the offsetTop chain (decision 68). Recompute on resize.
- Each frame: start from the hero value. For each section, t = clamp((vh − top)/(0.5·vh), 0, 1) and e = 2t − t², then ink = mix(ink, its ink, e), and the same for drift. No chase.
- Declared values (ink / drift):
  - hero .8 / 1
  - §02a .35 / 0 (Jake's orbs-off; Lando's statement stop reads 0.00)
  - show .6 / .3
  - §02b .8 / .7
  - tiles .8 / .8
  - work 1 / .25
  - voices 1 / .8
  - runs 1 / 1
  - objections 1 / 1
  - close 1 / .8
- Attributes go on the roots in services-section.tsx (2a and 2b), offer-show.tsx, voices-tiles.tsx, work-section.tsx, voices-section.tsx, runs-section.tsx, objections-section.tsx and close-section.tsx.

REDUCED MOTION: no loop. Draw one frame at uTime 0 with no travel. Redraw only on resize, a room switch, or a resolved ink change of more than .05.

NOT IN THIS STEP: cursor, lamps, paper/--flip, strips, the mark, a baked-SVG fallback. Test without `paper`.

DONE: 1440×900, mouse parked, both rooms; then 390×844 and 2560×1440.
1. Calibrated diff. Full-res greyscale, |Δ|≥4, frames 700ms apart. Run it on landonorris.com at y=2250 (olive) and y=5400 (cream), and on EAS at y=2250, 5850 and 11250. EAS must read within 0.7–1.3× Lando on the matching ground, with a full-frame bbox, and the heatmap must trace lines only.
2. Census method (.census-offbrand.mjs diffPct: 360×225, >12 levels, 700ms). Day room: ≥10/31 stops at ≥0.3%, ≥3 in every third, no stop over 3% from the field alone. Dark room: report the number and don't tune for it. Lando's own field reads 0.00 on olive.
3. y≈1800: 0.00% at rest. A 30-frame capture across each section boundary shows no step beyond the drift.
4. The core bands from the calibration hold.
5. Chrome trace (10s scrolling top to bottom plus 5s at rest) against the same trace without the token: mean frame time up ≤0.8ms, p90 ≤12ms, 0 long tasks from survey, GPU ≤1.5ms/frame at 2560×1440. At rest 30 draws/s; hidden 0.
6. LCP within ±50ms of baseline, and the canvas is never the LCP element.
7. Reduced motion: two frames 2s apart read 0.00%.
8. --disable-webgl: no canvas, no console errors, pixel-identical to the same URL without the token.
9. 390×844: the layer shows, there is no horizontal overflow, and it holds ≥30fps at rest under 4× CPU throttle.
10. For Jake: hero at rest, §02b and voices, in both rooms, JPEG q≤70. Grade one question first: 'quiet lines drifting' or 'a pattern sliding'?

## For Jake

Jake, here's why every version has come up short of Lando's. It isn't how much moves. When you scroll, about a fifth of the screen changes on both sites. The difference is what happens when you stop. His page keeps going: faint lines drift behind everything, a line of words runs under his photo, and a strip rolls under his partners and along the bottom of his footer. On his site, 16 of 31 stops are still moving when you stop scrolling. On yours it's 5, all in the first two screens, then 26 stops in a row where nothing moves. His words never move once they land; the movement is around them. Yours swaps a word on a timer.

The bigger reason is that his site was designed once, as one thing. Yours was built a section at a time, each from a different site you liked. Each piece works on its own. Side by side they read as a collection.

So no more reference sites. We build Lando's quiet layer, one piece at a time, each on its own ?v= link, and measure it against his site with the same script. First come the faint drifting lines behind the whole page. They aren't your logo, because you asked for that out; a version drawn from your mark is there only if you want it. Then a slow line of your audiences under the film, words that land once and stay put, and every button reacting a little. After that: your real site appearing when you hover the work, paper across the work (his lines mostly show on his light section), and your services running along the bottom of the close.
