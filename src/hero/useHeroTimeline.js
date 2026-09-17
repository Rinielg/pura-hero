import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useGSAP } from '@gsap/react'
import { deviceProxy } from '../deviceProxy'
import {
  CHIPS,
  COPY_EXIT,
  DEVICE_POSE,
  HAND_POSE,
  OVERLAY_O,
  STEP_WEIGHTS,
  WASH_EXIT,
} from './frames'
import { DEVICE_REF_H, projectChip, projectLength, projectObject } from './layout'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP)

/** The six slides are five moves between them. */
const STEPS = STEP_WEIGHTS.length

/**
 * The live trigger and smoother, so the scroll cue can drive the sequence.
 *
 * Module-level rather than passed around: there is exactly one hero on the
 * page, and threading a ref through to a button that just wants to say "next"
 * costs more than it explains.
 */
let activeTrigger = null
let activeSmoother = null

/** Is the sequence finished? The cue changes its mind at the end. */
export const atEnd = () => (activeTrigger?.progress ?? 0) > 0.97

/**
 * Scroll to a point on the sequence, 0→1, and animate getting there.
 *
 * This is what makes the cue a control rather than a label: one click advances
 * exactly one moment, so the sequence can be stepped through deliberately by
 * someone reviewing it, and reversed at the end without hunting for the top.
 */
export function goToMoment(progress = 0) {
  if (!activeTrigger) return
  const y = activeTrigger.start + progress * (activeTrigger.end - activeTrigger.start)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (activeSmoother) activeSmoother.scrollTo(y, !reduced)
  else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
}

/** One moment forward, or back to the start once the sequence has run. */
export function advance() {
  if (atEnd()) return goToMoment(0)
  const current = activeTrigger?.progress ?? 0
  goToMoment(Math.min(1, (Math.floor(current * STEPS + 0.01) + 1) / STEPS))
}

/**
 * Chips only have four authored states for six slides — by slide 4 they have
 * collapsed and faded out, and slides 5 and 6 leave them there. Clamping is
 * how that "and then nothing happens" is expressed without repeating rows.
 */
const chipAt = (chip, slide) => chip.at[Math.min(slide, chip.at.length - 1)]

/**
 * Where each step starts on a 0→1 timeline.
 *
 * Steps are weighted rather than equal (see STEP_WEIGHTS) so this has to be
 * derived, not assumed. Returning the boundaries as positions means every tween
 * below can be placed absolutely and the whole timeline stays a total duration
 * of 1 — which in turn makes `scrub` progress and timeline position the same
 * number, and makes the thing debuggable.
 */
function stepBounds() {
  const total = STEP_WEIGHTS.reduce((a, b) => a + b, 0)
  const at = [0]
  let acc = 0
  for (const w of STEP_WEIGHTS) {
    acc += w / total
    at.push(acc)
  }
  return at
}

/**
 * Easing: none, everywhere.
 *
 * Not an omission. Every step here is a slice of one continuous camera move,
 * and easing a slice independently makes its boundary a stop and a restart —
 * which under a scrub is felt as a stutter at each of the five joins. The
 * scrub's own smoothing supplies all the softness the gesture needs.
 */
const EASE = 'none'

/**
 * Builds the hero: a normalised 0→1 timeline scrubbed against the hero spacer,
 * inside a ScrollSmoother.
 *
 * Everything is rebuilt when the layout changes, because a breakpoint change
 * moves every target. That is a real teardown rather than a re-tween — GSAP is
 * holding inline transforms on a dozen elements, and reprojecting them in place
 * would leave the stale ones behind.
 */
export function useHeroTimeline({ wrapperRef, contentRef, heroRef, refs, layout, reduced, onProgress }) {
  const smootherRef = useRef(null)

  useGSAP(
    () => {
      // ScrollTrigger snapshots history.scrollRestoration when it initialises
      // and re-applies it on every refresh, so setting that property directly
      // does nothing. This is the supported way to stop a reload dropping you
      // into the middle of the sequence.
      ScrollTrigger.clearScrollMemory('manual')

      // Smoothing is a desktop-only, full-motion-only affordance.
      //
      // On a phone it fights the platform: native scroll is already inertial,
      // and layering a JS smoother on top makes the page feel detached from the
      // finger and breaks momentum handoff. Under reduced motion the added lag
      // is the specific thing that makes people ill. In both cases the sequence
      // still runs — it is the page, not decoration on it — just driven by the
      // browser's own scroll.
      const smoother =
        reduced || layout.name === 'mobile'
          ? null
          : ScrollSmoother.create({
              wrapper: wrapperRef.current,
              content: contentRef.current,
              smooth: 0.9,
              effects: false,
              // Keeps scrolling on the JS thread so the WebGL device and the
              // DOM chips can never be a frame apart. They are one composition;
              // a frame of drift between them is visible.
              normalizeScroll: true,
              smoothTouch: 0,
            })
      smootherRef.current = smoother
      activeSmoother = smoother
      // Lets the sequence be driven to an exact moment from the console, which
      // is how each step gets compared against its Figma slide.
      if (import.meta.env.DEV) window.__smoother = smoother

      const L = layout
      const bounds = stepBounds()

      // Nothing is pinned. The hero's visuals are fixed layers already, and the
      // spacer below them is the only thing that scrolls — so the trigger just
      // measures that spacer. Pinning here would insert a second spacer on top
      // of the one that already exists and double the hero's length.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reduced ? true : 0.4,
          invalidateOnRefresh: true,
        },
      })

      // Every target below is written twice: once with a bare `gsap.set`, and
      // once as a `tl.set` at position 0.
      //
      // They are not redundant. A SCRUBBED timeline parked at progress 0 has
      // never rendered — GSAP has not touched a single target yet — so without
      // the bare set the page's first paint is a dozen chips stacked in the
      // top-left corner and a device at the scene origin. The `tl.set` is what
      // makes scrubbing BACK to the top return to that state.
      //
      // ---------------------------------------------------------------- chips
      // The -50%/-50% centring goes through GSAP rather than CSS so that GSAP
      // owns the element's transform outright. Mixing a CSS transform with
      // GSAP's x/y means one of them silently wins.
      const chipEls = refs.chips.current
      for (const chip of CHIPS) {
        const el = chipEls[chip.key]
        if (!el) continue // dropped at this breakpoint
        gsap.set(el, { xPercent: -50, yPercent: -50 })

        const state = (slide) => {
          const { c, o } = chipAt(chip, slide)
          const [x, y] = projectChip(c, L)
          return { x, y, opacity: o }
        }

        gsap.set(el, state(0))
        tl.set(el, state(0), 0)
        for (let i = 0; i < STEPS; i++) {
          tl.to(
            el,
            { ...state(i + 1), duration: bounds[i + 1] - bounds[i], ease: EASE },
            bounds[i]
          )
        }
      }

      // --------------------------------------------------------------- device
      const devState = (slide) => {
        const pose = DEVICE_POSE[slide]
        const [fx, fy] = projectObject(pose.c, L)
        return { fx, fy, s: pose.s, rx: pose.r[0], ry: pose.r[1], rz: pose.r[2] }
      }

      Object.assign(deviceProxy, devState(0))
      tl.set(deviceProxy, devState(0), 0)
      for (let i = 0; i < STEPS; i++) {
        tl.to(
          deviceProxy,
          { ...devState(i + 1), duration: bounds[i + 1] - bounds[i], ease: EASE },
          bounds[i]
        )
      }

      // ----------------------------------------------------------------- hand
      // The hand element is laid out at its largest authored width and scaled
      // down from there, so its size animates on the compositor instead of
      // through layout — a width tween on a 476px image would reflow on every
      // scrubbed frame.
      const handEl = refs.hand.current
      if (handEl) {
        gsap.set(handEl, { xPercent: -50, yPercent: -50 })
        const base = HAND_POSE[3].w
        const handState = (slide) => {
          const pose = HAND_POSE[slide]
          const [x, y] = projectObject(pose.c, L)
          return { x, y, scale: pose.w / base }
        }
        gsap.set(handEl, handState(0))
        tl.set(handEl, handState(0), 0)
        for (let i = 0; i < STEPS; i++) {
          tl.to(
            handEl,
            { ...handState(i + 1), duration: bounds[i + 1] - bounds[i], ease: EASE },
            bounds[i]
          )
        }
      }

      // -------------------------------------------------------------- heading
      // It fades as it travels, and it is gone before the first step finishes.
      // Figma can only say where it moves to; a static frame has no way to
      // express "and by then you are not looking at it any more".
      //
      // The travel is a share of the frame rather than the design's flat 280px,
      // so a heading that wraps to three lines on a phone still clears itself.
      const headEl = refs.heading.current
      if (headEl) {
        gsap.set(headEl, { y: 0, opacity: 1 })
        tl.set(headEl, { y: 0, opacity: 1 }, 0)
        tl.to(
          headEl,
          {
            y: COPY_EXIT.y * L.frame[1],
            opacity: COPY_EXIT.opacity,
            duration: COPY_EXIT.duration * (bounds[1] - bounds[0]),
            ease: EASE,
          },
          0
        )
      }

      // -------------------------------------------------------------- overlay
      // One fade, shorter than a step. The wash belongs to the resting state,
      // so it should be gone well before the device has finished rising — not
      // hanging around dimming the phone it is meant to have handed over to.
      const overlayEl = refs.overlay.current
      if (overlayEl) {
        gsap.set(overlayEl, { opacity: OVERLAY_O[0] })
        tl.set(overlayEl, { opacity: OVERLAY_O[0] }, 0)
        tl.to(
          overlayEl,
          {
            opacity: 0,
            duration: WASH_EXIT.duration * (bounds[1] - bounds[0]),
            ease: EASE,
          },
          0
        )
      }

      activeTrigger = tl.scrollTrigger

      // The cue stays for the whole sequence and changes its mind at the end.
      // Figma shows it on every slide, which a static frame has to — but a
      // control that still says "scroll to explore" after you have reached the
      // last moment is telling you to do something there is no more of.
      if (onProgress) tl.eventCallback('onUpdate', () => onProgress(atEnd()))

      // The trigger has never been measured at this point — without this its
      // `end` never resolves and the scrub never fires. Fonts settle later than
      // layout and change the copy's height, so it is measured again then.
      ScrollTrigger.refresh()
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      if (import.meta.env.DEV) window.__heroTl = tl

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        smoother?.kill()
        smootherRef.current = null
        activeTrigger = null
        activeSmoother = null
      }
    },
    { dependencies: [layout, reduced], revertOnUpdate: true }
  )

  return smootherRef
}

/** Frame pixels the hand image is laid out at, before any scale tween. */
export const handBaseWidth = (L) => projectLength(HAND_POSE[3].w, L)

/** Frame pixels one unit of `deviceProxy.s` is worth. */
export const deviceRefHeight = (L) => projectLength(DEVICE_REF_H, L)
