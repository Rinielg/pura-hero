# Pura — hero scroll prototype

The hero transition from `Pura Website → Final Website` in Figma, built as a
real page: slides 1–8 are eight moments of one scroll-driven sequence, and the
phone in the middle of it is the three.js device from
[pura-device-viewer](https://github.com/Rinielg/pura-device-viewer) rather than
the flat render the design uses as a placeholder.

The sequence is still growing. New slides go into `src/hero/frames.js` as extra
entries, not into new code: the scroll length, the step boundaries and the cue's
notion of "one moment forward" all derive from the slide count.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # static output in dist/ — deploy that folder anywhere
```

---

## The sequence

| Slide | What moves |
|---|---|
| 1 | At rest. Heading up top, twelve chips scattered across the frame, the device small and front-on at the bottom under a white wash. |
| 2 | The heading **dissolves** where it used to slide away — Figma moves it 50px and drops it to 40%. The cloud gathers inward, the device rotates into its 3/4 pose and grows. |
| 3 | The cloud keeps closing; chips behind the device start to fade. Device rises. |
| 4 | Chips are gone. Device at full size. The hand enters from below. |
| 5 | Device and hand settle toward each other; the white wash comes back. |
| 6 | The device lifts and grows again, the hand fades to 20%, and "A health companion that knows you" arrives at 40% **behind** the phone. |
| 7 | The device turns back to **face-on**, its screen crossfades from Home to Pura AI, the headline resolves and the agent bar appears. |
| 8 | The agent bar **widens** from 354 to 560 and the supporting paragraph slides in and resolves. The page ends here, holding this frame. |

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
 0  Lottie gradient
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
| `public/assets/pura-screen.jpg` | the app screen from Figma, on the model's display |
| `public/assets/hand.png` | Figma, with the wrist fade rebuilt as a CSS mask |
| `public/assets/icons/*.svg` | the twelve chips' duotone icons, exported from Figma |
| `public/assets/store-*.svg`, `pura-logo.svg` | Figma |
| `public/bg/*.json` | the supplied mesh-gradient Lottie |

## Notes

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
- **The navigation blur exceeds the file.** Figma has `backdrop-blur` on the nav
  pill at radius 0. A static frame has nothing moving underneath it to blur;
  this page does.
- **Mobile composition is a derivation, not a design.** Six of the twelve chips
  survive, the cloud converges harder, and the scroll cue drops its label. Those
  are judgement calls made to fit — the Figma file only covers 1920×1080.
