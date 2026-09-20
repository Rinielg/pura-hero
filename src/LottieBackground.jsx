import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

const SOURCE = '/bg/gradient-bg-1-balanced-desktop.json'

/** The source is 480 frames at 24fps — a 20-second loop. We play the first 15
 *  seconds once and hold the frame we land on. */
const FPS = 24
const RUN_SECONDS = 15
const STOP_FRAME = FPS * RUN_SECONDS

/**
 * The supplied "Gradient BG 1 - Balanced Desktop" is a Lottie, not a still —
 * eight gradient blobs drifting across the frame. It renders as SVG (the shapes
 * are radial gradients, which SVG handles natively and cheaply) and is scaled to
 * cover the viewport the way `background-size: cover` would.
 *
 * It settles rather than loops: fifteen seconds of drift, then it stops on that
 * frame and stays there. Under prefers-reduced-motion it starts on the resting
 * frame instead of travelling to it.
 */
export function LottieBackground() {
  const host = useRef(null)

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: host.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: SOURCE,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice', // cover, not contain
        progressiveLoad: true,
      },
    })

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let finished = false
    let started = false
    // Two independent reasons to be stopped. Both have to be clear before it
    // runs again, or leaving a hidden tab would restart an off-screen gradient.
    let onScreen = true
    let tabVisible = !document.hidden

    const apply = () => {
      if (finished || !started) return
      if (onScreen && tabVisible) animation.play()
      else animation.pause()
    }

    // A handle while developing, next to `__device` and `__tl`: `__bg.running`
    // is the question this file exists to answer.
    if (import.meta.env.DEV) {
      window.__bg = {
        get running() {
          return started && !finished && !animation.isPaused
        },
        get state() {
          return { started, finished, onScreen, tabVisible, frame: Math.round(animation.currentFrame) }
        },
      }
    }

    const start = () => {
      if (reduced.matches) {
        // Same resting frame everyone else ends on, just without the journey.
        animation.goToAndStop(STOP_FRAME, true)
        finished = true
        return
      }
      started = true
      animation.playSegments([0, STOP_FRAME], true)
      apply()
    }

    const onComplete = () => {
      finished = true
    }

    animation.addEventListener('DOMLoaded', start)
    animation.addEventListener('complete', onComplete)
    reduced.addEventListener('change', start)

    /**
     * Stop drifting once the gradient has left the viewport.
     *
     * It does leave: the backdrop travels up and out with the first act, and
     * from roughly slide 10 there is nothing of it on screen. Eight animated
     * radial gradients the size of the viewport are the most expensive thing on
     * the page, and on a phone they were still being composited every frame
     * long after the last one had scrolled away.
     *
     * The observer is on the element itself rather than on a scroll position,
     * so it keeps working whatever the timeline does to the backdrop later.
     */
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        apply()
      },
      // A margin, so it is already running by the time any of it is on screen
      // rather than starting visibly late on the way back up.
      { rootMargin: '10% 0px' }
    )
    io.observe(host.current)

    // Pausing a hidden tab only matters while it is still moving; once it has
    // settled there is nothing to resume.
    const onVisibility = () => {
      tabVisible = !document.hidden
      apply()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      reduced.removeEventListener('change', start)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
      animation.destroy()
    }
  }, [])

  return <div className="backdrop" ref={host} aria-hidden="true" />
}
