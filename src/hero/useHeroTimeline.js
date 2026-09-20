import { useRef } from 'react'
import gsap from 'gsap'
import { invalidate } from '@react-three/fiber'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useGSAP } from '@gsap/react'
import { deviceProxy } from '../deviceProxy'
import {
  ACT3_BODY,
  ACT3_CTA,
  ACT3_HEAD,
  ACT4_HEAD,
  ACT5_HEAD,
  AGENT_BAR,
  BACKDROP_Y,
  BODY_COPY,
  CARDS,
  CARD_ROW_W,
  CAROUSEL,
  CAROUSEL_CTRL,
  CHIPS,
  FRAME,
  CUE_LABEL,
  COPY_HEAD,
  COPY_SUB,
  COPY_Y,
  DEVICE_FADE,
  DEVICE_POSE,
  DEVICE_TILT,
  DAY_PILLS,
  DAY_SCENES,
  PANEL_H,
  PANEL_TOP,
  DEVICE_FRONT_FROM,
  HAND_FADE,
  HAND_POSE,
  KICKER,
  PILLS,
  SCREEN_SEQ,
  STEP_WEIGHTS,
  STEP_WINDOWS,
  TIMELINE,
  TIMELINE_DOT,
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
 * The device layer's two z-indexes. Both are in `styles.css`'s stack: 2 is
 * between the chips and the wash, 4 is above the wash and below the one
 * interactive layer.
 */
const Z_DEVICE_BEHIND_WASH = 2
const Z_DEVICE_OVER_WASH = 4

/** Where the copy band starts on a phone, in FRAME pixels — clear of the ruler,
 *  which sits at y=106 and is 32 tall. */
const M_COPY_TOP = 170
/** Stage pixels between a headline and its paragraph... */
const M_COPY_GAP = 18
/** ...and between the bottom of the copy and the top of the panel. */
const M_PANEL_CLEAR = 26

/**
 * The phone's copy stack, measured once per layout.
 *
 * Returns, in STAGE pixels, where each scene's headline and paragraph sit, and
 * in FRAME pixels how far the panel and the device have to drop to stay out of
 * their way.
 *
 * Measured rather than tabled because the heights are a function of the copy,
 * and the copy changes: on a 430px phone frame the five headlines come out
 * 100, 130, 160, 130 and 160 tall. One constant cannot seat all five.
 *
 * The drop clears the TALLEST scene rather than each scene's own, or the panel
 * would shuffle up and down as the day went by.
 */
function mobileStack(L, project, refs) {
  if (L.name !== 'mobile') return null

  const top = project([960, M_COPY_TOP]).y
  // Stage pixels per frame pixel, read off the projection rather than assumed:
  // the chip projection converges, so it is not a plain scale.
  const perFramePx = (project([960, 100]).y - project([960, 0]).y) / 100

  let lowest = top
  const scenes = DAY_SCENES.map((_, i) => {
    const h = refs.heads.current[i]?.offsetHeight ?? 0
    const b = refs.bodies.current[i]?.offsetHeight ?? 0
    lowest = Math.max(lowest, top + h + M_COPY_GAP + b)
    return { head: top + h / 2, body: top + h + M_COPY_GAP + b / 2 }
  })

  // `project` for the object form. `projectChip` itself returns an ARRAY, and
  // reading `.y` off it gives undefined, which turns the drop into NaN and
  // every panel position with it — silently, because GSAP writes NaN without
  // complaining and the layer simply stops where it was.
  const panelTop = project([960, PANEL_TOP + PANEL_H / 2]).y - projectLength(PANEL_H, L) / 2
  const drop = Math.max(0, (lowest + M_PANEL_CLEAR - panelTop) / perFramePx)
  return { scenes, perFramePx, drop }
}

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
 * Read a track at a slide, holding the last value past its end.
 *
 * EVERY track goes through this, not just the ones that obviously stop early.
 * Slides keep being added to the Figma file, and the alternative is padding a
 * dozen tables by hand each time — which is the kind of chore that gets done
 * wrong once and then silently animates something to `undefined`.
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
          // Source of change #1 for the WebGL scene, which renders on demand.
          // The scrub is what moves `deviceProxy`, so every tick of it has to
          // ask for a frame — including the ones after the finger has stopped,
          // while the 0.4s scrub is still catching up. Note this is R3F's
          // `invalidate`, nothing to do with ScrollTrigger's
          // `invalidateOnRefresh` above.
          // Wrapped, NOT passed by reference: ScrollTrigger calls this with
          // itself as the first argument, and R3F reads its first argument as
          // a root state. `onUpdate: invalidate` type-checks, runs, and
          // silently renders nothing — the device simply freezes while you
          // scroll.
          onUpdate: () => invalidate(),
        },
      })

      // A handle on the timeline itself, so a slide can be rendered synchronously
      // in the console — `__tl.progress(n / 33)` — without waiting on the
      // scrub. Scrub lag and a genuinely wrong table look identical otherwise.
      if (import.meta.env.DEV) window.__tl = tl

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

      /**
       * Centre projection for anything that belongs to the flat copy layer —
       * headings, pills, rulers. They live with the chip cloud rather than with
       * the device, so they take the chip convergence and nothing else.
       */
      const project = (c) => {
        const [x, y] = projectChip(c, L)
        return { x, y }
      }

      // Measured once, and used by the device, the panel and the copy — all
      // three have to agree about how much room the words need.
      const stack = mobileStack(L, project, refs)
      const drop = stack ? stack.drop : 0
      if (import.meta.env.DEV) window.__stack = { stack, drop, layout: L.name, frame: L.frame }

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
        const pose = at(DEVICE_POSE, slide)
        // Slide 26 puts copy BESIDE the phone. A phone has no beside, so there
        // the device comes down in size and drops toward the foot of the frame,
        // which is what buys the copy a band above it. Desktop is untouched.
        const tight = L.name === 'mobile' && slide >= 25
        const scaled = tight
          ? { ...pose, s: pose.s * 0.7, c: [pose.c[0], pose.c[1] + drop] }
          : pose
        const [fx, fy] = projectObject(scaled.c, L)
        return {
          fx,
          fy,
          s: scaled.s,
          rx: scaled.r[0],
          ry: scaled.r[1],
          rz: scaled.r[2],
          // An INDEX into SCREEN_URLS, tweened. The renderer crossfades between
          // the two textures either side of it, so the list's order matters —
          // see the note on SCREEN_SEQ.
          screen: at(SCREEN_SEQ, slide),
          // The gate on the pointer tilt, not the tilt itself: the render loop
          // writes `tiltX`/`tiltY`, and this says how much of them counts.
          tilt: at(DEVICE_TILT, slide),
        }
      }, STEP_WINDOWS.device)

      // The gate on the device. It is one WebGL object that exists for the
      // whole sequence, so it is faded rather than mounted and unmounted —
      // which is also what makes its jump from off the top to slide 26's pose
      // invisible.
      if (refs.deviceLayer.current) {
        track(refs.deviceLayer.current, (slide) => ({ opacity: at(DEVICE_FADE, slide) }))

        // ...and the one moment it changes sides.
        //
        // Up to here the wash is over the phone on purpose: it dissolves its
        // foot, which is what makes the resting state read as settled rather
        // than cropped. From the day's first scene the phone is the subject, so
        // it comes forward and the wash blurs only the photograph behind it.
        //
        // This cannot be a track. A z-index has to be a whole number, and a
        // scrubbed tween would spend the whole step handing the browser
        // fractions to throw away. It is a `set` on a slide boundary instead —
        // placed one slide EARLY, where DEVICE_FADE still holds the device at
        // zero, so there is nothing on screen to see jump. Scrubbing back up
        // restores the old value on its own; that is what `set` does on a
        // timeline.
        gsap.set(refs.deviceLayer.current, { zIndex: Z_DEVICE_BEHIND_WASH })
        tl.set(
          refs.deviceLayer.current,
          { zIndex: Z_DEVICE_OVER_WASH },
          bounds[DEVICE_FRONT_FROM - 2]
        )
      }

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
          const pose = at(HAND_POSE, slide)
          const [x, y] = projectObject(pose.c, L)
          return { x, y, scale: pose.w / base }
        })
        track(refs.hand.current, (slide) => ({ opacity: at(HAND_FADE, slide) }), STEP_WINDOWS.handFade)
      }

      // ------------------------------------------------------------ hero copy
      // One translate for the block, one opacity-and-blur track per line. The
      // heading dims as it softens; the sub-heading only softens. Figma treats
      // them differently and the difference is what stops the pair reading as a
      // single card being turned down.
      track(refs.heading.current, (slide) => ({ y: at(COPY_Y, slide) * L.chipK[1] }))
      track(refs.headLine.current, (slide) => ({
        opacity: at(COPY_HEAD, slide).o,
        filter: blur(at(COPY_HEAD, slide).b),
      }))
      track(refs.subLine.current, (slide) => ({
        opacity: at(COPY_SUB, slide).o,
        filter: blur(at(COPY_SUB, slide).b),
      }))

      // --------------------------------------------------------------- kicker
      if (refs.kicker.current) {
        gsap.set(refs.kicker.current, { xPercent: -50, yPercent: -50 })
        track(refs.kicker.current, (slide) => {
          const [x, y] = projectChip([960, at(KICKER, slide).y], L)
          return { x, y, opacity: at(KICKER, slide).o, filter: blur(at(KICKER, slide).b) }
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
            ? projectChip([960, at(KICKER, slide).y + 120], L)
            : projectChip(at(BODY_COPY, slide).c, L)
          return { x, y, opacity: at(BODY_COPY, slide).o, filter: blur(at(BODY_COPY, slide).b) }
        })
      }

      // ------------------------------------------------------------ agent bar
      // Width is the one thing here that genuinely has to animate through
      // layout: the bar is a pill with centred content, and faking the widening
      // with a scale would stretch the text and the two round buttons with it.
      if (refs.bar.current) {
        gsap.set(refs.bar.current, { xPercent: -50, yPercent: -50 })
        track(refs.bar.current, (slide) => {
          const [x, y] = projectBottom(at(AGENT_BAR, slide).c, L)
          return {
            x,
            y,
            width: projectLength(at(AGENT_BAR, slide).w, L),
            opacity: at(AGENT_BAR, slide).o,
          }
        })
      }

      // ------------------------------------------- the fourth and fifth acts
      for (const [ref, table] of [
        [refs.act4Head, ACT4_HEAD],
        [refs.act5Head, ACT5_HEAD],
        [refs.pills, PILLS],
        [refs.carouselCtrl, CAROUSEL_CTRL],
        [refs.timelineDot, TIMELINE_DOT],
      ]) {
        if (!ref.current) continue
        gsap.set(ref.current, { xPercent: -50, yPercent: -50 })
        track(ref.current, (slide) => {
          const row = at(table, slide)
          return { ...project(row.c), opacity: row.o, filter: blur(row.b ?? 0) }
        })
      }

      // The carousel and the ruler are both far wider than the frame, so they
      // move on the x axis like the promo row rather than converging with the
      // chip cloud.
      for (const [ref, table] of [
        [refs.carousel, CAROUSEL],
        [refs.timeline, TIMELINE],
      ]) {
        if (!ref.current) continue
        gsap.set(ref.current, { xPercent: -50, yPercent: -50 })
        track(ref.current, (slide) => {
          const row = at(table, slide)
          const [x, y] = projectCards(row.c, L)
          return { x, y, opacity: row.o, filter: blur(row.b ?? 0) }
        })
      }

      // ------------------------------------------------------------- the day
      // Five photo panels stacked in one box.
      //
      // Scene A's grows rather than fades, out of a 154x88 pill, and its radius
      // grows with it so the shape stays a stadium instead of becoming a
      // rounded box. From slide 26 all five are shutters over the same fixed
      // box, and the difference is `ih`: where a row carries it the image keeps
      // its full panel height and is offset by however far the window's top has
      // drifted from the panel's — which is exactly the offset that holds the
      // image still while the window moves. Where `ih` is absent the image
      // fills its window, which is what scene A needs while it is still a pill.
      //
      // The two agree on slide 26, where the window IS the panel. That is what
      // makes the hand-off from filling to shuttering invisible.
      DAY_SCENES.forEach((scene, i) => {
        const el = refs.scenes.current[i]
        if (!el) return
        gsap.set(el, { xPercent: -50, yPercent: -50 })
        track(el, (slide) => {
          const row = at(scene.window, slide)
          // On a phone the panel is CENTRED rather than parked on the right of
          // the frame: there is no "right of the phone" at 375px, and left at
          // its authored x it hung 149px off the edge with the subject of every
          // photograph in the part you could not see. It also drops far enough
          // to clear the copy, which on a phone sits above it rather than
          // beside it.
          //
          // Keyed off the ROW, not off the slide number. `ih` is what marks a
          // row as one of the day's shutters, and every scene's window then
          // answers the same question the same way — where a `slide >= 25`
          // test had scene A's window answering it differently from scene B's
          // and leaving the panel 389 frame pixels high on slide 26 alone.
          const day = L.name === 'mobile' && row.ih != null
          const [x, y] = projectChip(day ? [960, row.c[1] + drop] : row.c, L)
          return {
            x,
            y,
            width: projectLength(row.w, L),
            height: projectLength(row.h, L),
            borderRadius: `${projectLength(row.r, L)}px`,
            opacity: row.o,
          }
        })

        // The image inside. Measured from the UNSHIFTED row, so the mobile drop
        // above moves the window and its image together and cancels out here.
        const img = el.querySelector('img')
        track(img, (slide) => {
          const row = at(scene.window, slide)
          const top = row.c[1] - row.h / 2
          return {
            height: projectLength(row.ih ?? row.h, L),
            y: projectLength(row.ih ? PANEL_TOP - top : 0, L),
          }
        })
      })

      // ----------------------------------------------------------- white wash
      // It travels now. Up to slide 9 it is page furniture pinned to the bottom
      // of the frame; from slide 10 it belongs to the scene that is leaving, so
      // it leaves with it.
      /**
       * The wash is anchored to the FRAME'S BOTTOM, so it takes the bottom
       * projection — not the chip cloud's.
       *
       * `projectChip` carries the cloud's convergence and its downward offset,
       * which on a phone put the band's top at 777 of a 932 frame and its
       * bottom at 999: sixty-seven pixels of it, including the whole solid end
       * of the gradient, hanging below the frame and clipped away. What was
       * left on screen was the weak top of the ramp, which reads as no wash at
       * all.
       *
       * Its HEIGHT has to be projected too. 222 frame pixels is 222 only when
       * the frame is 1080 tall; anywhere else the band has to shrink with the
       * frame or it overshoots the bottom again.
       */
      const washH = 222 * (L.frame[1] / FRAME.h)
      const washTrack = (el, table) => {
        if (!el) return
        gsap.set(el, { height: washH })

        // The band MOVES. It never fades — see the note on `.wash` in
        // styles.css: an opacity below 1 on this element would make it a
        // backdrop root and switch off the progressive blur inside it.
        track(el, (slide) => {
          const [, y] = projectBottom([960, at(table, slide).y], L)
          return { y }
        })

        // The fade goes on the children instead. On a `backdrop-filter`
        // element, its OWN opacity composites the already-filtered backdrop,
        // so each band dims exactly as it used to while keeping its blur.
        track(Array.from(el.children), (slide) => ({ opacity: at(table, slide).o }))
      }
      washTrack(refs.washA.current, WASH_A)
      washTrack(refs.washB.current, WASH_B)

      // -------------------------------------------------------- the backdrop
      // Figma moves the gradient rectangle itself once the page starts scrolling
      // on, which is the file saying the first act is over. Plain white sits
      // behind it, so translating the layer is the whole effect.
      track(refs.backdrop.current, (slide) => ({
        y: projectChip([960, 540 + at(BACKDROP_Y, slide)], L)[1] - L.frame[1] / 2,
      }))

      // ------------------------------------------------------- the third act
      for (const [ref, table] of [
        [refs.act3Head, ACT3_HEAD],
        [refs.act3Body, ACT3_BODY],
      ]) {
        if (!ref.current) continue
        gsap.set(ref.current, { xPercent: -50, yPercent: -50 })
        track(ref.current, (slide) => {
          const row = at(table, slide)
          const [x, y] = projectChip(row.c, L)
          return { x, y, opacity: row.o, filter: blur(row.b) }
        })
      }

      if (refs.act3Cta.current) {
        gsap.set(refs.act3Cta.current, { xPercent: -50, yPercent: -50 })
        track(refs.act3Cta.current, (slide) => {
          const [x, y] = projectChip(at(ACT3_CTA, slide).c, L)
          return { x, y, opacity: at(ACT3_CTA, slide).o }
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
          const [x, y] = projectCards(at(CARDS, slide).c, L)
          return { x, y, opacity: at(CARDS, slide).o }
        })
      }

      // -------------------------------------------------- slide 26's arrival
      // The greeting, its paragraph and the phone all belong to the flat copy
      // layer, so they take the chip cloud's convergence like everything else
      // written on the page.
      // The mobile lift, per element. They do not share one offset: the heading
      // is two lines and 30px tall on a phone, so the 110 frame pixels the file
      // leaves between it and its paragraph is not enough and the paragraph has
      // to drop a little further. Both land in the band between the ruler and
      // the top of the shrunken device.
      // The five pairs of copy, and scene D's pillar row.
      //
      // The file sets all of it flush LEFT of the phone, at x=148 in a 1920
      // frame. A phone has no room beside the device, so on mobile it is
      // centred over it instead and the widths come down in CSS — otherwise a
      // 487px block lands at x=-141 of a 375px screen. The same call the chip
      // cloud and the headings already make.
      //
      // Vertically it used to be two hand-set lifts, one for headlines and one
      // for paragraphs. That worked while every headline was two lines. Scene
      // C's is four on a phone, and its paragraph landed 14px inside it while
      // the headline itself clipped the ruler. Two constants cannot describe
      // five blocks of different lengths, and the next copy change would have
      // broken them again.
      //
      // So the phone MEASURES instead. Every headline hangs from the same line
      // under the ruler and its paragraph sits under whatever height that
      // headline turned out to be — which is just the stacking the desktop
      // frame does, done with the real numbers rather than assumed ones.
      for (const [list, key, box] of [
        [refs.heads, 'headAt', 'headBox'],
        [refs.bodies, 'bodyAt', 'bodyBox'],
      ]) {
        DAY_SCENES.forEach((scene, i) => {
          const el = list.current[i]
          if (!el) return
          gsap.set(el, { xPercent: -50, yPercent: -50 })
          // Where the table puts this block when it is settled. Every other row
          // is that, plus or minus one rise, so the difference carries the
          // entry and exit through to the measured position unchanged.
          const settled = scene[box][1] + scene[box][3] / 2
          track(el, (slide) => {
            const row = at(scene[key], slide)
            if (!stack) return { ...project(row.c), opacity: row.o, filter: blur(row.b ?? 0) }
            const seat = stack.scenes[i][key === 'headAt' ? 'head' : 'body']
            return {
              x: project([960, settled]).x,
              y: seat + (row.c[1] - settled) * stack.perFramePx,
              opacity: row.o,
              filter: blur(row.b ?? 0),
            }
          })
        })
      }

      // Scene D's pillar row is hidden on a phone — there is no room for it in
      // the band — so it only ever needs the file's own position.
      if (refs.dayPills.current) {
        gsap.set(refs.dayPills.current, { xPercent: -50, yPercent: -50 })
        track(refs.dayPills.current, (slide) => {
          const row = at(DAY_PILLS, slide)
          return { ...project(row.c), opacity: row.o, filter: blur(row.b ?? 0) }
        })
      }

      // ------------------------------------------------------------- the cue
      // Tracked rather than toggled, so scrolling back up brings the words
      // back on its own — a scrubbed timeline runs both ways.
      if (refs.cueLabel.current) {
        track(refs.cueLabel.current, (slide) => ({ opacity: at(CUE_LABEL, slide) }))
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
