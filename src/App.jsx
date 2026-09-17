import { useEffect, useMemo, useRef, useState } from 'react'
import { Scene } from './Scene'
import { LottieBackground } from './LottieBackground'
import { QUALITY } from './config'
import { AppStores, Nav } from './hero/Chrome'
import { CHIPS, HAND_ASPECT, HEADING_Y, MOBILE_CHIPS, scrollLength } from './hero/frames'
import { pickLayout, projectChip, stageScale as computeStageScale } from './hero/layout'
import { advance, handBaseWidth, useHeroTimeline } from './hero/useHeroTimeline'

/**
 * Layers, bottom to top:
 *
 *    0  the Lottie gradient
 *    1  back    - chips and hand            (behind the device)
 *    2  canvas  - the device
 *    3  front   - white wash, scroll cue    (in front of the device)
 *    5  the scroll document                 (spacer, then the next section)
 *   10  navigation and store badges
 *
 * The visual layers are FIXED and the document is a spacer that scrolls past
 * them, rather than a pinned section containing everything. Two reasons, and
 * both are structural rather than stylistic:
 *
 *   The chips pass BEHIND the device and the white wash passes IN FRONT of it.
 *   Part of the composition has to be under the canvas and part over it, which
 *   one element cannot be.
 *
 *   The section after the hero then scrolls up over all of it by ordinary
 *   document flow, with no handoff to arrange. A pinned hero would need every
 *   fixed layer torn down at exactly the right scroll position instead.
 */
export default function App() {
  const wrapperRef = useRef(null)
  const contentRef = useRef(null)
  const heroRef = useRef(null)

  const refs = {
    chips: useRef({}),
    hand: useRef(null),
    heading: useRef(null),
    overlay: useRef(null),
    cue: useRef(null),
  }

  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))
  const [reduced, setReduced] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReduced(mq.matches)
    onMotion()
    mq.addEventListener('change', onMotion)
    return () => {
      window.removeEventListener('resize', onResize)
      mq.removeEventListener('change', onMotion)
    }
  }, [])

  const layout = useMemo(() => pickLayout(viewport.w), [viewport.w])
  const scale = computeStageScale(viewport.w, viewport.h, layout)

  // Chips a breakpoint does not show are not rendered at all rather than
  // hidden. The timeline skips any chip with no element, so dropping one is a
  // single entry in MOBILE_CHIPS and nothing else.
  const chips = useMemo(
    () => (layout.allChips ? CHIPS : CHIPS.filter((c) => MOBILE_CHIPS.has(c.key))),
    [layout]
  )

  useHeroTimeline({ wrapperRef, contentRef, heroRef, refs, layout, reduced, onProgress: setFinished })

  const stageStyle = {
    width: `${layout.frame[0]}px`,
    height: `${layout.frame[1]}px`,
    transform: `translate(-50%, -50%) scale(${scale})`,
  }
  const handW = handBaseWidth(layout)
  // The heading belongs to the flat layer, so it is projected with the chip
  // cloud's convergence rather than the device's uniform scale — otherwise it
  // drifts away from the chips it is supposed to sit above.
  const copyTop = projectChip([960, HEADING_Y[0]], layout)[1]

  return (
    <>
      <LottieBackground />

      <div className="device-layer" aria-hidden="true">
        <Scene layout={layout} stageScale={scale} quality={QUALITY} />
      </div>

      {/* ------------------------------------------------ behind the device */}
      <div className="layer layer--back" aria-hidden="true">
        <div className="stage" style={stageStyle}>
          {chips.map((chip) => (
            <div
              key={chip.key}
              className="chip"
              ref={(el) => {
                refs.chips.current[chip.key] = el
              }}
              style={{ '--cs': layout.chipScale }}
            >
              <img className="chip__icon" src={`/assets/icons/${chip.icon}.svg`} alt="" />
              <span className="chip__label">{chip.label}</span>
            </div>
          ))}

          <img
            className="hand"
            ref={refs.hand}
            src="/assets/hand.png"
            alt=""
            style={{ width: `${handW}px`, height: `${handW * HAND_ASPECT}px` }}
          />
        </div>
      </div>

      {/* The heading reads, so it is neither decorative nor aria-hidden. It is
          drawn in the back layer but kept in its own node so it stays in the
          accessibility tree and in the document's heading order. */}
      <div className="layer layer--copy">
        <div className="stage" style={stageStyle}>
          <div className="hero-copy" ref={refs.heading} style={{ top: `${copyTop}px` }}>
            <h1>Your health, simplified.</h1>
            <p>Your wearables, medical history and lab results, together in one app.</p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------- in front of the device */}
      <div className="layer layer--front" aria-hidden="true">
        <div className="stage" style={stageStyle}>
          <div className="wash" ref={refs.overlay} />
        </div>
      </div>

      {/* The cue is a control, not decoration: one click advances exactly one
          moment of the sequence, and at the end it turns around and goes back
          to the top. That makes the whole thing reviewable without a trackpad,
          and reachable by keyboard. */}
      <button
        type="button"
        className={finished ? 'cue is-end' : 'cue'}
        ref={refs.cue}
        onClick={advance}
      >
        <span className="cue__label">{finished ? 'Back to top' : 'Scroll to explore'}</span>
        <span className="cue__dot">
          <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
            <path
              d="M5.5 8 10 12.5 14.5 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <Nav />
      <AppStores />

      {/* ----------------------------------------------------- the document */}
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          {/* Scroll length, and nothing else. Everything it drives lives in the
              fixed layers above, which is why this is empty. */}
          <div
            className="hero-spacer"
            ref={heroRef}
            style={{
              height: `${viewport.h + scrollLength(viewport.h, layout.name === 'mobile')}px`,
            }}
          />

          <section className="after">
            <div className="after__inner">
              <span className="after__kicker">Where the hero hands off</span>
              <h2>The rest of the page starts here.</h2>
              <p>
                A stub, so the end of the sequence has somewhere to go. It scrolls
                up over the fixed layers by ordinary document flow, which is the
                whole reason the hero is built as fixed layers plus a spacer.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
