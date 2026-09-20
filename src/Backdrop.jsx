import { useEffect, useRef, useState } from 'react'
import { PHONE_MAX } from './hero/layout'
import lottie from 'lottie-web'

const SOURCE = '/bg/gradient-bg-1-balanced-desktop.json'

/**
 * The phone gets a still instead.
 *
 * Exported from the same Figma background, at 1320x2868 — the mobile frame's
 * own 1:2.17, so `cover` is an exact fit and nothing is cropped.
 */
const STILL = '/bg/gradient-bg-mobile.jpg'

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
 *
 * ON A PHONE none of that happens: `still` swaps the whole thing for a flat
 * export of the same background. Eight animated radial gradients at viewport
 * size are the most expensive thing on this page, and a phone has the least to
 * spend — so rather than animate them cheaply, it does not animate them at all.
 * The JSON is not fetched and lottie-web never runs.
 *
 * It works that out itself rather than taking it as a prop: this is rendered
 * both inside the hero, which knows its layout, and by `PageHero` on every
 * inner page, which does not. One media query against the same `PHONE_MAX` the
 * hero's `pickLayout` uses means the two can never disagree.
 */
function usePhone() {
  const query = `(max-width: ${PHONE_MAX - 1}px)`
  const [phone, setPhone] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setPhone(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return phone
}
export function Backdrop() {
  const host = useRef(null)
  const still = usePhone()

  useEffect(() => {
    // Nothing to load on a phone, and nothing to tear down. The JSON is never
    // fetched and lottie-web never builds the SVG — which is the point: the
    // cost was never the file, it was eight animated radial gradients the size
    // of the viewport being composited for as long as they were on screen.
    if (still) return

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

    const start = () => {
      if (reduced.matches) {
        // Same resting frame everyone else ends on, just without the journey.
        animation.goToAndStop(STOP_FRAME, true)
        finished = true
        return
      }
      animation.playSegments([0, STOP_FRAME], true)
    }

    const onComplete = () => {
      finished = true
    }

    animation.addEventListener('DOMLoaded', start)
    animation.addEventListener('complete', onComplete)
    reduced.addEventListener('change', start)

    // Pausing a hidden tab only matters while it is still moving; once it has
    // settled there is nothing to resume.
    const onVisibility = () => {
      if (finished) return
      if (document.hidden) animation.pause()
      else animation.play()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      reduced.removeEventListener('change', start)
      document.removeEventListener('visibilitychange', onVisibility)
      animation.destroy()
    }
  }, [still])

  if (still) return <div className="backdrop backdrop--still" aria-hidden="true" />
  return <div className="backdrop" ref={host} aria-hidden="true" />
}
