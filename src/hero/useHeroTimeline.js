import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useGSAP } from '@gsap/react'
import { deviceProxy } from '../deviceProxy'
import {
  ACT3_BODY,
  ACT3_CTA,
  ACT3_HEAD,
  AGENT_BAR,
  BACKDROP_Y,
  BODY_COPY,
  CARDS,
  CARD_ROW_W,
  CHIPS,
  COPY_HEAD,
  COPY_SUB,
  COPY_Y,
  DEVICE_POSE,
  HAND_FADE,
  HAND_POSE,
  KICKER,
  SCREEN_MIX,
  STEP_WEIGHTS,
  STEP_WINDOWS,
  WASH_A,
  WASH_B,
} from './frames'
import {
  DEVICE_REF_H,
  projectBottom,
  projectCards,
  projectChip,
  projectLength,
  projectObject,
} from './layout'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP)

/** Eight slides are seven moves between them. */
const STEPS = STEP_WEIGHTS.length

/**
 * Easing: none, everywhere.
 *
 * Not an omission. Every step is a slice of one continuous camera move, and
 * easing a slice independently makes its boundary a stop and a restart — felt
 * under a scrub as a stutter at each of the joins. The scrub's own smoothing
 * supplies all the softness the gesture needs.
 */
const EASE = 'none'

/**
 * The live trigger and smoother, so the scroll cue can drive the sequence.
 * Module-level rather than passed around: there is exactly one hero on the
 * page, and threading a ref to a button that just wants to say "next" costs
 * more than it explains.
 */
let activeTrigger = null
let activeSmoother = null

/** Is the sequence finished? The cue changes its mind at the end. */
export const atEnd = () => (activeTrigger?.progress ?? 0) > 0.97

/** Scroll to a point on the sequence, 0→1, and animate getting there. */
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

/** Where each step starts on a 0→1 timeline. */
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
 * Tracks with fewer entries than there are slides hold their last value.
 *
 * The chips stop moving five slides in and the rest of the sequence leaves them
 * where they are; clamping says that once, here, instead of repeating identical
 * rows in every table that happens to finish early.
 */
const at = (track, slide) => track[Math.min(slide, track.length - 1)]

/**
 * Builds the hero: a normalised 0→1 timeline scrubbed against the hero spacer,
 * inside a ScrollSmoother.
 *
 * Everything is rebuilt when the layout changes, because a breakpoint change
 * moves every target. That is a real teardown rather than a re-tween — GSAP
 * holds inline transforms on a couple of dozen elements, and reprojecting them
 * in place would leave the stale ones behind.
 */
export function useHeroTimeline({
  wrapperRef,
  contentRef,
  heroRef,
  refs,
  layout,
  reduced,
  onProgress,
}) {
  const smootherRef = useRef(null)

  useGSAP(
    () => {
      // ScrollTrigger snapshots history.scrollRestoration when it initialises
      // and re-applies it on every refresh, so setting that property directly
      // does nothing. This is the supported way to stop a reload dropping you
      // into the middle of the sequence.
      ScrollTrigger.clearScrollMemory('manual')

      // Smoothing is a desktop-only, full-motion-only affordance. On a phone it
      // fights the platform — native scroll is already inertial, and a JS
      // smoother on top makes the page feel detached from the finger. Under
      // reduced motion the added lag is the specific thing that makes people
      // ill. The sequence still runs in both cases; it is the page, not
      // decoration on it.
      const smoother =
        reduced || layout.name === 'mobile'
          ? null
          : ScrollSmoother.create({
              wrapper: wrapperRef.current,
              content: contentRef.current,
              smooth: 0.9,
              effects: false,
              // Keeps scrolling on the JS thread so the WebGL device and the
              // DOM around it can never be a frame apart. They are one
              // composition; a frame of drift between them is visible.
              normalizeScroll: true,
              smoothTouch: 0,
            })
      smootherRef.current = smoother
      activeSmoother = smoother
      if (import.meta.env.DEV) window.__smoother = smoother

      const L = layout
      const bounds = stepBounds()

      // Nothing is pinned. The hero's visuals are fixed layers already, and the
      // spacer below them is the only thing that scrolls — so the trigger just
      // measures that spacer. Pinning would insert a second spacer on top of
      // the one that already exists and double the hero's length.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          // Named explicitly rather than left to ScrollTrigger to infer.
          // Creating a ScrollSmoother makes its wrapper the default scroller,
          // and killing it does not put that back — so a viewport resize from
          // desktop to mobile tears down the smoother and leaves the new
          // trigger listening to an element that no longer scrolls. The page
          // then scrolls with nothing happening at all.
          scroller: smoother ? wrapperRef.current : window,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reduced ? true : 0.4,
          invalidateOnRefresh: true,
        },
      })

      /**
       * Lay one element's whole journey onto the timeline.
       *
       * `state(slide)` returns the tween vars for that moment. Every target is
       * written TWICE at slide 0 — once bare, once as a `tl.set`. They are not
       * redundant: a scrubbed timeline parked at progress 0 has never rendered,
       * so without the bare set the first paint is a dozen chips stacked in the
       * top-left corner and a device at the scene origin. The `tl.set` is what
       * makes scrubbing back to the top return to that state.
       */
      const track = (target, state, windows) => {
        if (!target) return
        gsap.set(target, state(0))
        tl.set(target, state(0), 0)
        for (let i = 0; i < STEPS; i++) {
          const span = bounds[i + 1] - bounds[i]
          const [from, to] = windows?.[i] ?? [0, 1]
          tl.to(
            target,
            { ...state(i + 1), duration: span * (to - from), ease: EASE },
            bounds[i] + span * from
          )
        }
      }

      /**
       * Blur in FRAME pixels, left exactly as Figma gives it.
       *
       * No projection: a filter is applied in the element's own coordinate
       * space and the stage's transform scales the result afterwards, so the
       * blur already tracks the breakpoint. Projecting it as well would scale
       * it twice and leave the copy nearly sharp on a phone.
       */
      const blur = (px) => `blur(${px}px)`

      // ---------------------------------------------------------------- chips
      // The -50%/-50% centring goes through GSAP rather than CSS so that GSAP
      // owns the element's transform outright. Mixing a CSS transform with
      // GSAP's x/y means one of them silently wins.
      for (const chip of CHIPS) {
        const el = refs.chips.current[chip.key]
        if (!el) continue // dropped at this breakpoint
        gsap.set(el, { xPercent: -50, yPercent: -50 })
        track(el, (slide) => {
          const { c, o } = at(chip.at, slide)
          const [x, y] = projectChip(c, L)
          return { x, y, opacity: o }
        })
      }

      // --------------------------------------------------------------- device
      track(deviceProxy, (slide) => {
        const pose = DEVICE_POSE[slide]
        const [fx, fy] = projectObject(pose.c, L)
        return {
          fx,
          fy,
          s: pose.s,
          rx: pose.r[0],
          ry: pose.r[1],
          rz: pose.r[2],
          screenMix: SCREEN_MIX[slide],
        }
      }, STEP_WINDOWS.device)

      // ----------------------------------------------------------------- hand
      // Laid out at its largest authored width and scaled down from there, so
      // its size animates on the compositor instead of through layout — a width
      // tween on a 476px image would reflow on every scrubbed frame.
      // Two tracks on one element: where it is, and whether you can see it.
      // They deliberately do not share timing — see STEP_WINDOWS.
      if (refs.hand.current) {
        gsap.set(refs.hand.current, { xPercent: -50, yPercent: -50 })
        const base = HAND_POSE[3].w
        track(refs.hand.current, (slide) => {
          const pose = HAND_POSE[slide]
          const [x, y] = projectObject(pose.c, L)
          return { x, y, scale: pose.w / base }
        })
        track(refs.hand.current, (slide) => ({ opacity: HAND_FADE[slide] }), STEP_WINDOWS.handFade)
      }

      // ------------------------------------------------------------ hero copy
      // One translate for the block, one opacity-and-blur track per line. The
      // heading dims as it softens; the sub-heading only softens. Figma treats
      // them differently and the difference is what stops the pair reading as a
      // single card being turned down.
      track(refs.heading.current, (slide) => ({ y: COPY_Y[slide] * L.chipK[1] }))
      track(refs.headLine.current, (slide) => ({
        opacity: COPY_HEAD[slide].o,
        filter: blur(COPY_HEAD[slide].b),
      }))
      track(refs.subLine.current, (slide) => ({
        opacity: COPY_SUB[slide].o,
        filter: blur(COPY_SUB[slide].b),
      }))

      // --------------------------------------------------------------- kicker
      if (refs.kicker.current) {
        gsap.set(refs.kicker.current, { xPercent: -50, yPercent: -50 })
        track(refs.kicker.current, (slide) => {
          const [x, y] = projectChip([960, KICKER[slide].y], L)
          return { x, y, opacity: KICKER[slide].o, filter: blur(KICKER[slide].b) }
        })
      }

      // ------------------------------------------------------------ body copy
      // Beside the device on a desktop, under the headline on a phone. There is
      // no room beside a device that already fills most of a 430px frame, and
      // the design's x position projects to somewhere off the left edge.
      if (refs.body.current) {
        gsap.set(refs.body.current, { xPercent: -50, yPercent: -50 })
        const mobile = L.name === 'mobile'
        track(refs.body.current, (slide) => {
          const [x, y] = mobile
            ? projectChip([960, KICKER[slide].y + 120], L)
            : projectChip(BODY_COPY[slide].c, L)
          return { x, y, opacity: BODY_COPY[slide].o, filter: blur(BODY_COPY[slide].b) }
        })
      }

      // ------------------------------------------------------------ agent bar
      // Width is the one thing here that genuinely has to animate through
      // layout: the bar is a pill with centred content, and faking the widening
      // with a scale would stretch the text and the two round buttons with it.
      if (refs.bar.current) {
        gsap.set(refs.bar.current, { xPercent: -50, yPercent: -50 })
        track(refs.bar.current, (slide) => {
          const [x, y] = projectBottom(AGENT_BAR[slide].c, L)
          return {
            x,
            y,
            width: projectLength(AGENT_BAR[slide].w, L),
            opacity: AGENT_BAR[slide].o,
          }
        })
      }

      // ----------------------------------------------------------- white wash
      // It travels now. Up to slide 9 it is page furniture pinned to the bottom
      // of the frame; from slide 10 it belongs to the scene that is leaving, so
      // it leaves with it.
      const washTrack = (el, table) =>
        track(el, (slide) => {
          const [, y] = projectChip([960, table[slide].y], L)
          return { y, opacity: table[slide].o }
        })
      washTrack(refs.washA.current, WASH_A)
      washTrack(refs.washB.current, WASH_B)

      // -------------------------------------------------------- the backdrop
      // Figma moves the gradient rectangle itself once the page starts scrolling
      // on, which is the file saying the first act is over. Plain white sits
      // behind it, so translating the layer is the whole effect.
      track(refs.backdrop.current, (slide) => ({
        y: projectChip([960, 540 + BACKDROP_Y[slide]], L)[1] - L.frame[1] / 2,
      }))

      // ------------------------------------------------------- the third act
      for (const [ref, table] of [
        [refs.act3Head, ACT3_HEAD],
        [refs.act3Body, ACT3_BODY],
      ]) {
        if (!ref.current) continue
        gsap.set(ref.current, { xPercent: -50, yPercent: -50 })
        track(ref.current, (slide) => {
          const [x, y] = projectChip(table[slide].c, L)
          return { x, y, opacity: table[slide].o, filter: blur(table[slide].b) }
        })
      }

      if (refs.act3Cta.current) {
        gsap.set(refs.act3Cta.current, { xPercent: -50, yPercent: -50 })
        track(refs.act3Cta.current, (slide) => {
          const [x, y] = projectChip(ACT3_CTA[slide].c, L)
          return { x, y, opacity: ACT3_CTA[slide].o }
        })
      }

      // The row is laid out at its projected width and moved by x, so the
      // horizontal scroll is a transform rather than a layout change.
      if (refs.cards.current) {
        gsap.set(refs.cards.current, {
          xPercent: -50,
          yPercent: -50,
          width: CARD_ROW_W * L.cardScale,
        })
        track(refs.cards.current, (slide) => {
          const [x, y] = projectCards(CARDS[slide].c, L)
          return { x, y, opacity: CARDS[slide].o }
        })
      }

      activeTrigger = tl.scrollTrigger

      // The cue stays for the whole sequence and changes its mind at the end.
      // Figma shows it on every slide, which a static frame has to — but a
      // control that still says "scroll to explore" at the last moment is
      // telling you to do something there is no more of.
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
