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
| 20–23 | The carousel leaves left; "See how Pura fits into one ordinary day.", the time ruler, and the day's media panel, which *grows* rather than fades. |

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
- **Slides 20–23 interactions** are still to come; Riniel is providing them.
- **Card 2 and card 3** of the promo row both read "Give your mind the same attention"
  under a Mental Wellness tag. Worth confirming that is intentional in the file.
- **The repo is private** because of the brand assets. Public visibility is Riniel's call.
- The bundle is over 500 kB — three.js and the model. Code-splitting is untouched.
