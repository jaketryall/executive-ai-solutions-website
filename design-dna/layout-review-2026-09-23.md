# Layout review — 2026-09-23

Jake: "do you think theres stuff we could make better like make a different layout and such". Three independent reviewers looked at the whole page (`?v=answer+survey+aud+hold+roll+inuse+one+hcard`, frames every 600px) through different lenses: Lando fidelity and one system, one-thing-at-a-time attention, and the buyer's story. A fourth merged them. Raw output: `decodes/layout-review-2026-09-23.json`.

## Headline

Keep the top half (hero, ticker, held poster, services one at a time) and the new card rail as the page's only sideways room. Cut the two repeats: the quote tiles and the runs rail. Move the "Built by the person you talk to" promise below the proof, with one price door. About 3,300px comes off and the stretch Jake dislikes goes away.

## All three agree

- The hero (title + film), the held §02a poster, the services one at a time and the new hcard rail all work. The rail stays pinned, sideways and one card per case, which is exactly Jake's ask ('our horizontal scroll for works just with the card').
- The testimonial tiles (§02c) repeat the voices' three quotes word for word, 3,500px apart. They are also the one frame that shows three things at once (y 5000–5450). All three reviewers cut them (`noc`, already built).
- The runs rail is a second pinned sideways scroll at 71–91% of the page. It makes the work rail no longer the special one, gives the page two axis switches (Lando has one) and puts a pin in the back of the page. All three take it off the homepage. That carries out Jake's own 2026-09-19 call ('the process … leave the homepage'), logged as decided but never done.
- The statement → proof stretch (§02b + four doors + tiles, y 4700–6100) is where one-focal-per-screen breaks. It is three still seams in a row, and the four doors repeat the nav pill while the nav is on screen.
- Desert Wings is over-shown before the proof: the film, all three service photos, then rail card 1 opens on the same 'WHERE PILOTS ARE BORN' screen as service card 1. The proof reads as a replay.
- The voices should be one quote at a time after the rail. Today two quotes share the screen at y 9500 and 9900, and all three quotes are placeholders that are blocked from shipping.
- The page is too long and too pinned: 15.9 screens, 64–67% under a pin or sticky, against Lando's 32%. Cutting the tiles and runs alone takes ~3,300px off.
- The ending is weak. Nothing moves at rest in the back third (≤0.13% at every census stop after y 1800), and the close carries a second form competing with 'Book the call'.

## Ranked changes

1. **`noc`** (S (built 09-21, add to the link)): Cut the testimonial tiles (§02c). The voices become the page's only testimony.  
   _Why:_ Removes the verbatim duplicate and the only three-focal frame on the page. It also takes the first of three still seams out of the stretch Jake dislikes. All three reviewers rank it high.
2. **`noruns`** (S (hero-room.tsx: render RunsSection only when !has('noruns'))): Take the runs rail off the homepage. The hcard work rail becomes the ONE pinned sideways room. The four steps move to /services as one still row.  
   _Why:_ One axis switch, given the biggest budget (Lando laws 6 and 10). Measured effect: the page goes 14,311 → ~11,000px, the sideways share goes 39% → ~24% (Lando 23.1%), sticky elements go 5 → 4, and nothing is pinned after the rail. It also removes the three-cards-at-once frame (y 10600), the dead frame (y 10250) and the phone text-on-text collision (runs head over a voices quote). This carries out Jake's 09-19 call; the 09-08 voices→runs lead-card hand-off retires with it, so the voices end on their own.
3. **`after`** (S (`apart` already moves it after the rail; move one slot further, doors = [price])): Move the promise after the proof. §02b ('Built by the person you talk to. A fixed quote in two days…') moves below the voices, in `answer`'s centred grammar, and its four doors become ONE: 'See your price →'.  
   _Why:_ The last service card then hands straight to the Proof head (measured under noc+apart: the rail starts at 5428 instead of 6261), so statement → services → proof runs unbroken and the three whitespace seams in a row drop to zero. The deal lands where a buyer has just seen proof and quotes and is deciding whether to call. The price door keeps the home `nopill` gave it (09-21), and the three doors that repeat the nav go. This merges R1's `apart`, R2's 'no doors' and R3's 'who after the voices'. When Jake's photo exists, a `who` follow-up adds it and his name beside the sentence.
4. **`dwlast`** (S (case order in WorkSection's hcard branch; pills ride their cards)): Reorder the rail so Desert Wings comes last: AAHG → Riled Up → Desert Wings. When an ad names an audience (?i=), that persona's case leads, using the same loose match `hold` already uses.  
   _Why:_ The proof opens on a new face instead of the screenshot service card 1 showed 3,600px earlier. The rail ends on the payoff (the client you just watched book Saturday), and a coach from a pickleball ad sees Riled Up first. There is precedent: the `paper` commit already had Desert Wings arriving last.
5. **`price`** (S (offer-show.tsx under `one`), Jake’s call): Put each service's price on its pill, from lib/services.ts heroPrice: Websites · From $2.5k · fixed quote in 2 days / Automation · Quoted per project · no retainer / Ads · $500/mo + your ad spend · no lock-in. On the phone the pill keeps the word and the price.  
   _Why:_ Today no price appears anywhere on the page. Cost is the buyer's first question (FAQ #1 and the Ask chat's first suggestion), and the only answers sit behind a small text link or an accordion at 93% of the page. This answers it one card at a time with copy that already exists, and it gives the services a job nothing else on the page does. It also covers two of the four objections (retainer, lock-in) early.
6. **`vone`** (M (voices-section.tsx: swap the bordered card for the rail's pill; spacing one per screen), Jake’s call): Voices one at a time. Keep the head 'They didn't want a website. They wanted the phone to ring.', then one quote per screen in normal flow (no pin), each attributed in the rail's pill (role · case · See the case →) and in the rail's order. Until real named quotes exist: the head plus one quote.  
   _Why:_ Ends the two-quotes-per-screen frames at y 9500 and 9900. It makes the pill the one object carried from services to work to voices, which cuts the card kinds from 6 to 3. It ties each voice back to a card the visitor just saw, and it keeps the back of the page free of pins.
7. **`svc`** (S (mount the runner in its own band inside .dr-close)): The close gets the services strip (lib/proof.ts TICKER on the existing ticker runner) along its bottom edge above the wordmark. The close keeps its statement and inline 'Book the call'. 'Run the check' becomes its one quiet second door, directly under the statement.  
   _Why:_ The film has a strip running under it, and the close would too: a bookend that rhymes (Lando law 12). It is also the first thing moving at rest in the back third, where every stop reads ≤0.13% today (Lando's footer strip reads 0.89–1.30%). This is ground-plan step 8, the next step of the plan Jake has been approving one at a time.

## Proposed order

- 1 · Hero: 'We build the site. You get on with the business.' and the film, the one self-moving picture.
- 2 · The audience ticker: six audiences in two opposite rows under the film, where Jake approved it.
- 3 · §02a, held one screen: 'Websites / Automation / Ads for [the persona's word or owner-run businesses].' The words land once and hold.
- 4 · Services one at a time on the sticky stack: the three deliverable photos, still, each pill carrying its word and its price.
- 5 · Proof head: the 'Proof' scrawl and 'The sites we built.' on a clean screen, straight after the last service card (no tiles, no doors).
- 6 · The work: THE one pinned horizontal rail, one 16:10 card per case with the Year / Niche / Built pill, AAHG → Riled Up → Desert Wings (the persona's case first when ?i= is set).
- 7 · Voices: 'They didn't want a website. They wanted the phone to ring.', then one quote per screen with its pill pointing to its case (the still beat after the loud rail).
- 8 · The promise: 'Built by the person you talk to. A fixed quote in two days…', centred, with one door, 'See your price →'. Jake's photo and name go here when they exist.
- 9 · Objections: the one white plate (four questions + Ask), entering on its edge and receding the Off+Brand way. Jake's call: his 09-19 decision also takes it off the homepage.
- 10 · Close: the statement with 'Book the call' inline, 'Run the check' as the quiet second door, the link columns, the clock and the wordmark, with the services strip running along the bottom edge.
- Off the homepage: the testimonial tiles (a duplicate of the voices) and the runs rail (the second sideways scroll; it moves to /services as one still four-step row). Result: ~11,000px at 1440 (~12 screens, down from 15.9), one sideways pin, nothing pinned after the rail.

## Disagreements

- Where §02b goes. R1 moves it to right after the rail (`apart`, zero build). R2 keeps it before the proof, alone on its own screen with no doors (`solo`). R3 replaces it with a 'who' screen after the voices carrying Jake's photo. The merge takes R3's slot and R1's grammar: after the voices, centred, one door. R2's in-place option leaves the statement→proof stretch Jake dislikes.
- The objections plate. R1 and R2 keep it: the 09-06 Off+Brand recede ending lives on that white card, and R2 would move the site check into it. R3 cuts it (`noobj`), carrying out the 09-19 convergence, because the priced pills and the promise line already answer its four questions. It is kept in the order, flagged as Jake's call.
- The audience ticker. R2 moves it to the close's bottom edge (`audend`) so the film and the poster each have their frame alone and 'owner-run businesses' isn't said twice in one viewport. R1 and R3 keep it under the film, where Jake approved step 2. It is kept there, and the close gets the services strip instead.
- Desert Wings' place. R2 puts DW last in the rail. R3 puts the persona's case first. R1 would lead the voices with the DW quote to follow the rail's old order. The merge is DW last by default with the persona overriding, and the voices follow whatever order the rail has.
- How many quotes. R1 keeps all three, one at a time, in the pill. R3 shows at most one until real named quotes exist. R2 accepts either. The merge: one per screen, and ship with one until real quotes arrive.
- The site check ('Already have a site? Run the check'). R2 moves it into the objections card. R3 lifts it up in the close as the one quiet second door. The merge keeps it in the close (R3), because the objections plate may leave.
- Single-reviewer proposals held out of the 7 because each bends a logged call. R1: `paper` ground flip under the one rail (THE PAGE IS DARK, 09-21, though paper was liked); one text wipe replacing the §02b sweep, voices focus-pull and close fill (`w2b`/`wvoice`/`wclose`, all approved vocabularies); a centred close with the mark writing itself (`sign`, touches 09-06's close); services as one fixed frame (`frame`). R2: dimming the rail's neighbour slivers (`hlit`, against 09-20 'the rail is continuous and flat'); folding the poster into the services stack (against 'i like … 2a'). R3: the rail directly after §02a (`railup`, puts the services' pin in the back half and shows DW back to back); a Result slot in the rail pill (needs real numbers).

## For Jake

The top of the page works: the title and film, the audience ticker, the held "Websites / Automation / Ads" screen, and the services one at a time. The new work rail works too. One big card per client, each with its pill, sliding sideways while the page holds. All three reviewers want to keep it exactly like that.

Three changes matter most:

1. Cut the three quote tiles. They repeat the same three quotes that show up again further down. They're also the one screen where the eye has three things to choose from.

2. Take the "how it runs" rail off the homepage. It's a second sideways scroll, so your work rail stops being the special one. You decided this on 09-19 and it never got done. It moves to the Services page.

3. Move the "Built by the person you talk to" sentence below the work and the quotes, and give it one button: See your price. Then the services run straight into your work, and most of the stretch you don't like goes away.

Together these make the page about a quarter shorter, with one thing to look at on every screen.

What only you can give:
- A photo of you for that sentence. Right now the page never shows your face or your name.
- Real quotes from real clients, with names and their permission. The current ones are placeholders and can't go live.
- Your OK to show prices on the service cards. Nothing on the page says what anything costs yet.
