/**
 * The seam between GSAP and three.js.
 *
 * GSAP animates this plain object; the R3F render loop reads it and writes it
 * onto the device group. Neither side reaches into the other — GSAP never
 * touches a three.js Euler, and the scene never queries the DOM.
 *
 * Position is in FRAME pixels: the centre the device should appear at, in the
 * same coordinate space the DOM layer uses. That is deliberate. The device is
 * the only element of this composition that lives in WebGL, while everything it
 * has to stay aligned with — the chips it gathers, the hand it lands in, the
 * agent bar it ends up sitting behind — lives in the DOM. The one thing that
 * must never drift is the relationship between them, so both sides take the
 * same numbers and convert at the last possible moment.
 *
 * `s` is a multiple of DEVICE_REF_H rather than of the model's own units, so a
 * pose reads as "about twice the resting size" instead of as a number whose
 * meaning depends on how the GLB happened to be exported.
 *
 * Rotation is in degrees. The scene converts on apply.
 */
export const deviceProxy = {
  /** Centre, in frame pixels. */
  fx: 960,
  fy: 540,
  /** Multiple of DEVICE_REF_H. */
  s: 1,
  rx: 0,
  ry: 0,
  rz: 0,
  /** What the screen shows: 0 = Home, 1 = Pura AI. Crossfaded, not switched. */
  screenMix: 0,
}
