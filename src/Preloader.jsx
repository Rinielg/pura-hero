import { useEffect, useRef, useState } from 'react'
import { subscribe } from './preload'

/**
 * The loading screen, built to the file's `Loader` frame.
 *
 * Four things, and nothing else: the brand gradient, the PURA wordmark, a 392x4
 * track at 5% black, and the bar that fills it. The frame puts the wordmark's
 * box at 455-553 and the track at 621, which centres the pair on the frame
 * exactly — so this is a centred column with the file's 68px gap between them,
 * rather than two absolutely placed elements.
 *
 * The background is the frame's own flat export rather than the hero's Lottie.
 * The file draws it that way, and it means the loading screen does not start a
 * second copy of the most expensive thing on the page while the page is still
 * loading. It is the same artwork, so the cross-fade into the hero's animated
 * version is invisible.
 *
 * The bar reports real progress — see `preload.js`. It eases, because the
 * weights land in lumps and an unsmoothed bar jumps; it never fakes forward
 * motion it has not earned.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0)
  // Three states, not two: `done` starts the fade, `gone` unmounts. Unmounting
  // on `done` would cut the fade off at its first frame.
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const barRef = useRef(null)

  useEffect(() => subscribe((p, released) => {
    setProgress(p)
    if (p >= 1 || released) setDone(true)
  }), [])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), 700)
    return () => clearTimeout(t)
  }, [done])

  // Written straight to the node. This runs on every progress tick, and going
  // through React's style prop would re-render the whole overlay to move one
  // transform.
  useEffect(() => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
  }, [progress])

  if (gone) return null

  return (
    <div className={done ? 'preloader is-done' : 'preloader'} role="status" aria-label="Loading Pura">
      <div className="preloader__inner">
        <img className="preloader__mark" src="/assets/pura-wordmark.svg" alt="Pura" />
        <div
          className="preloader__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <span className="preloader__bar" ref={barRef} />
        </div>
      </div>
    </div>
  )
}
