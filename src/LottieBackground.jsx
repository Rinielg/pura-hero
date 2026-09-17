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
  }, [])

  return <div className="backdrop" ref={host} aria-hidden="true" />
}
