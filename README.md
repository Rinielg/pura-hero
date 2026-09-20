# Pura — hero scroll prototype

The Pura website, built as a real page.

`/` is the hero transition from `Pura Website → Final Website` in Figma: **26
slides, one scroll-driven sequence**, with the three.js device from
[pura-device-viewer](https://github.com/Rinielg/pura-device-viewer) in the middle
of it rather than the flat render the design uses as a placeholder.

Behind the navigation sit **23 more routes** — the product pillars, the company
pages and the business pages — ordinary documents in the same visual language.

Two sources feed it, and they are not interchangeable:

| | Source |
|---|---|
| The sequence, and the navigation | Figma `Final Website` (slides 1–34) and the `Menu` frame, node `6203:71995` |
| Everything the inner pages say | `https://pura-website-upload-1.vercel.app` — **not** pura.ai, which is the older single-page site |

The sequence is still growing. New slides go into `src/hero/frames.js` as extra
entries, not into new code: the scroll length, the step boundaries and the cue's
notion of "one moment forward" all derive from the slide count.

**Read [CONTEXT.md](CONTEXT.md) before changing anything.** It carries the
coordinate system, the traps, and the checks worth re-running.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # static output in dist/ — deploy that folder anywhere
```

---

## The sequence

| Slides | What moves |
|---|---|
| 1 | At rest. Heading up top, twelve chips scattered across the frame, the device small and front-on at the bottom under a white wash. |
| 2–4 | The heading dissolves rather than slides — Figma moves it 50px and drops it to 40%. The cloud gathers inward and fades; the device rotates into its 3/4 pose, grows and rises. |
| 5–6 | The hand comes up to meet the device, then **fades in place** as the device lifts away. "A health companion that knows you" arrives at 40% behind the phone. |
| 7–8 | The device turns back to **face-on**, its screen crossfades from Home to Pura AI, and the agent bar appears then widens from 354 to 560. |
| 9–10 | The whole first act starts travelling up and out — device, wash and gradient backdrop together. What it uncovers is plain white. The second act's copy softens away as "One place for your whole health." rises from below. |
| 11–12 | The third act resolves: headline, paragraph, two pills, and a five-card promo row entering from the right. |
| 13–15 | Nothing moves but the card row's x. The last stretch of the page is a **horizontal** scroll driven by the vertical one. |
| 16–19 | The first three acts leave together. "Help for every part of your health.", the filter pills, then the arrow-driven feature carousel. |
| 20–25 | "See how Pura fits into one ordinary day.", the peach time ruler, and the media panel growing from a 154×88 pill. The device returns at 25, rising from below the frame — and from here it draws **in front of** the wash rather than under it. |
| 24–34 | The file stops drawing the navigation here and moves everything up 80px into the space. The build **keeps** the bar — it hides itself on the way down anyway. |
| 26–34 | **The day.** Five scenes joined by four transitions: a settled slide changes the photograph, the copy, the phone's screen and the hour on the ruler; the transition between two of them changes only the photograph, which splits the panel in half and reveals the next scene from the bottom. The phone stays put throughout and follows the cursor. |

`Slide overview` in Figma is an assembly board rather than a moment in the
sequence, and is deliberately ignored — it does not show the whole site.

Figma's slides get **rebuilt** rather than edited: every node id changed between
revisions. Nothing here matches a node by id. `tools/extract-frames.js` is the
plugin snippet that re-reads the sequence by layer name; paste it into the Figma
console after a design change rather than re-deriving anything by hand.

## How it is put together

**The numbers are the design's — except where they are deliberately not.**
`src/hero/frames.js` holds every chip and hand position measured straight out of
the Figma file, in that frame's own pixels. Two things diverge on purpose and
say so in place: the device's 3/4 pose is more face-on than the reference render
(so the app UI stays readable through the whole sequence) and sits about 2.7% of
the viewport width left of centre.

**Layers, bottom to top.** The chips pass *behind* the device and the white wash
passes *in front* of it, so the composition cannot be one element:

```
 0  mesh gradient — Lottie on desktop, a still on a phone
 1  chips, hand, heading      (fixed)
 2  WebGL canvas — the device (fixed)
 3  white wash, scroll cue    (fixed)
 5  the scroll document       — a spacer, then the next section
10  navigation, store badges
```

The visual layers are fixed and the document is a spacer that scrolls past
them. Nothing is pinned. The section after the hero then scrolls up over
everything by ordinary document flow, with no handoff to arrange.

**One constant rate, not five animations.** The five steps are equally
weighted and linear, and the whole sequence is 2.5 viewport heights (floored at
1800px). Weighting and easing each step reads well in isolation and badly under
a scrub, because every join becomes a stop and a restart. The scrub's own
smoothing supplies all the softness the gesture needs — 0.4 on the scrub, 0.9 on
the smoother, and no smoother at all on mobile or under reduced motion, where a
JS layer on top of native inertia only fights the platform.

**One seam between GSAP and three.js.** GSAP animates `src/deviceProxy.js`, a
plain object holding a centre in *frame pixels* and a size as a multiple of a
reference height. The render loop reads it and converts. Because the DOM stage
and the device take the same numbers through the same scale, the phone stays
glued to the chip cloud at every viewport with no per-breakpoint fudging.

**Two projections, not one** (`src/hero/layout.js`). The device and the hand are
projected uniformly — they are one physical arrangement and keep their gap. The
chips get a separate, tighter convergence, because a 1350px-wide spread on a
390px screen is not "scattered", it is off-screen. Desktop is the identity
projection: it renders the Figma numbers exactly.

**The device pose is fitted, not eyeballed.** The reference render's alpha
channel gives the phone's silhouette in design pixels; a least-squares search
over rotation and scale matched the model's projected corners to it to about
12px RMS. A silhouette alone is ambiguous for a box, so the fit was
disambiguated against what the render actually shows — the right-hand rail
toward the camera, the top edge leaning right, a sliver of the bottom edge.
The result lands within 1.5% of the reference on both axes.

## Assets

| Path | Source |
|---|---|
| `public/models/iphone-18-pro.glb` | pura-device-viewer |
| `public/assets/pura-screen.jpg`, `pura-ai-screen.jpg` | the first two app screens from Figma, on the model's display |
| `public/assets/day/ui-*.jpg` | the four screens the phone shows through the day (slides 28–34) |
| `public/assets/day/scene-*.jpg` | the day's four photo panels, exported from the Figma frames |
| `public/assets/hand.webp` | Figma, cropped from the source by its CROP transform, with the wrist fade rebuilt as a CSS mask |
| `public/assets/icons/*.svg` | the twelve chips' duotone icons, exported from Figma |
| `public/assets/store-*.svg`, `pura-logo.svg` | Figma |
| `public/bg/*.json` | the supplied mesh-gradient Lottie (desktop) |
| `public/bg/gradient-bg-mobile.jpg` | the same background as a still, for phones |

## Notes

- **The hand fades in place.** Figma's later slides drift it around while it
  fades, but on a page those few pixels of travel read as the hand being dragged
  off rather than letting go. It holds its resting pose and only opacity moves.
- **The backdrop travels.** From slide 10 Figma moves the gradient rectangle
  itself, which is the file saying the first act is over. The gradient layer
  translates and the page shows through beneath it — white, by design.
- **The cards are real markup over the raw photos.** Tag, title and + button are
  live elements; the photos carry only the photograph. Three are a plain cover
  crop and two are framed by a Figma CROP transform — a window onto the source
  rather than a fit — so those two carry explicit width/left/top percentages
  derived from that matrix.
- **Copy blurs as it fades.** Figma puts `LAYER_BLUR` on every piece of text at
  the moment it drops back — 8px on a heading, 4px on a sub-heading that keeps
  its opacity. That is what makes copy read as receding rather than as being
  turned down, and the two lines are animated separately because Figma does not
  treat them the same.
- **The white wash is a progressive blur, not one.** A single `backdrop-filter`
  draws a hard horizontal line where its box starts; the blur is on or off with
  nothing in between. Four masked bands of increasing radius ramp it instead,
  which is what `BACKGROUND_BLUR 60` looks like in Figma.
- **The hand lets go before the device leaves.** Step 5→6 is the one step whose
  parts are deliberately out of phase: the hand fades over the first 55%, the
  device climbs over the last 55%. Simultaneous reads as the phone escaping;
  staggered reads as it being released. `STEP_WINDOWS` in `frames.js`.
- **The screen shows two things.** Home for slides 1–6, Pura AI for 7–8, mixed
  in the emissive fragment rather than swapped. The device is turning from a 3/4
  view to face-on while the content changes and at no point is the screen hidden
  enough to hide a cut, so a one-line `mix()` is the only way it reads as the
  screen updating rather than as a glitch.
- **The device is black.** It reads as one dark mass against the cream gradient,
  which makes the lit screen the brightest thing on the page. The finish is one
  constant in `src/Device.jsx` — `variants.json` also carries Plum, Silver and
  Sky Blue.
- **The screen opts out of tone mapping.** ACES is right for a mirrored titanium
  rail and wrong for a display, which is a source rather than a lit surface. Run
  the UI through it and the whites roll to grey. Excluding the one material keeps
  the app screen at its designed values while the phone around it stays filmic.
- **The scroll cue is a control.** One click advances exactly one moment; at the
  end it turns around and returns to the top. That makes the sequence reviewable
  without a trackpad, and reachable by keyboard.

## Known gaps

- **Greycliff CF is referenced by `local()` only.** It is a licensed desktop
  font, so no file is redistributed here: anyone with it installed sees the real
  face, everyone else falls through to Figtree. Shipping publicly with the brand
  face needs a webfont licence and the `.woff2` files dropped into
  `public/fonts` — nothing else has to change.
- **A phone never gets the Lottie.** Below 820px the mesh gradient is a flat
  export of the same background rather than eight animated radial gradients.
  The JSON is not fetched and lottie-web never runs. It is the same image on
  every phone, so the drift the desktop build opens with is simply absent there
  — a deliberate trade for a page that has a 3D device to spend its budget on.
- **The navigation blur exceeds the file.** Figma has `backdrop-blur` on the nav
  pill at radius 0. A static frame has nothing moving underneath it to blur;
  this page does.
- **The cursor tilt is not in the file either.** A static frame cannot express
  it. 18° of yaw and 12° of pitch, gated to slides 26–34 by `DEVICE_TILT`, and
  off entirely under `prefers-reduced-motion` or on a touch screen.
- **Scene D's pillar row is dropped below 980px**, and the day's panel is centred
  rather than parked on the right. Both are derivations — there is no mobile
  frame for slides 26–34 any more than for the rest of the sequence. The copy
  itself is no longer a derivation: it is measured and stacked at build time,
  so it survives a copy change.
- **Slide 26's paragraph is moved 80px up from where the file leaves it**, to
  match the same paragraph on slide 27. Everything else on that slide got the
  shift when the navigation came out; this one element did not.
- **All six phone screens load up front** (~680KB, ~45MB of GPU memory), whether
  or not the visitor reaches the day. They should be deferred until the carousel
  act.
- **Never put `opacity` in a `will-change` above a `backdrop-filter`.** It makes
  that element a backdrop root and the blur inside it silently stops sampling
  anything — no error, and the computed style still looks correct. It cost the
  Overlay its entire progressive blur until 2026-09-18. There is an audit for it
  in `CONTEXT.md` §8; run it after any change that touches blur.
- **The day on a phone is derived, not designed.** The copy sits beside the device
  in the file and above it here, with the device and panel dropped to make room.
  The copy itself is measured at build time now, so it survives a copy change —
  but the device's 0.7 shrink and the band's own margins are still numbers that
  fit rather than numbers from a frame.
- **Mobile composition is a derivation, not a design.** Six of the twelve chips
  survive, the cloud converges harder, and the scroll cue drops its label. Those
  are judgement calls made to fit — the Figma file only covers 1920×1080. The
  same applies to the 23 inner pages: there are no Figma frames for them, so
  every block is built to be replaced when real designs land.
- **The inner pages' filter pill row overflows on a phone.** ~603px of pills on a
  375px screen even after scaling. It wants a real mobile frame or a scrollable
  row rather than an invented one.
- **The For Business and Support forms are `mailto:` links.** The source site
  runs real forms; a prototype should not collect anyone's details.
- **A performance pass was built and then rolled back.** `a5cf93d` put the WebGL
  scene on demand, paused the gradient off-screen, halved the blur bands on a
  phone and downsized the textures; `2f7e31c` reverted it at Riniel's request.
  `git revert 2f7e31c` brings it back. The phone's still backdrop is the one
  piece kept, and it was done separately.
- **26 files under `public/assets/site/` are untracked.** They reach production
  only because `vercel --prod` uploads the working directory rather than building
  from the repo. Nothing references them, but a fresh clone would deploy without
  them — so the repo is not a complete description of what is live.

## Routes

`/` is the sequence. Everything else is a document:

```
/health  /health/biomarkers  /health/purescore  /health/goals
/care    /care/online-doctor /care/pharmacy     /care/lab-tests  /care/care-plans
/well    /well/challenges    /well/fitcoins     /well/rewards
/pura-ai
/why-pura  /mission  /about  /trust
/for-business  /partners
/education  /support  /legal
```

Routes are **generated from `PAGES` in `src/site/content.js`**, so a dropdown
entry without a page cannot silently 404. `vercel.json` carries the SPA rewrite
that makes direct loads and refreshes work.
