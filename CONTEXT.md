# Pura Hero — build context and updates

The running record of this prototype: what is built, why it is built that way, what
broke and how it was fixed. Read this before continuing the build. The README covers
how to run it; this file covers how to *reason* about it.

- **Design source:** [Pura Website](https://www.figma.com/design/1ybPUzTZG9WJ2dle6NfH2U/Pura-Website), page **Final Website**, frames `Slide 1` … `Slide 36`, plus the `Carousel Selection 2`–`6` frames for the tabbed band, plus the `Menu` frame (node `6203:71995`) for the navigation.
- **Content source for the inner pages:** `https://pura-website-upload-1.vercel.app` — **not** pura.ai.
- **Live:** https://pura-hero.vercel.app · **Repo:** https://github.com/Rinielg/pura-hero (private — it carries PureHealth brand assets)
- **Device model:** forked from [Rinielg/pura-device-viewer](https://github.com/Rinielg/pura-device-viewer)

---

## 1. What the thing is

One scroll-driven sequence. Thirty-six Figma slides are thirty-six *moments*, and
scrolling scrubs a single GSAP timeline between them. There is no second section: the
page is the sequence, plus fixed page furniture (nav, store badges, scroll cue).

`Slide overview` in the Figma file is an assembly board, **not** a moment. Ignore it.
Everything comes from `Slide 1` … `Slide 36`, in numeric order.

---

## 2. The one idea that makes the code readable

**Everything is authored in a 1920×1080 frame, in frame pixels, and projected once.**

`src/hero/frames.js` holds the choreography as plain tables of Figma numbers. Nothing in
it knows about viewports. `src/hero/layout.js` converts a frame-pixel coordinate into the
current breakpoint's own frame, and `.stage` cover-fits that frame to the viewport.

On **desktop the projection is the identity** — so what renders is exactly what Figma has,
and any divergence is a bug you can measure rather than a judgement call.

There are four projections, and the distinction between them is the whole of `layout.js`:

| Projection | Used by | Why it is separate |
|---|---|---|
| `projectObject` | device, hand | One physical arrangement. Uniform scale, gap preserved. |
| `projectChip` | chips, all flat copy | A cloud, not an object. Converges hard on a phone. |
| `projectCards` | promo row, ruler | Wider than the frame by design; scales with the card, not the viewport. |
| `projectBottom` | agent bar | Keeps its distance from the bottom edge. |

### The GSAP ↔ three.js seam

`deviceProxy` is the only thing that crosses it: `fx, fy` (frame px), `s` (a multiple of
`DEVICE_REF_H = 630`), `rx/ry/rz` (degrees), `screenMix`. GSAP writes it; `Device.jsx`
reads it in `useFrame`. Nothing else talks across the boundary.

**Two writers, no collision.** `tiltX`/`tiltY` are the exception: the render loop owns
them, because they answer to the pointer rather than to scroll position. They are kept
apart from `rx`/`ry` rather than folded into them, so scroll and pointer can each write a
rotation without either having to know the other exists — the loop simply adds them on
apply. `tilt` (0–1) is the gate between the two, and that one *is* GSAP's, from
`DEVICE_TILT`. The rule generalises: **anything with two sources gets a channel each and
a gate, never a shared slot.**

---

## 2b. The site around the sequence

**Content source: `https://pura-website-upload-1.vercel.app`** — the current Pura
website build. NOT pura.ai, which is the older single-page site. An earlier pass
sourced from pura.ai and had to be redone; if you are adding a page, take its
copy from the upload site.

**Navigation spec: Figma node `6203:71995`** (page *Final Website*, frame
*Menu*). It draws four states — default, hover, dropdown-item hover, and
active/selected — with measurements the CSS follows exactly: bar 955×56, 24px
left padding, 48px gaps; link row 40px tall with a 2px gap; each item a 40px
pill with 16px side padding; dropdown card 294 wide, radius 16, 20px padding,
items radius 8 with 16/20 padding and a 4px gap.

Two labels differ between the two sources. **Figma wins for the nav**: it says
*Your Health* where the site says *My Health*, and *Pura AI* where the site says
*Ask Pura*.

Figma draws only the Your Health dropdown. The other six are built from the
upload site's own menu, which has the same shape. `Why Pura` is top level in
Figma and nested under *More* on the site, so its dropdown is assembled from the
site's More group — the items about the company rather than the product.

### The shape of it

`MENU` in `content.js` is the single source for the menu, the phone sheet and the
footer. `PAGES` is the single source for page content, and **`main.jsx` generates
routes from its keys** — so a dropdown entry without a page cannot silently
404.

Every feature page is the same template, because the source site's are: hero,
"What is X?", three numbered steps, four proof points on a dark band, questions,
the locked regulatory note, siblings, download. `SitePage` renders whichever of
those a page's data actually has.

**The regulatory note is reproduced verbatim** and marked in the source as a
locked slot subject to Regulatory sign-off. Do not reword it.

## 2c. Superseded: the first pass at the site

The home route is no longer the whole site. `react-router-dom` v7 carries six
more pages behind the navigation, and the **same `Nav` component renders on all
of them** — that is the point, and it is why the nav moved out of the hero's
mental model and into a router nav.

| Route | Source on pura.ai |
|---|---|
| `/my-health` | PureScore + Diabetes |
| `/care` | Online Doctor + mental health consultations |
| `/wellness` | Fitness & Wellness + Mental Wellness |
| `/pura-ai` | the companion itself |
| `/why-pura` | partners, the group, the case |
| `/for-business` | Partner With Pura + Longevity Clinic |

**pura.ai is a single page.** Its "AI PureScore", "Integrated Health" and
"Wellness" menu items are anchors, not pages; the only real sub-pages are the
Longevity Clinic subdomain, Privacy, Terms and FAQs. So the six routes are a
*redistribution* of five sections into a new information architecture, not a
copy of an existing site. That mapping is a judgement and it lives at the top of
`src/site/content.js`, where it can be argued with.

Copy is reproduced as written. Where a page needed connective tissue the live
site does not have, the line is marked `NEW` in `content.js`.

### Two kinds of route

`/` owns the viewport, runs ScrollSmoother and paints its own fixed layer stack,
so it sits **outside** `SiteLayout` and renders `Nav` itself. Everything else is
an ordinary document inside `SiteLayout`, which adds the nav and a footer.
Wrapping the home route in the document layout would give it a second scroller.

`html, body, #root` are `min-height: 100%`, not `height: 100%` — the home route
pins the viewport, but a document route has to be free to grow past it.

### Things that bit

- **The partner logos are pure white artwork on transparency**, drawn for
  pura.ai's dark band. On a white card they are invisible. The band is dark here
  too; recolouring someone's logo is not an option.
- **The phone had no navigation.** `.nav__links` is `display: none` below 820px,
  which was correct when there was one page. Six routes later it is a trap, so
  there is a burger and a glass sheet.
- **Installing a dependency poisons a running Vite dev server.** The optimizer
  had pre-bundled React before `react-router-dom` existed, which surfaced as
  "Invalid hook call … more than one copy of React". `rm -rf node_modules/.vite`
  and restart. A browser tab that saw the error stays broken; open a new one.
- **Vercel needs an SPA rewrite** or every route but `/` 404s on refresh. It is
  in `vercel.json`.

---

## 2d. The navigation

Built to the Figma `Menu` frame, node **`6203:71995`**, which draws four states:
default, label hover, dropdown-item hover, and active/selected. The numbers are
followed rather than approximated, and each one is checkable in the browser:

| | Figma | Where it lives |
|---|---|---|
| Bar | 955×56, 24px left pad, 8px elsewhere, 48px gaps | `.nav__pill` |
| Bar packing | hugs content, no `space-between` | `.nav__pill` |
| Logo frame | 55×36 with 55×26 art at its TOP | `.nav__logo` |
| Link row | 40px tall, 2px gap | `.pnav` |
| Item | 40px pill, 16px sides, **min-width 80** | `.pnav__label` |
| CTA | 130×40 | `.nav__cta` |
| Dropdown card | 294 wide, radius 16, 20px pad | `.pnav__card` |
| Card position | centred on its item, 4px below the BAR | `.pnav__card` |
| Dropdown item | radius 8, 16/20 pad, 4px gap | `.pnav__item` |

Two deliberate departures, both for reasons the static file cannot express:

- **No chevron.** The file draws one on hover, but it is a 16px box with an 8px
  gap, so revealing it widened the item by 24px and slid every label to its
  right. A menu that reflows under the cursor is worse than a missing
  affordance; `aria-haspopup`/`aria-expanded` still carry it for assistive tech.
- **No active dot.** Added once, removed once — the file marks the current item
  with weight and the white pill and nothing else.

**Ownership of the active state is by ROUTE, with membership as a fallback**
(`ownerOf` in `Chrome.jsx`). Pura AI's dropdown cross-links PureScore and
Biomarkers, which live under Your Health, so membership alone lit two groups at
once. Pages whose route sits outside their group's prefix — `/about`, `/trust`,
`/partners`, everything under More — fall back to membership. Exactly one group
is active on every route; there is a check for it in §8.

### It gets out of the way

The bar tucks up off the top on any downward scroll and comes back on any upward
one, wherever you are on the page. Three things about it are load-bearing:

- **It reads NATIVE scroll, not the smoothed position.** On the home route
  ScrollSmoother lags real scroll by design, and the bar should answer to what
  the hand is doing rather than to what the page has caught up with — a bar that
  returns a third of a second after you flick up feels broken.
- **It moves by `transform`, never `opacity`.** An opacity below 1 here would
  make the header a backdrop root and kill the pill's `backdrop-filter`
  outright — the same trap that cost the Overlay its blur. A transformed
  ancestor is *not* a backdrop root, so moving it away is safe where fading it
  away would not be. Verified with the bar mid-flight: the pill still computes
  `blur(24px) saturate(1.8)` and its nearest backdrop root is the document.
- **A 4px direction threshold.** Zero works off a wheel and is unusable on a
  trackpad, where the tail of a flick wobbles a pixel either way and the bar
  flickers for half a second after you stop. Below the threshold the mark is
  *held* rather than moved, or a slow drag never accumulates enough in any one
  frame to count as a direction.

The travel is `-100%` plus 96px of clearance, not `-100%` alone: that lands the
bar's bottom edge exactly on the viewport's top, where the pill's drop shadow
stays behind as a grey smear across the whole width.

It stays put while the phone sheet is open (hiding the thing you are scrolling
inside is nonsense), comes back if focus reaches it from the keyboard, takes any
open dropdown with it when it goes, and resets on every route change — a new
page opens at the top, and arriving somewhere with no navigation until you
happen to scroll up is a dead end.

### The backdrop is two different things

`Backdrop.jsx` renders the mesh gradient, and what it renders depends on the
width:

| | below 820px | 820px and up |
|---|---|---|
| What | `/bg/gradient-bg-mobile.jpg` | the Lottie |
| How | one `background-image`, `cover` | lottie-web, SVG, 15s of drift |
| Cost | a 144KB decode, once | eight animated radial gradients at viewport size |

The JSON is never fetched on a phone and lottie-web never runs — the effect
returns before `loadAnimation`. That is the point: the expense was never the
21KB file, it was compositing eight moving gradients the size of the screen, on
the device with the least to spend, on a page that also has a 3D phone to draw.

The export is 1320x2868, which is the mobile frame's own 1:2.17 — so `cover` is
an exact fit and nothing is cropped. It matches the Lottie's `xMidYMid slice`.

**It decides for itself rather than taking a prop.** This component is rendered
in two unrelated trees: inside the hero, which knows its layout, and by
`PageHero` on every inner page, which does not. One media query against the same
`PHONE_MAX` that `pickLayout` uses is what stops the two disagreeing — the
constant is exported from `layout.js` for exactly that reason.

The file is `Backdrop.jsx`, not `LottieBackground.jsx`: on more than half the
viewports it serves, there is no Lottie in it.

## 3. Where things live

| File | What it owns |
|---|---|
| `src/hero/frames.js` | Every number from Figma. One exported table per animated thing. |
| `src/hero/useHeroTimeline.js` | The timeline. Turns tables into tweens. |
| `src/hero/layout.js` | Breakpoints and the four projections. |
| `src/App.jsx` | The layer stack, the DOM, and the `Carousel` component. |
| `src/Device.jsx` | The three.js phone: black finish, eight screens, shader crossfade, cursor tilt. |
| `src/Scene.jsx` | The canvas and the procedural studio the mirrored body reflects. |
| `src/deviceProxy.js` | The one seam between GSAP and three.js. Nothing else crosses it. |
| `src/Backdrop.jsx` | The mesh gradient: the Lottie on desktop, a still on a phone. |
| `src/config.js` | Camera, device scale, render quality. Things that never change at runtime. |
| `src/hero/Chrome.jsx` | The navigation and the store badges — shared by every route. |
| `src/styles.css` | All of it. No CSS modules, no Tailwind. |
| `tools/extract-frames.js` | Re-read the sequence from Figma. **Not** part of the build. |
| `src/main.jsx` | The routes. |
| `src/site/content.js` | Every word the inner pages say, and the IA mapping. |
| `src/site/Sections.jsx` | The blocks pages are assembled from. |
| `src/site/Pages.jsx` | All 23 inner pages, as one arrangement of those blocks. |
| `src/site/Layout.jsx` | Nav + page + footer, for document routes. |
| `src/site.css` | The inner pages. Adds only; never touches the hero. |

### The layer stack (z-index)

```
0  backdrop        the gradient, which travels
1  back / copy     chips, hand, hero copy, the day's five photo panels
2  canvas          the three.js device — up to slide 24
3  front           wash, act-3 copy, cards
4  canvas          the three.js device — from slide 25 (see DEVICE_FRONT_FROM)
6  front (interactive)  act-4/5 copy, pills, carousel + arrows
5  #smooth-wrapper the scroll spacer — fixed, and it swallows clicks
10 nav, stores, cue
```

Note the ordering: **6 sits above 5 on purpose.** See §5.

---

## 4. The sequence, act by act

| Slides | What happens |
|---|---|
| 1–3 | Hero copy rises, the device grows and tilts toward the camera. |
| 4–6 | A hand comes up from below, takes the phone, and fades **in place**. |
| 7–9 | The screen crossfades to Pura AI; the agent bar appears, then widens. |
| 10–16 | The whole first-act scene travels up and out. Act 3 copy arrives, then the promo card row scrolls in from the right. |
| 17 | Everything from the first three acts leaves together. The **partner band** takes the middle of the frame — "Built by PureHealth" and eight logos — and pushes the whole fourth act down past it; the carousel is still below the fold here. See §6c. |
| 18–19 | The feature carousel. **Arrow-driven, and tabbed** — see §6. |
| 20–25 | The carousel holds the centre and rises. "See how Pura fits into one ordinary day.", the peach time ruler, and the media panel that *grows* — 154×88, 764×437, 1058×605, 1152×659. |
| 25 | The device comes back, rising from below the frame at (959.7, 1266.7), and **changes sides**: from here it draws in front of the Overlay rather than under it. |
| 26 | The day resolves into the app. The panel slides right and stands up at **812×778 centred on x=1366**, the device lands at `ai(663)` showing the day's first screen, the morning greeting arrives flush left at x=148, and the phone starts **watching the cursor**. |
| 27–36 | **The day**: six scenes joined by five transitions. Even slides are settled, odd slides are the reveal. See §4b. |
| ~~20–23~~ | ~~The carousel holds the centre and rises, leaving left only at 23. "See how Pura fits into one ordinary day.", the time ruler, and the day's media panel, which *grows* rather than fades. |

### 4b. The day (slides 26–36)

Eleven slides, one structure, and it is worth stating because every table from 26 on
follows it:

| | Settled (26, 28, 30, 32, 34, 36) | Transition (27, 29, 31, 33, 35) |
|---|---|---|
| Photograph | one scene fills the panel | two scenes, half the panel each |
| Headline (and, on scene A only, its paragraph) | changes | **unchanged** |
| Phone's screen | changes | **unchanged** |
| Ruler | moves one hour | **unchanged** |
| Phone itself | still | still |

So a transition changes exactly one thing. That is the whole reason it reads as a reveal
rather than as a cut, and it is why `SCREEN_SEQ` and the copy tables both hold their value
across the odd slides instead of stepping every slide.

**The panel** is a constant after 26: **812×778** centred on x=**1366**, top at y=**182**,
radius 60. Six windows are stacked in it, one per scene, all mounted at once. `PANEL_TOP`
is exported from `frames.js` rather than copied into the timeline — it has moved twice,
and the width and centre have now moved with it.

The hours the ruler shows under the marker are worth knowing, because they are the
cross-check on every position in the second half of the page: 26 → 7:00, 28 → 9:00,
30 → 12:00, 32 → 14:00, 34 → 16:00, 36 → 23:00. The last one is what scene F's "lights out
by 11" is describing.

**The two windows are tiled into the panel box, not projected one by one.** A
window's height is a `projectLength`, which scales with the device; its centre
used to go through `projectChip`, which converges the y axis at a different rate.
On a phone those rates are 0.604 and 0.8, so the pair that meets 16 frame pixels
apart on desktop met **76 CSS pixels** apart on a 375px screen — a chasm down the
middle of the reveal. Tiled, the gap is whatever `LAYOUTS[…].panelGap` says: 16
on desktop, 8 on a phone. `shutter()` tags each row with the panel edge it hangs
from, which is what lets a layout re-tile the pair without naming the phases.

**The reveal is a shutter, not a crossfade.** Each window is a clipping box over an image
that **never moves**. The outgoing window's top stays at the panel's top and its height
runs 778 → 381 → 0; the incoming window's bottom stays at the panel's bottom and its
height runs 0 → 381 → 778. They meet at half the panel each, 16px apart, which is the
frame the file draws.

The image is held still by `ih` on the row: where it is set the image keeps its full 778px
height and the track offsets it by `PANEL_TOP − windowTop`. Work that through for any of
the five phases and the image's top comes out at the panel's own top every time — which is what makes the
tween between any two of them hold it perfectly still. Let the image fill its window
instead and it rescales as the window shrinks, which reads as a squash.

`ih` is absent on scene A's early rows, and that is deliberate: while the panel is still
growing out of a 154×88 pill the image *should* fill it. The two definitions agree exactly
on slide 26, where the window is the panel — which is what makes the hand-off from filling
to shuttering invisible.

### Slide numbering, and the off-by-one that will catch you

Tables in `frames.js` are **0-indexed**: index `0` is **Slide 1**. A table shorter than
23 entries is *parked* — `at(TABLE, slide)` clamps past the end, which is how a layer that
stops changing stays put without 23 copies of the same row.

That clamp is load-bearing, and it is also the trap. When you extend a table so a layer
*exits*, the exit entry must land at the right index. Getting this wrong makes the whole
first act leave one slide early, which is exactly what happened on 2026-09-17 (§5).

---

## 5. Fixes, and what each one taught

### Scrubbed timelines do not render slide 0

A `tl.to()` starting at time 0 leaves the element at its authored CSS until the playhead
moves. **Every target is written twice**: a bare `gsap.set(...)` *and* `tl.set(..., 0)`.

### The harsh overlay edge

Figma's overlay is a soft gradient; one `backdrop-filter` gives a hard line where the
filter region ends. Fixed with **four masked blur bands** (`.wash__blur--1…4`) plus a tint.

### The screen changes mid-rotation

Not a cut — two emissive maps mixed in the shader via `onBeforeCompile`. **three.js only
auto-declares its own uniforms**, so `uScreenB` / `uScreenMix` are prepended to the
fragment source by hand or you get "undeclared identifier".

### The WebGL cover layer washed the screen out

Detect cover layers by **footprint** (≥50% of display area), not by material type. The
9,480-tri cover sheet is not metallic and slipped past a metalness test.

### The hand

Position and opacity are **separate tracks with separate windows** (`STEP_WINDOWS`), so
the hand can fade without moving — the design's request, and impossible if one tween
carries both. The device's own handover is delayed until the hand is nearly gone.

### The first act left one slide early *(2026-09-17)*

`DEVICE_POSE`, `AGENT_BAR`, `washY`, `BACKDROP_Y` and `SCREEN_MIX` ran to slide 15 while
`ACT3_*` ran to 16. Appending one exit row to each put the exit at a different slide in
each table. Symptom: at Slide 16 the gradient, wash, device and agent bar had already
gone, though the file still draws them. Fix: one more *parked* row before the exit row.

**Guard:** after touching any table, diff the rendered frame-pixel centres against the
Figma numbers (§8). Do not eyeball it.

### The promo cards would not leave *(2026-09-17)*

Reported by Riniel. `CARDS`, `ACT3_*`, `WASH_*` and `BACKDROP_Y` all stopped at slide 16
or 17 and then clamped, so the card row sat on top of the act-4 heading for the rest of
the page. Figma simply *deletes* those nodes at Slide 17–18; the build has to carry them
out instead. Cards now continue their own leftward drift and fade over 17→18.

### The carousel arrows were not clickable *(2026-09-17)*

`#smooth-wrapper` is `position: fixed`, covers the viewport, is `pointer-events: auto`,
and sits at **z-index 5** — above every animation layer. Hit-testing at the arrow returned
the wrapper, so clicks never reached the button. Fixed with `.layer--interactive`
(z-index 6) on the one layer that carries controls. The layer stays
`pointer-events: none`; only the buttons inside it take a click.

**If you add another control inside the sequence, it must live in that layer.**

### The wash was using the wrong projection *(2026-09-18)*

On a phone the pinned Overlay looked absent. It was not: it was using
`projectChip`, which carries the chip cloud's convergence **and its +58px
downward offset**. That put the band's top at 777 of a 932 frame and its bottom
at 999 — sixty-seven pixels hanging below the frame, clipped away, and the
clipped part was the solid end of the gradient. What survived on screen was the
weak top of the ramp, which reads as no wash at all.

The wash is anchored to the frame's BOTTOM, so it takes `projectBottom` — which
already existed for exactly this, and which desktop leaves as the identity.

**Its height has to be projected too.** 222 frame pixels is 222 only when the
frame is 1080 tall; anywhere else the band must shrink with the frame or it
overshoots the bottom again. `washH = 222 * (L.frame[1] / FRAME.h)`.

Check: at any breakpoint, on any slide, the pinned wash's bottom should sit on
the viewport's bottom edge.

### Off-frame is not off-frame on a phone *(2026-09-18)*

`chipK[1] = 0.8` compresses vertical travel on mobile, so anything parked
*above* the frame gets dragged back toward it. The carousel, parked at y=-264
and comfortably gone on desktop, had 41px of card text showing under the nav on
a phone.

The fix is to **fade things out as they exit** rather than relying on position
alone: `CAROUSEL` and `CAROUSEL_CTRL` now end at opacity 0. On desktop they are
already off-frame so the fade is invisible; on mobile it is the difference
between gone and a strip of stray copy.

Worth remembering for any future exit: a table that ends with `o: 1` at an
off-frame position is a desktop-only assumption.

### Slide 26 on a phone is a derivation *(2026-09-18)*

The file sets the greeting and its paragraph BESIDE the phone, at x=391.5. A
phone has no beside. On mobile the copy is centred and lifted into the band
between the ruler and the device, and **the device and the photo panel both drop
150 frame pixels and the device shrinks to 0.7** to make that band exist.

Four things have to hold at 375px, and they are all measurable:

| | Rule |
|---|---|
| greeting top | below the ruler's bottom |
| body top | below the greeting's bottom |
| body bottom | above the panel's top |
| document | no horizontal overflow |

Change any of the type sizes and re-check all four — the band is about 160px
tall and the copy fills most of it.

### The logo is meant to sit high *(2026-09-18)*

Reported as a vertical misalignment against the design, and the file explains
it: the `Pura Logo` frame is **55×36** holding a **55×26** wordmark at y=0.5 —
ten pixels of empty space below the art. The FRAME is what gets centred in the
56px bar, so the artwork lands at y=10.5..36.5, four and a half pixels higher
than centring the wordmark on its own would put it.

The asset on disk is the 55×26 artwork, so the box around it carries the extra
height and the art hangs from its top. Measure `.nav__logo` against the bar: the
box should span 10..46 and the image 10.5..36.5.

### Bringing the device back for slide 26 *(2026-09-18)*

The device is **one WebGL object that exists for the whole sequence**, not
something that mounts and unmounts, so it cannot simply appear on slide 26. It
had also parked off the TOP of the frame when it left at slide 17, and slide 26
wants it in the middle.

`DEVICE_FADE` is the gate. It drops to zero at slide 14 — long after the device
has left the visible frame — which makes the reposition between 17 and 18
invisible, and comes back for 26. Without it, a phone sweeps down the screen.

`SCREEN_MIX` returns to 0 over the same dead stretch, so the shader is showing
the home screen again by the time anyone can see it.

### The Overlay needs something behind it *(2026-09-18)*

The blur was live and the white gradient was correct, but the day's photo panel
sat in the interactive front layer at z-index 6 — *above* the wash at 3. A
`backdrop-filter` can only blur what is painted beneath it, so the Overlay had
nothing to work on, and the panel covered the device outright.

The file orders slide 26 panel → Overlay → phone, so the panel moved down to the
back layer (z 1). Stacking is now panel 1, device 2, wash 3, copy 6.

One deliberate divergence: the file puts the phone *above* the Overlay, this
build leaves it below. The wash dissolving the device's foot is the whole point
of slides 7–9, and the device is a single WebGL object that cannot be in two
layers at once.

### The wash is two layers doing different jobs *(2026-09-18)*

The file used to travel both Overlay rectangles up and out with the first act.
It now keeps **one pinned to the bottom of the frame on every slide from 1 to
26** while the other still leaves. The blur band is page furniture, not part of
the scene that departs — which is why the bottom of the page stays blurred for
the whole scroll instead of going sharp at slide 17.

`WASH_A` travels (858 → 637 → 351 → 206 → −136 → −570). `WASH_B` is pinned at
858 and only its opacity is tracked.

**Check it against the file by counting Overlay nodes per slide:** one on 1–4,
two on 5–12, three on 13–16 (the travelling pair plus the pinned one), and one
from 17 on. If that count changes, the model here needs revisiting.

### Incoming layers appeared instead of arriving *(2026-09-18)*

Reported by Riniel against Slides 16–18. Every layer that had not arrived yet was
*parked at its first visible position*, so on the step it appeared it faded up
**standing still** while the whole page rose 434px around it. The copy and the
pill row looked pinned; the page read as a stack of separate sections rather
than as one thing scrolling.

`CARDS` was the only table that got it right — parked 265px below where it first
shows, which is exactly the page's rise on that step.

**The rule, now applied to every table:** a layer that has not arrived waits
*below* its first visible pose by the distance the page rises on the step it
arrives on. Figma cannot express this, because a layer that is not on a slide
simply is not there — so it has to be derived from the step's own rise.

| Step | Rise | Parked offset applied to |
|---|---|---|
| 9→10 | 221 | `ACT3_HEAD`, `ACT3_BODY` |
| 10→11 | 265 | `ACT3_CTA`, `CARDS` (already correct) |
| 15→16 | 135 | `ACT4_HEAD` |
| 16→17 | 434 | `PILLS`, `CAROUSEL` |
| 17→18 | 299 | `CAROUSEL_CTRL` |
| 19→20 | 147 | `ACT5_HEAD` |
| 20→21 | 181 | `TIMELINE`, `TIMELINE_DOT` |
| 21→22 | 331 | `DAY_MEDIA` |

**Guard:** diff every table's per-step y delta against the page rise. Everything
should move by the same amount on a given step. The only legitimate exception is
`DAY_MEDIA` on 22→23, whose centre shifts because the panel is *growing*, not
travelling.

### Firefox never had any blur at all *(2026-09-18)*

Found while checking the nav fix on production. The CSS minifier treats
`backdrop-filter` and `-webkit-backdrop-filter` as the same property and keeps
whichever it sees **last**. Every pair in the source was written standard-first,
so the standard declaration was dropped from every build: **13 prefixed, 0
standard** shipped. Chrome honours the prefix, so it looked right there and
nowhere else.

Fixed by putting `-webkit-` first in all twelve pairs; both now ship. There is a
comment at the top of `styles.css` saying not to reorder them, because the
failure is completely invisible in the browser you are testing in.

### The nav blur was there and did nothing *(2026-09-18)*

Reported as "the background blur is gone". The declaration had never been
removed and `backdrop-filter` was computing fine — a `grayscale(1)` test proved
the backdrop was being sampled. The problem was the **fill**: Figma paints this
pill white at 70%, which is opaque enough that a 20px blur makes no visible
difference. The effect existed only in the computed style.

The veil came down to 52%, the blur up to 24px, and a 1px inset hairline was
added, because a glass edge catches light and without it the pill reads as a
hole. The look the brief asked for is a fill decision, not a filter decision.

### The file dropped the navigation, and the day rose 80px *(2026-09-18)*

Slides 23–34 were rebuilt on the `Final Website` page with the navigation
removed from slide 24 onward, and everything below it moved up to take the
space: panel 262→182, device 650.7→570.7, copy 357→277, ruler 186→106, marker
144→64. Slides 24 and 25 were re-spaced by hand on the way (−80 and −40), so it
is not one uniform shift and each row has to be read off the file.

**The build keeps the navigation.** The file not drawing it is a statement about
the composition, not an instruction to delete a site-wide control — and it
happens to agree with the bar's own behaviour, since by slide 24 you have been
scrolling down for a while and it has tucked itself away.

**One correction to the file.** Slide 26's paragraph is the single element that
did NOT get the −80: it sits at y=501 while its own heading, panel, phone, ruler
and marker all moved. 501 − 80 = 421, which is exactly where slide 27 puts the
*same* paragraph. Followed literally it would jump 80px on the 26→27 step for no
reason, so the build uses 421 and says so in `DAY_SCENES`.

### Two hand-set mobile lifts became a measured stack *(2026-09-18)*

Scene C's headline grew to four lines on a phone. Its paragraph landed 14px
inside it and the headline itself clipped the ruler by 7.

The copy used to be placed by two constants — headlines up 140 frame px,
paragraphs up 150 — which worked while every headline was two lines. Five
headlines that measure 100, 130, 160, 130 and 160 stage px cannot be seated by
one number, and the next copy change would have broken them again.

`mobileStack()` measures instead, once per layout: every headline hangs from the
same line under the ruler, its paragraph sits under whatever height that
headline turned out to be, and the panel and device drop far enough to clear the
**tallest** scene — not each scene's own, or the panel would shuffle up and down
as the day went by. The drop came out at 241 frame px against the 150 that was
there before. Per-slide, every scene now reads 31px clear of the ruler, 16px
between headline and paragraph, and 23–93px between paragraph and panel.

Two things this cost, both worth keeping:

- **`projectChip` returns an ARRAY, not an object.** `projectChip(...).y` is
  `undefined`, which made the drop `NaN` — and GSAP writes NaN into a transform
  without complaining, so the panels simply stopped where they were and every
  measurement I took off them was garbage. `project()` is the object form; use
  that. A NaN in a tween is invisible until you print it.
- **The drop is keyed off the ROW, not the slide number.** `row.ih != null` is
  what marks a row as one of the day's shutters. A `slide >= 25` test had
  scene A's window answering differently from scene B's on the same slide.

### Promoted text layers lose their last line on a phone *(2026-09-18)*

The third line of scene C's paragraph rendered with its descenders sliced off,
about 4px above the element's own box. Not an occluder, and not clipping —
`scrollHeight === clientHeight` and `overflow: visible`.

It is a rasterisation truncation. These blocks animate transform, opacity and
filter, so they are promoted to their own compositor layer, and inside a stage
scaled by a fraction — 0.872 at 375px — the layer is rasterised a few pixels
short of its box. Desktop is the identity projection and never shows it.

Six pixels of `padding-bottom` on `.greeting` and `.greeting-body`, mobile only.
Invisible — neither has a background or a border — and the measured stack picks
the extra height up on its own. Worth recognising the shape of it: **text cut a
few pixels above its own border box, only at a fractional scale, is the
compositor, not your layout.**

### The phone's screen became a list, not a mix *(2026-09-18)*

The day needs six screens. The crossfade was built for two: `emissiveMap` was
screen A, a `uScreenB` uniform was screen B, and `screenMix` ran 0 to 1 between
them.

It is now a tweened **index** into `SCREEN_URLS`, and the shader crossfades
between `floor` and `ceil` of it. Both screens moved into uniforms
(`uScreenA`/`uScreenB`) — `emissiveMap` is still assigned, but only to define
`USE_EMISSIVEMAP` and give the shader its `vEmissiveMapUv`. Swapping
`emissiveMap` per frame instead would mean a material recompile per frame;
uniforms cost nothing.

**The list's ORDER is load-bearing**, and this is the part that will bite
whoever adds the next screen. Because the index is tweened, two consecutive
slides more than one step apart drag the crossfade through whatever sits between
them, and a screen that belongs to neither slide flashes up mid-scroll. The list
runs *backwards* through the day for exactly that reason:

```
0 ui-e  1 ui-d  2 ui-c  3 ui-b  4 Home  5 Pura AI
```

which makes the whole sequence 4 → 5 → 4 → 3 → 2 → 1 → 0. Every step is ±1.
Order it the obvious way — Home, AI, then the day — and slide 27 → 28 runs 0 → 2
straight through Pura AI.

### The device changes sides at slide 25 *(2026-09-18)*

Asked for: "the device on slide 26 should sit above the overlay". It is what the
file has had since slide 25, and the build had it backwards on every slide —
`.device-layer` is z 2 and the wash is z 3.

Up to slide 24 that is *correct* and deliberate: the wash dissolving the foot of
the phone is what makes the resting state read as settled rather than cropped.
From the day's first scene the phone is the subject, so it comes forward and the
wash blurs only the photograph behind it.

This cannot be a track. **A z-index has to be a whole number**, and a scrubbed
tween would spend the whole step handing the browser fractions to throw away. It
is a `tl.set` on a slide boundary instead — placed one slide *early*, at 24,
where `DEVICE_FADE` still holds the device at zero and there is nothing on screen
to see jump. Scrubbing back up restores the old value on its own; that is what
`set` does on a timeline.

### The phone watches the cursor on slide 26 *(2026-09-18)*

Asked for: on 26 the device should tilt and rotate slightly with the mouse, as
if looking at it.

Slide 26 is the one place this works, and the pose is why. `DEVICE_POSE[25]` is
`FACE` — `[0, 0, 0]`, dead front-on, at rest at the end of the sequence. Every
other slide has the phone mid-arc on a scripted rotation, and a second hand on
that rotation reads as a bug, not as life. So the effect is gated by a table
(`DEVICE_TILT`, zero everywhere, 1 on 26) rather than by a page-level flag, and
because the timeline tweens that gate like any other value, the tilt **eases in
across the step into 26** instead of switching on.

The geometry, so nobody has to re-derive the signs: the screen faces **+Z**.
Rotating +X swings that normal **down**; rotating +Y swings it **right**. So a
cursor below centre is a positive pitch and a cursor right of centre a positive
yaw — no sign flips anywhere. The angle is measured from the **device's** centre
on screen, not the viewport's, which is the angle it would really have to turn
through; that centre falls out of the conversion the position already uses, one
frame pixel being `stageScale` CSS pixels.

Numbers: 12° of yaw and 8° of pitch at the edge of the viewport. Yaw runs
further because a screen turning left and right reads as *looking*, while the
same angle up and down reads as the phone falling over. Easing is
`MathUtils.damp` at λ=5 — framerate-independent, and about a third of a second
to close the gap, which is the line between "it is watching me" and "it is
attached to my mouse".

Nothing is attached at all under `prefers-reduced-motion`, or on anything that
is not `(hover: hover) and (pointer: fine)` — a touch screen has no cursor to
look at. A pointer that leaves the window sets the target to `null` rather than
to centre, which is a distinct state: it means *unwind to face-on*, not *freeze
at whatever angle you were at when you crossed the edge*.

### The Overlay's blur had never once rendered *(2026-09-18)*

Reported as "the Overlay background blur effect is not showing". Everything
measurable said it was fine: the band was flush to the bottom on all 26 slides,
all four `.wash__blur` bands computed their `blur(4/12/30/60px)`, opacity 1,
nothing above them in the stacking order. Painting the band red proved it was
compositing over the photo. The blur simply did nothing — on **every** browser
and **every** breakpoint, since the day it was written.

The cause is a rule with no error, no warning and no visible symptom in DevTools:

> An element becomes a **backdrop root** if it has `opacity` below 1, a `filter`,
> a `mask`, a `clip-path`, `isolation: isolate`, `contain: paint`, **or a
> `will-change` naming any of those**. A descendant's `backdrop-filter` samples
> only what is painted *inside that root* — nothing behind it.

`.wash` carried `will-change: transform, opacity`. The `opacity` in that list
made it a backdrop root, and the wash paints nothing of its own, so the four
bands inside were blurring an empty backdrop. The white tint gradient was doing
all the visible work, which is exactly why it read as "there but not blurring".

The fix is a split of responsibilities:

- **`.wash` only ever moves.** `will-change: transform`, and its opacity is
  never animated — it stays at a hard `1`.
- **The fade moved onto its children.** Opacity on the *same* element as a
  `backdrop-filter` composites the already-filtered backdrop correctly, so each
  band dims exactly as before while keeping its blur. `washTrack` now runs two
  tracks: `{ y }` on the wash, `{ opacity }` on `Array.from(el.children)`.

Two things worth keeping from the hunt:

- **A scrubbed GSAP tween settles at `0.9996`, not `1`.** So "it is at rest, so
  opacity is 1, so it is not a backdrop root" is false. If a `backdrop-filter`
  has to survive, the ancestor's opacity must never be animated at all.
- **The nearest backdrop root is the only one that matters, and being one is not
  automatically a bug.** `.card` has `isolation: isolate` and therefore *is* a
  root — but its subtree holds `.card__photo`, which is precisely what
  `.card__foot` wants to blur. A first audit that walked every ancestor flagged
  the card captions as broken; an A/B against the live page showed they were
  fine. **Stop at the nearest root, then ask whether that root contains the
  thing you meant to blur.**

The audit that answers this, worth pasting into the console after any change
that touches blur, is in §8.

### Ten pages printed their hero twice *(2026-09-18)*

Found during the 375px pass. `SitePage` fell back to
`<Split eyebrow={data.kicker} title={data.h1} body={data.lead} media={data.media} />`
for any page with no `whatIs` — which re-stated the page's own kicker, heading
and lead directly under the hero that had just said them. Ten of the
twenty-three pages did this. Obvious at any width; on a phone the two copies
*are* the first screen and a half, because they stack.

The picture was worth keeping and the second heading was not, so those pages now
get `MediaBand` — the same tinted frame as `.split__media`, image only.

### The store badges sat on top of every inner page *(2026-09-18)*

`.stores` is `position: fixed` bottom-right. On the hero that is correct: one
viewport, nothing scrolls under it, and the badges are part of the composition.
On a document page at 375px they permanently covered a 220×35 strip of whatever
happened to be at the foot of the viewport — the end of the CTA band, then the
footer's fine print.

Every inner page already ends with both store links in its CTA, so the fixed
pair was redundant there rather than useful. `.site .stores { display: none }`
inside the 980px query, scoped to `.site` so the hero keeps them.

### The hour ruler read the wrong time *(2026-09-18)*

The ruler was built with seven labels (5:00–11:00) spread evenly across its
10,741px, which put 5:00 about a thousand pixels from where the design has it. The
marker stands still and the ruler moves under it, so a label in the wrong place
tells the wrong time. `RULER_HOURS` now carries all twenty labels at the centres
Figma gives them — they are **not** evenly spaced, because a label's own width
pushes its neighbours along in the auto-layout row.

Slides 21→23 travel from just before 5:00 to exactly 6:00; the marker landing on
6:00 at Slide 23 is the check that the positions are right.

### Figma asset extraction

- Exports **clip to the slide frame**. The hand came back 610px instead of 1884; the fix
  is to export the *source* image and apply its `CROP` `imageTransform` yourself.
- A node that sits past the frame edge exports at a few pixels wide. Re-export the same
  component from a later slide where it is fully inside.
- One movement tag icon exports as a 1×1 transparent pixel from its own instance in every
  format, though it renders on canvas. Exported from the same component on a later slide.
- Figma flips the Google Play wordmark inside its component: `transform: scaleY(-1)`.
- `BACKGROUND_BLUR radius` → CSS `backdrop-filter: blur(radius / 2)`.

### Node ids are worthless here

The slides get **rebuilt**, not edited — every node id changed between passes. Match by
**layer name and page order**. `tools/extract-frames.js` does exactly that.

---

## 6. The carousel (Slides 18–19)

Two controls, and they are the only ones inside the sequence.

**The arrows** page the row. Right arrow slides the set left, left arrow slides it right.

- Paging is **derived, not stored**: `overflow = rowW - frameW`, `pages` from `overflow / step`.
  Only `page` is state. Nothing to keep in sync.
- The row is tweened in a plain `useEffect`, not through the timeline — it is the one thing
  on the page that moves on a click rather than on scroll. It respects
  `prefers-reduced-motion` by tweening with `duration: 0`.

**The tabs** swap the deck. The file draws six versions of this band — Slides 18/19 plus
the five `Carousel Selection` frames — and the only thing that differs between them is each
card's title and body. The little visualisation at the top of every card is the same four
widgets in the same order on every tab, because in the file they are the same instances.

So `CAROUSEL_TABS` is six lists of copy over one shared set of `WIDGETS`, and
`CAROUSEL_ITEMS` is just `CAROUSEL_TABS[0]`. Thirty cards written out longhand would be
thirty chances for the chrome to drift; the file guarantees it never does.

Each tab does bring **its own lead photograph** — `lead-1` … `lead-6`, in tab order. That
is the one visual besides the copy that differs between the file's six versions.

- The decks are **different lengths** (My Health has five cards, Women's Health three), so
  changing tab takes the row back to page 0. A tab picked while the row was paged along
  would otherwise open in its middle.
- `role="tablist"` / `role="tab"` / `role="tabpanel"`, so the relationship survives a
  keyboard and a screen reader.
- **The row is two elements**: `.pills` is the viewport and `.pills__row` overflows it. Six
  labels come to 603px, which fits a 1920 frame and does not fit a 430 one — and when they
  were decoration the two that fell off the ends did not matter. As controls they do, so on
  a phone the viewport is exactly one frame wide and scrolls, and picking a tab scrolls it
  into the middle.
- `CAROUSEL_GEO` in `frames.js` holds the geometry; `CAROUSEL_TABS` holds the content.

---

## 6b. Left of the frame is not left of the screen

The stage **covers** the viewport rather than fitting inside it — see `stageScale`. On any
window narrower than 16:9 that costs you the frame's left and right edges: about 290 frame
pixels off each side at 5:4, which is the whole of the day's copy column and the
carousel's first card.

Nothing centred cares. Two things are hung off the LEFT and do:

| | Rule |
|---|---|
| The carousel | Its viewport is `frameWindow().visible`, not `frame[0]`. Centred on frame x 960 as before, which lands its left edge exactly on the screen's — `inset + visible / 2` is 960 whatever the window. Its gutter is on the left only; a trailing one is pointless on a row that is wider than its viewport by design. |
| The day's copy | Hangs off the screen's left edge, and **narrows** rather than sliding under the phone. `--day-l` and `--day-col` come from App.jsx and follow the window continuously. |

Two things make this work rather than fight the design:

**The gutter is a proportion of what can be seen**, not a fixed length. 148px on a 1920
frame is 7.7% of the width, and 7.7% is what it stays — a fixed 148 against a 1345px
window reads as a much wider margin than the design has.

**`DEVICE_LEFT - COPY_LEFT - COPY_CLEAR` is exactly 623** on a 16:9 window, which is the
widest block the day has (the pillar row's box). So the clamp is the identity at the
design aspect for every block including the widest, and `COPY_CLEAR = 28` is read off the
file — 148 + 623 is 771, and the phone starts at 799.

It lives in **CSS variables on the stage, not in the timeline.** The timeline is rebuilt
only when the breakpoint changes, so a number that has to follow the window continuously
cannot live in it.

## 6c. The partner band (Slide 17)

One box, on one slide. The file draws it on 17 and nowhere else, so it has to be
carried in and out rather than switched on — but what it must **not** do is
travel.

It moves at exactly the rate the rest of the fourth act moves: −63 into slide 17
and −670 out of it, the same two numbers the headline and the tabs take. The gap
between it and them is then constant — 138px to the headline, 234px to the tabs,
at every point in both steps — and it cannot cross them. What marks slides 16
and 18 is the **opacity**, not the position.

Parking it below the frame instead, which is where the carousel waits, gave it a
765px climb against the headline's 63, and it arrived by passing straight through
the headline and the tabs for most of the step. If a new element in an act does
not match that act's rise, it will cross something.

Everything inside it is positioned against **the band's own top-left** in frame
pixels and scaled by one number, `--bs`. One number rather than the usual two
projections, because the band travels as a single box: give the box the object
scale and its contents the chip convergence and they come apart on a phone,
exactly the way the day's two photo windows did (§4b).

It sits **behind the promo row** in the stack, which is what the file's own
choreography implies: the row slides up and left out of exactly the space the
band occupies, so what you see is the cards clearing off the band rather than the
band arriving on top of them.

**The logo row is tiled and it drifts.** The file centres one set of eight, 1581
wide in a 1920 band — which does not reach either edge, and a row that has to
scroll cannot have an end. So four copies are laid down starting one whole set
to the left of the file's position, which puts the *second* copy exactly on the
file's 169 when the drift is zero. The drift is a table like any other: +480 at
slide 16, 0 at 17, −480 at 18, so the logos move sideways for exactly as long as
the band is on screen.

A tiled row has a partial mark at each edge. `.partners__rail` masks both ends so
those fade rather than being cut, and the eight the file draws sit well inside
the mask — so the settled slide is still the file's own composition.

Figma also puts a `BACKGROUND_BLUR 60` on the band's wash. Skipped: one
`backdrop-filter` band gives a hard line where its box starts (§5), and over a
gradient this smooth there is nothing for it to soften.

---

### `overflow: clip`, never `hidden`, on `.layer`

`hidden` clips *and* makes the element a scroll container — an 11,800px-wide one here,
because the day's ruler is in it. A scroll container is something the browser will scroll
by itself to bring a focused control into view, so focusing a carousel tab whose pill
hangs past the frame edge slid the entire composition sideways by 124px, with nothing to
put it back. It was latent for as long as the pills were decoration. `clip` does not
scroll, so there is nothing to nudge.

---

## 7. Deliberate divergences from the file

Each of these is a decision, not drift. Change them only on purpose.

| Divergence | Why |
|---|---|
| The device sits more face-on than the Figma render | Legibility of the screen beats matching the picture. Riniel's call. |
| `backdrop-blur` on the nav is turned up (Figma has it at 0) | A static frame has nothing moving under it. This page does. |
| The hand starts fading earlier than the file implies | Explicit direction, with a reference frame. |
| Greycliff CF is referenced by `local()` only | **No licensed font files are redistributed.** Shipping this publicly needs a webfont licence and a `.woff2` in `public/fonts`. |
| No chevron on the nav items | The file's caret is a 16px box with an 8px gap, so showing it on hover reflowed the bar by 24px. |
| No dot on the active nav item | The file uses weight and the white pill alone. |
| The phone on slide 26 sits BELOW the Overlay | The file puts it above. The wash dissolving the device's foot is the point of slides 7–9, and one WebGL object cannot be in two layers. |
| The carousel control is taken to `opacity: 0` from slide 24, where the file holds it at 20% | Off the top of a 1920×1080 frame that 20% is invisible. A phone's frame is shorter and the y compression drags anything parked above it back down. Same reason the carousel itself is zeroed there. |
| The ruler holds y=106 on slide 32, where the file has 100 | A one-slide jog up and back is a twitch, not a move. **Flagged for a nudge in Figma.** |

### Two things in the file that are followed literally and look wrong

Both are almost certainly accidental nudges rather than intent. They are implemented as
the file has them, because the file is the source — but they are worth fixing there.

1. **The ruler runs backwards between slides 21 and 22.** Slide 21 puts it at x 5929.5 and
   slide 22 at 6125.5 — 196px to the *right*, which under a scrub is the clock ticking
   back about twenty minutes before carrying on. Every other step decreases.
2. **Slide 32's ruler sits 6px higher** than its neighbours on either side. This one is
   *not* followed — see the divergences table above.

---

## 8. How to verify a change

Screenshots lie here — the Browser pane returns stale frames, and when the pane is hidden
`requestAnimationFrame` is suspended, so **no GSAP tween renders at all** and the page
looks frozen. Two hours were lost to that on 2026-09-17. Measure instead:

1. Pull the Figma numbers by layer name for the slides you touched.
2. In the page, map each element's `getBoundingClientRect` back into frame pixels using
   `.stage`'s own rect, and read `getComputedStyle(el).opacity`.
3. Walk the slides with `st.scroll(st.start + (i / 22) * (st.end - st.start))`, then
   `st.update()` — needed on mobile, where there is no ScrollSmoother to force it.
4. Diff. On desktop the numbers should match Figma **exactly**.

To watch a tween with the pane hidden, advance `gsap.globalTimeline` by hand.

**Scrub lag is not a bug.** `st.scroll()` + `st.update()` needs ~1.2s to settle
at `scrub: 0.4`; measuring sooner reads the previous slide and looks like an
off-by-one in the data. `tl.progress(p).render(tl.time(), false, true)` is
synchronous but ScrollTrigger can re-assert from the scroll position, so for
anything load-bearing use `st.scroll` and wait.

### Checks worth re-running after any change

| What | How | Expected |
|---|---|---|
| Nav geometry | measure `.nav__pill`, `.nav__logo`, `.pnav`, `.nav__cta` | 954 / box 10–46, art 10.5–36.5 / x=127 w=641 / x=816 w=130 |
| Bar never reflows | hover all seven groups, measure the pill each time | 954 throughout |
| One active group | walk all 16 site routes, count `.pnav__group.is-within` | exactly 1 (0 on 404) |
| Card placement | open each dropdown, measure against the bar | gap 4, centre offset 0, width 294 |
| Pinned wash | walk all 34 slides, read `.wash`[1]'s y | 858 on every one |
| The day's hours | jump to 26/28/30/32/34, read the label under the marker | 7:00 / 9:00 / 12:00 / 14:00 / 16:00 |
| The shutter holds the image still | tween any transition, watch a fixed point in the photograph | it does not move |
| No screen flashes | scrub 26→34 slowly | only adjacent screens ever cross |
| Blur survives minification | grep the built CSS | 13 prefixed **and** 13 standard |
| **No blur is silently dead** | run the backdrop-root audit below | every row `ok` |
| Inner pages at 375 | walk all 23 routes | 0 overflow, 0 duplicated heroes, 0 fixed badges |
| The phone gets no Lottie | load at 375, watch the network | `gradient-bg-mobile.jpg` only, no `.json` |
| Desktop still gets it | load at 1280, count `.backdrop svg` | exactly 1 |
| Entry motion | diff each table's per-step y delta against the page rise | equal, except `DAY_MEDIA` 22→23 |

**The backdrop-root audit.** A `backdrop-filter` that does nothing looks
identical in DevTools to one that works, so this has to be run, not eyeballed.
For each filtering element it walks up to the **nearest** backdrop root and
reports whether that root actually contains anything to sample:

```js
const rootReasons = (el) => {
  const cs = getComputedStyle(el), wc = cs.willChange || '', r = []
  if (parseFloat(cs.opacity) < 1) r.push('opacity=' + cs.opacity)
  if (cs.filter !== 'none') r.push('filter')
  if (cs.maskImage && cs.maskImage !== 'none') r.push('mask')
  if (cs.clipPath && cs.clipPath !== 'none') r.push('clip-path')
  if (cs.isolation === 'isolate') r.push('isolation')
  if (/opacity|filter|mask|backdrop/.test(wc)) r.push('will-change:' + wc)
  if (/paint|content|strict/.test(cs.contain || '')) r.push('contain')
  return r
}
;[...document.querySelectorAll('*')]
  .filter((el) => (getComputedStyle(el).backdropFilter || 'none') !== 'none')
  .map((el) => {
    let n = el.parentElement, root = null, why = null
    while (n) { const r = rootReasons(n); if (r.length) { root = n; why = r; break } n = n.parentElement }
    const inside = root ? root.querySelectorAll('*').length - el.querySelectorAll('*').length - 1 : Infinity
    return {
      el: el.className,
      root: root ? root.className + ' [' + why.join(',') + ']' : 'document',
      verdict: inside <= 0 ? 'DEAD — nothing in the root to blur' : 'ok',
    }
  })
```

---

## 9. Open items

- **Mobile has no design.** Slides 17–36 are projected, not designed. The filter pill row
  is ~603px on a 375px screen even after scaling with `--ps` — the ends are cut off. It
  wants either a real mobile frame or a horizontally scrollable row. Flagged, not invented.
- **The 23 inner pages have no design either.** They are built in the sequence's visual
  language from `pura-website-upload-1.vercel.app`'s content, which is the only finished
  material that exists. Every block in `Sections.jsx` is meant to be replaced as real
  frames land.
- **The For Business form is a mailto.** The live site runs a Formidable form; a prototype
  should not collect anyone's details, so the CTA points at the address the form ends in.
- **Interactions beyond the carousel arrows** are still to come; Riniel is providing them.
- **The day's mobile layout is derived, not designed.** The copy is no longer hand-placed
  — `mobileStack()` measures it and the panel drop falls out of that — but the device's
  0.7 shrink, the 170px band top and the 18/26px gaps are still numbers that fit rather
  than numbers from a frame. A real mobile design would replace them.
- **Slides 24–34 have no interactions apart from the cursor tilt.** 34 is currently
  the end of the sequence.
- **Scene D's pillar row is hidden below 980px.** Wrapped into two rows it is ~90px
  tall and the band between the ruler and the panel is already carrying a three-line
  headline and a three-line paragraph, so it landed on the photograph. Dropped rather
  than overlapped; the paragraph above it already says the same four things. A real
  mobile frame would decide this properly.
- **The day's panel is centred on a phone, not parked right.** At its authored x it
  hung 149px off the edge with the subject of every photograph in the part you could
  not see. Centred it bleeds ±55px symmetrically, which reads as full-bleed.
- **Eight screen textures load up front** — the day's six plus Home and Pura AI — ~1.1MB and
  about 60MB of GPU memory, whether or
  not the visitor ever reaches slide 26. Deferring the four day screens until the carousel
  act is the obvious fix and has not been done.
- **The performance pass was built, then rolled back.** `a5cf93d` put the WebGL scene on
  `frameloop="demand"` (zero renders while idle), paused the gradient off-screen, halved
  the blur bands on a phone, capped mobile DPR and downsized the screen textures to 20MB.
  It was reverted in `2f7e31c` at Riniel's request, not because anything was found wrong
  with it. `git revert 2f7e31c` brings all of it back, reasoning included. The one part
  that was kept, separately, is the phone's still backdrop.
- **26 files under `public/assets/site/` are neither tracked nor ignored** — the `app/`,
  `icons/` and `partners/` subfolders. They reach production only because `vercel --prod`
  uploads the working directory rather than building from the repo, so a fresh clone would
  deploy without them. Nothing in `src/` references any of them; they look like leftovers
  from the inner-pages build. Commit them or delete them — but the repo is not currently a
  complete description of what is deployed.
- **Promo cards 3 and 4** still share the line "Give your mind the same attention".
  The tags now differ (Mental Wellness / Care) and the file has it that way, so the
  build follows it — but the body copy looks like placeholder waiting to be written.
- **The repo is private** because of the brand assets. Public visibility is Riniel's call.
- The bundle is over 500 kB — three.js and the model. Code-splitting is untouched.
