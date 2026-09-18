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
  /**
   * What the screen shows, as an INDEX into `SCREEN_URLS` — and a fractional
   * one, because it is tweened. The renderer crossfades between the textures
   * either side of it, which is why that list's ORDER is load-bearing: two
   * slides more than one step apart would drag the crossfade through whatever
   * sits between them. `SCREEN_SEQ` is built so that never happens.
   */
  screen: 4,

  /**
   * How much of the pointer tilt to apply, 0 to 1. GSAP animates this from the
   * `DEVICE_TILT` table, so the effect belongs to a slide rather than to the
   * page: it eases in as slide 26 arrives and is absent everywhere else, where
   * the phone is following a scripted arc and has no business also reacting to
   * the mouse.
   */
  tilt: 0,

  /**
   * The pointer tilt itself, in degrees, ADDED to the pose's own rotation.
   *
   * These two are the one pair on this object GSAP never touches — the render
   * loop owns them, because they answer to the pointer rather than to scroll
   * position. Keeping them separate from `rx`/`ry` is what lets both sources
   * write a rotation without either having to know about the other.
   */
  tiltX: 0,
  tiltY: 0,
}

// A handle on the seam while developing, next to `window.__smoother`. Read it in
// the console to see what the timeline and the pointer are actually writing —
// "the phone is not tilting" and "the phone is tilting by 0.4 degrees because
// the cursor is sitting on top of it" look identical on screen.
if (import.meta.env.DEV) window.__device = deviceProxy
