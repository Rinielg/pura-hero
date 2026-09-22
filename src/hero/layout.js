/**
 * Getting a 1920×1080 composition onto a phone.
 *
 * The hero is authored in one frame and every coordinate in `frames.js` is in
 * that frame's pixels. Rendering it elsewhere is a projection, done here and
 * nowhere else, so nothing downstream has to know which breakpoint it is on.
 *
 * Two projections, not one, and that distinction is the whole file:
 *
 *   - The device and the hand are projected UNIFORMLY. They are one physical
 *     arrangement — a phone above a hand — and compressing one axis more than
 *     the other, or pulling them toward the centre at different rates, breaks
 *     the thing the sequence is about. They scale together and keep their gap.
 *
 *   - The chips are projected with a SEPARATE, tighter convergence. They are a
 *     cloud, not an object: what matters is that they read as scattered and
 *     then gather. A 1350px-wide spread on a 390px screen is not scattered, it
 *     is off-screen, so on a phone the cloud is pulled in hard and two thirds
 *     of the chips are dropped rather than overlapped into mush.
 *
 * Desktop is the identity projection. Nothing is transformed at all there, so
 * the desktop render is exactly the Figma numbers.
 */

import { FRAME, PANEL_GAP } from './frames'

const DESIGN_CX = FRAME.w / 2
const DESIGN_CY = FRAME.h / 2

/**
 * Body height in frame pixels the device renders at when its pose scale is 1.
 * Every pose in `DEVICE_POSE` is a multiple of this, which keeps the poses
 * readable as ratios rather than as numbers that only mean something once you
 * know the model's units.
 */
export const DEVICE_REF_H = 630

export const LAYOUTS = {
  desktop: {
    name: 'desktop',
    frame: [FRAME.w, FRAME.h],
    /** Chip cloud convergence. 1 = exactly where Figma put it. */
    chipK: [1, 1],
    chipOffset: [0, 0],
    chipScale: 1,
    /** The carousel's tab pills. Separate from `chipScale` since the phone
     *  wants the cloud's chips at full size and the tab row shrunk. */
    pillScale: 1,
    /** Uniform scale for device + hand. */
    objScale: 1,
    objOffset: [0, 0],
    cardScale: 1,
    /** The air between the day's two photo windows mid-reveal. */
    panelGap: PANEL_GAP,
    allChips: true,
  },
  mobile: {
    name: 'mobile',
    frame: [440, 952],
    // Only the chips' MOTION now — slide 1 comes from `M_Slide 1` instead, and
    // these carry the travel away from it. See `projectChipAt`.
    chipK: [0.235, 0.8],
    // Pushed down. The heading needs three lines on a phone where it needs one
    // and a bit on desktop, and without this the top of the cloud lands inside
    // the sub-heading.
    chipOffset: [0, 58],
    // The file draws the cloud at FULL size on a phone — a 148-wide chip is 148
    // wide in both frames — and lets it run off both edges. That overflow is
    // the design: the cloud is bigger than the screen, which is what makes it
    // read as a cloud rather than as six labels.
    chipScale: 1,
    /** The tab pills do NOT follow it. At full size the row is 969 wide in a
     *  440 frame, which is the open item about the filter row, not a fix. */
    pillScale: 0.62,
    // (932/1080) keeps the device the same share of frame height as the design
    // gives it; 0.7 then takes it down to something that leaves room for the
    // heading and the cloud on a phone, where a device at 113% of viewport
    // height is simply too much.
    objScale: (952 / 1080) * 0.7,
    // Raised, so the device is not sitting under the store badges by the time
    // it reaches its resting pose.
    objOffset: [0, -18],
    // Cards keep a readable size rather than shrinking with the frame: at the
    // frame's own ratio each 376px card would land at 84px wide, which is a
    // thumbnail rather than a card. 0.74 puts them at about two thirds of a
    // phone's width, so one reads at a time and the row still scrolls.
    cardScale: 0.74,
    // Half the desktop gap. The panel is about a third of the size here, and
    // 16 projected down is not what a hairline between two photographs wants —
    // it is a number the design states rather than one that falls out of a
    // scale, which is why the pair is re-tiled into the panel box rather than
    // projected window by window.
    panelGap: 8,
    allChips: true,
  },
}

/**
 * The width below which this build is a phone.
 *
 * Exported because two unrelated trees need it — the hero, which picks a whole
 * layout from it, and the backdrop, which is rendered both inside the hero and
 * on every inner page and has to reach the same verdict either way.
 */
export const PHONE_MAX = 820

export const pickLayout = (width) => (width < PHONE_MAX ? LAYOUTS.mobile : LAYOUTS.desktop)

/**
 * Where a chip sits on a given slide.
 *
 * On desktop this is just `projectChip` of the pose. On a phone it is not a
 * projection at all for slide 1: `M_Slide 1` in the file gives the cloud its
 * own arrangement, which is NOT the desktop one squeezed — the chips keep their
 * full size and spill off both edges, and their positions do not fall out of
 * any convergence applied to the desktop ones.
 *
 * So the file's pose is the anchor and the desktop TRAVEL is what carries them
 * from it, converged by `chipK`. Slide 1 is then exactly the frame the designer
 * drew, and slides 2 onward keep the choreography that already worked — with no
 * jump between them, which taking the design for one slide and the projection
 * for the rest would give.
 */
export function projectChipAt(chip, pose, L) {
  if (L.name !== 'mobile' || !chip.mobile) return projectChip(pose.c, L)
  const first = chip.at[0].c
  return [
    chip.mobile[0] + (pose.c[0] - first[0]) * L.chipK[0],
    chip.mobile[1] + (pose.c[1] - first[1]) * L.chipK[1],
  ]
}

/** Chip centre, in the layout's own frame pixels. */
export function projectChip([x, y], L) {
  return [
    L.frame[0] / 2 + (x - DESIGN_CX) * L.chipK[0] + L.chipOffset[0],
    L.frame[1] / 2 + (y - DESIGN_CY) * L.chipK[1] + L.chipOffset[1],
  ]
}

/**
 * The device and the hand through the FIRST ACT on a phone.
 *
 * `M_Slide 1` draws the device at its design size — 298x614, the same numbers
 * the 1920 frame uses — placed at 219.8, 828 in a 440x952 frame. So the hero on
 * a phone is not the desktop composition scaled down at all: it is the same
 * objects, 1:1, re-anchored in a narrower frame, with the overflow clipped.
 *
 * That is a different projection from `projectObject`, which converges
 * everything by `objScale`, and it cannot simply replace it: `objScale` also
 * sizes the day's photo panel, and the day has no mobile frame. So this applies
 * only while the hero is the subject, and hands back over during slides 14-24 —
 * where `DEVICE_FADE` holds the device at zero and there is nothing on screen
 * for the handover to be seen in.
 *
 * The hand goes with it. It has no mobile frame either, but it and the device
 * are one physical arrangement — a phone above a hand — and projecting them
 * differently is the one thing this file exists to prevent.
 */
export const MOBILE_HERO_UNTIL = 14
const HERO_ANCHOR = [219.8, 828]
const HERO_FROM = [960, 928]

export const heroProject = ([x, y]) => [
  x - HERO_FROM[0] + HERO_ANCHOR[0],
  y - HERO_FROM[1] + HERO_ANCHOR[1],
]

/** True where the phone's first act uses its own 1:1 arrangement. */
export const inMobileHero = (L, slide) => L.name === 'mobile' && slide < MOBILE_HERO_UNTIL

/** Device or hand centre — the uniform projection. */
export function projectObject([x, y], L) {
  return [
    L.frame[0] / 2 + (x - DESIGN_CX) * L.objScale + L.objOffset[0],
    L.frame[1] / 2 + (y - DESIGN_CY) * L.objScale + L.objOffset[1],
  ]
}

/** A length that belongs to the device/hand arrangement. */
export const projectLength = (v, L) => v * L.objScale

/**
 * Something anchored to the BOTTOM of the frame, like the agent bar.
 *
 * Neither of the other two projections is right for it. The chip projection
 * carries the cloud's convergence and its downward offset, which on a phone
 * pushes the bar into the scroll cue; the object projection scales it with the
 * device, which is not what a piece of page furniture does. What the bar
 * actually wants is to keep its distance from the bottom edge, proportionally.
 */
/**
 * The promo card row: horizontal position scaled with the cards themselves.
 *
 * The row's whole point is that it is wider than the frame, so it cannot be
 * projected like the chip cloud (which converges) or like the device (which
 * scales with the viewport). It scales with the card size, which keeps the
 * distance the row travels proportional to how much of it you can see.
 */
export const projectCards = ([x, y], L) => [
  L.frame[0] / 2 + (x - DESIGN_CX) * L.cardScale,
  L.frame[1] / 2 + (y - DESIGN_CY) * L.chipK[1] + L.chipOffset[1],
]

export const projectBottom = ([x, y], L) => [
  L.frame[0] / 2 + (x - DESIGN_CX) * L.chipK[0],
  L.frame[1] - (FRAME.h - y) * (L.frame[1] / FRAME.h),
]

/**
 * How many CSS pixels one frame pixel is worth.
 *
 * Cover, not contain: the stage always fills the viewport and the overflow is
 * clipped, which is what keeps the gradient edge-to-edge and stops the
 * composition floating in letterbox bars at odd aspect ratios.
 */
export const stageScale = (vw, vh, L) => Math.max(vw / L.frame[0], vh / L.frame[1])

/**
 * How much of the frame the viewport can actually see, in frame pixels.
 *
 * The consequence of covering rather than fitting: on any window narrower than
 * the frame's own 16:9, the frame's left and right edges are off-screen. At a
 * 5:4 window that is about 290 frame pixels clipped off each side — enough to
 * take the whole of the day's copy column with it, and the first card of the
 * carousel.
 *
 * Nothing centred cares. Anything anchored to the LEFT of the frame does, and
 * `inset` is the number it needs: the frame x of the left edge of the screen.
 *
 * Deliberately NOT used to move the composition's centre. The phone, the wash
 * and the gradient all belong to the middle of the frame and stay there; it is
 * only the left-hung furniture that follows the edge.
 */
export function frameWindow(vw, vh, L) {
  const visible = Math.min(L.frame[0], vw / stageScale(vw, vh, L))
  return { visible, inset: (L.frame[0] - visible) / 2, k: visible / L.frame[0] }
}
