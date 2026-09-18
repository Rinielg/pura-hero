# Pura Hero — build context and updates

The running record of this prototype: what is built, why it is built that way, what
broke and how it was fixed. Read this before continuing the build. The README covers
how to run it; this file covers how to *reason* about it.

- **Design source:** [Pura Website](https://www.figma.com/design/1ybPUzTZG9WJ2dle6NfH2U/Pura-Website), page **Final Website**, frames `Slide 1` … `Slide 23`.
- **Live:** https://pura-hero.vercel.app · **Repo:** https://github.com/Rinielg/pura-hero (private — it carries PureHealth brand assets)
- **Device model:** forked from [Rinielg/pura-device-viewer](https://github.com/Rinielg/pura-device-viewer)

---

## 1. What the thing is

One scroll-driven sequence. Twenty-three Figma slides are twenty-three *moments*, and
scrolling scrubs a single GSAP timeline between them. There is no second section: the
page is the sequence, plus fixed page furniture (nav, store badges, scroll cue).

`Slide overview` in the Figma file is an assembly board, **not** a moment. Ignore it.
Everything comes from `Slide 1` … `Slide 23`, in numeric order.

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

## 3. Where things live

| File | What it owns |
|---|---|
| `src/hero/frames.js` | Every number from Figma. One exported table per animated thing. |
| `src/hero/useHeroTimeline.js` | The timeline. Turns tables into tweens. |
| `src/hero/layout.js` | Breakpoints and the four projections. |
| `src/App.jsx` | The layer stack, the DOM, and the `Carousel` component. |
| `src/Device.jsx` | The three.js phone: black finish, two screens, shader crossfade. |
| `src/styles.css` | All of it. No CSS modules, no Tailwind. |
| `tools/extract-frames.js` | Re-read the sequence from Figma. **Not** part of the build. |
| `src/main.jsx` | The routes. |
| `src/site/content.js` | Every word the inner pages say, and the IA mapping. |
| `src/site/Sections.jsx` | The blocks pages are assembled from. |
| `src/site/Pages.jsx` | The six pages, as arrangements of those blocks. |
| `src/site/Layout.jsx` | Nav + page + footer, for document routes. |
| `src/site.css` | The inner pages. Adds only; never touches the hero. |

### The layer stack (z-index)

```
0  backdrop        the gradient, which travels
1  back / copy     chips, hand, hero copy
2  canvas          the three.js device
3  front           wash, act-3 copy, cards
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
| 17 | Everything from the first three acts leaves together (a 434px rise). "Help for every part of your health." and the filter pills arrive. |
| 18–19 | The feature carousel. **Arrow-driven** — see §6. |
| 20–26 | The carousel holds the centre and rises. "See how Pura fits into one ordinary day.", the peach time ruler, and the media panel that *grows* from a 154×88 pill to 1152×659, then slides right and stands up at 26 so the phone can take the middle. |
| ~~20–23~~ | ~~The carousel holds the centre and rises, leaving left only at 23. "See how Pura fits into one ordinary day.", the time ruler, and the day's media panel, which *grows* rather than fades. |

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

Arrow-driven, as briefed: right arrow slides the set left, left arrow slides it right.

- Paging is **derived, not stored**: `overflow = rowW - frameW`, `pages` from `overflow / step`.
  Only `page` is state. Nothing to keep in sync.
- The row is tweened in a plain `useEffect`, not through the timeline — it is the one thing
  on the page that moves on a click rather than on scroll. It respects
  `prefers-reduced-motion` by tweening with `duration: 0`.
- `CAROUSEL_GEO` in `frames.js` holds the geometry; `CAROUSEL_ITEMS` holds the content.

---

## 7. Deliberate divergences from the file

Each of these is a decision, not drift. Change them only on purpose.

| Divergence | Why |
|---|---|
| The device sits more face-on than the Figma render | Legibility of the screen beats matching the picture. Riniel's call. |
| `backdrop-blur` on the nav is turned up (Figma has it at 0) | A static frame has nothing moving under it. This page does. |
| The hand starts fading earlier than the file implies | Explicit direction, with a reference frame. |
| Greycliff CF is referenced by `local()` only | **No licensed font files are redistributed.** Shipping this publicly needs a webfont licence and a `.woff2` in `public/fonts`. |

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

---

## 9. Open items

- **Mobile has no design.** Slides 17–23 are projected, not designed. The filter pill row
  is ~603px on a 375px screen even after scaling with `--ps` — the ends are cut off. It
  wants either a real mobile frame or a horizontally scrollable row. Flagged, not invented.
- **The six inner pages have no design either.** They are built in the sequence's visual
  language from pura.ai's content, which is the only finished material that exists. Every
  block in `Sections.jsx` is meant to be replaced as real frames land.
- **The For Business form is a mailto.** The live site runs a Formidable form; a prototype
  should not collect anyone's details, so the CTA points at the address the form ends in.
- **Slides 20–23 interactions** are still to come; Riniel is providing them.
- **Promo cards 3 and 4** still share the line "Give your mind the same attention".
  The tags now differ (Mental Wellness / Care) and the file has it that way, so the
  build follows it — but the body copy looks like placeholder waiting to be written.
- **The repo is private** because of the brand assets. Public visibility is Riniel's call.
- The bundle is over 500 kB — three.js and the model. Code-splitting is untouched.
