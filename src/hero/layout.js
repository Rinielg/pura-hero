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

import { FRAME } from './frames'

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
    /** Uniform scale for device + hand. */
    objScale: 1,
    objOffset: [0, 0],
    allChips: true,
  },
  mobile: {
    name: 'mobile',
    frame: [430, 932],
    // 0.235 puts the widest chip pair inside a 390px viewport with a gutter;
    // 0.8 keeps enough vertical spread that the cloud still reads as a cloud.
    chipK: [0.235, 0.8],
    // Pushed down. The heading needs three lines on a phone where it needs one
    // and a bit on desktop, and without this the top of the cloud lands inside
    // the sub-heading.
    chipOffset: [0, 58],
    chipScale: 0.62,
    // (932/1080) keeps the device the same share of frame height as the design
    // gives it; 0.7 then takes it down to something that leaves room for the
    // heading and the cloud on a phone, where a device at 113% of viewport
    // height is simply too much.
    objScale: (932 / 1080) * 0.7,
    // Raised, so the device is not sitting under the store badges by the time
    // it reaches its resting pose.
    objOffset: [0, -18],
    allChips: false,
  },
}

export const pickLayout = (width) => (width < 820 ? LAYOUTS.mobile : LAYOUTS.desktop)

/** Chip centre, in the layout's own frame pixels. */
export function projectChip([x, y], L) {
  return [
    L.frame[0] / 2 + (x - DESIGN_CX) * L.chipK[0] + L.chipOffset[0],
    L.frame[1] / 2 + (y - DESIGN_CY) * L.chipK[1] + L.chipOffset[1],
  ]
}

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
