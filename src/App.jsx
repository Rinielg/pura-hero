import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Scene } from './Scene'
import { LottieBackground } from './LottieBackground'
import { QUALITY } from './config'
import { AppStores, Nav } from './hero/Chrome'
import {
  CARD_CONTENT,
  CAROUSEL_GEO,
  CAROUSEL_ITEMS,
  CHIPS,
  HAND_ASPECT,
  MOBILE_CHIPS,
  PILL_LABELS,
  RULER_HOURS,
  scrollLength,
} from './hero/frames'
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
 *   Whatever comes after the hero can then scroll up over all of it by ordinary
 *   document flow, with no handoff to arrange. A pinned hero would need every
 *   fixed layer torn down at exactly the right scroll position instead.
 *
 * There is nothing after it yet: the document is the spacer and stops when the
 * sequence does, so the page ends holding its last frame. New scenes go in as
 * more slides in `frames.js` first, and as sections here only once they stop
 * being part of the sequence.
 */
/**
 * The white wash across the bottom.
 *
 * A single element with one `backdrop-filter` gives a hard horizontal line
 * where its box starts — the blur is either on or off, with nothing in between,
 * and against a smooth gradient that edge is the most visible thing on the
 * page. Figma's `BACKGROUND_BLUR 60` has no such edge because Figma ramps it.
 *
 * So the blur is built in layers instead: four bands of increasing radius, each
 * masked to fade in where the one before it is still weak. The result is a blur
 * that grows with depth rather than switching on, which is what the design
 * shows. The white gradient rides on top as its own layer.
 */
const Wash = ({ ref }) => (
  <div className="wash" ref={ref}>
    <div className="wash__blur wash__blur--1" />
    <div className="wash__blur wash__blur--2" />
    <div className="wash__blur wash__blur--3" />
    <div className="wash__blur wash__blur--4" />
    <div className="wash__tint" />
  </div>
)

/**
 * The feature carousel.
 *
 * Its position on the page is on the scroll timeline like everything else; what
 * is NOT on the timeline is the row inside it, which the two arrows drive. That
 * split is deliberate — slides 18 and 19 are identical in the Figma file, and
 * that stretch is where the page stops moving and hands control to the reader.
 * Putting the row on the timeline as well would have meant the scroll fighting
 * the arrows for the same transform.
 *
 * Paging is derived rather than authored: the row is as wide as its contents
 * and the viewport is the frame, so the number of pages falls out of how much
 * overflow there is at the current breakpoint. On a phone that is several
 * pages; on a wide desktop it is two, which is what the design's half-filled
 * pagination bar shows.
 */
function Carousel({ scale, frameW, innerRef, controlRef }) {
  const [page, setPage] = useState(0)
  const rowRef = useRef(null)

  const { rowPad, item, gap } = CAROUSEL_GEO
  const step = (item + gap) * scale
  const rowW = (rowPad * 2 + CAROUSEL_ITEMS.length * item + (CAROUSEL_ITEMS.length - 1) * gap) * scale
  const overflow = Math.max(0, rowW - frameW)
  const pages = Math.max(1, Math.ceil(overflow / step) + 1)
  const offset = Math.min(page * step, overflow)

  // Clamp if the breakpoint changed under us and there are fewer pages now.
  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1))
  }, [pages])

  // The row is the one thing on the page that moves on a click rather than on
  // scroll, so it is tweened here rather than tracked in the timeline. A plain
  // effect is enough: nothing else writes to this element, and the tween has to
  // outlive the render that made it.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.to(rowRef.current, {
      x: -offset,
      duration: reduced ? 0 : 0.55,
      ease: 'power3.out',
      overwrite: true,
    })
    return () => tween.kill()
  }, [offset])

  const go = (delta) => setPage((p) => Math.max(0, Math.min(pages - 1, p + delta)))

  return (
    <>
      <div className="carousel" ref={innerRef} style={{ width: `${frameW}px` }}>
        <div
          className="carousel__row"
          ref={rowRef}
          style={{ padding: `0 ${rowPad * scale}px`, gap: `${gap * scale}px` }}
        >
          {CAROUSEL_ITEMS.map((it, i) =>
            it.kind === 'photo' ? (
              <figure
                className="carousel__photo"
                key={i}
                style={{ width: `${item * scale}px`, height: `${CAROUSEL_GEO.photoH * scale}px` }}
              >
                <img src="/assets/carousel/lead.jpg" alt={it.alt} />
              </figure>
            ) : (
              <article className="feature" key={i} style={{ width: `${item * scale}px` }}>
                <div className="feature__panel" style={{ height: `${item * scale}px` }}>
                  <div className="feature__inner">
                    <span className="feature__label">{it.label}</span>
                    <strong className="feature__value">{it.value}</strong>
                    <span className="feature__caption">{it.caption}</span>
                    <span className="feature__bar">
                      <span style={{ width: `${it.fill * 100}%` }} />
                    </span>
                  </div>
                </div>
                <h3 className="feature__title">{it.title}</h3>
                <p className="feature__body">{it.body}</p>
              </article>
            )
          )}
        </div>
      </div>

      <div className="carousel-ctrl" ref={controlRef}>
        <button
          type="button"
          className="carousel-ctrl__arrow"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label="Previous"
        >
          <img src="/assets/icons/arrow-right.svg" alt="" />
        </button>
        <span className="carousel-ctrl__bar" role="presentation">
          <span style={{ width: `${100 / pages}%`, left: `${(page * 100) / pages}%` }} />
        </span>
        <button
          type="button"
          className="carousel-ctrl__arrow"
          onClick={() => go(1)}
          disabled={page >= pages - 1}
          aria-label="Next"
        >
          <img src="/assets/icons/arrow-right.svg" alt="" />
        </button>
      </div>
    </>
  )
}

export default function App() {
  const wrapperRef = useRef(null)
  const contentRef = useRef(null)
  const heroRef = useRef(null)

  const refs = {
    chips: useRef({}),
    hand: useRef(null),
    heading: useRef(null),
    headLine: useRef(null),
    subLine: useRef(null),
    kicker: useRef(null),
    body: useRef(null),
    bar: useRef(null),
    washA: useRef(null),
    washB: useRef(null),
    backdrop: useRef(null),
    act3Head: useRef(null),
    act3Body: useRef(null),
    act3Cta: useRef(null),
    cards: useRef(null),
    act4Head: useRef(null),
    act5Head: useRef(null),
    pills: useRef(null),
    carousel: useRef(null),
    carouselCtrl: useRef(null),
    timeline: useRef(null),
    timelineDot: useRef(null),
    dayMedia: useRef(null),
    greeting: useRef(null),
    greetingBody: useRef(null),
    deviceLayer: useRef(null),
    cue: useRef(null),
    cueLabel: useRef(null),
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
  // drifts away from the chips it is supposed to sit above. 205 is where
  // Figma's slide 1 puts the top of the heading.
  const copyTop = projectChip([960, 205], layout)[1]

  return (
    <>
      {/* The gradient sits in a stage of its own so it can travel in frame
          pixels like everything else. Plain white is behind it: from slide 10
          the first act scrolls away and what it uncovers is the page. */}
      <div className="layer layer--backdrop" aria-hidden="true">
        <div className="stage" style={stageStyle}>
          <div className="backdrop-travel" ref={refs.backdrop}>
            <LottieBackground />
          </div>
        </div>
      </div>

      <div className="device-layer" ref={refs.deviceLayer} aria-hidden="true">
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
            src="/assets/hand.webp"
            alt=""
            style={{ width: `${handW}px`, height: `${handW * HAND_ASPECT}px` }}
          />

          {/* The day's photo panel. It lives BEHIND the device and behind the
              wash, which is the order slide 26 has: panel, then Overlay, then
              the phone. Above the wash it had nothing to blur, and it covered
              the device outright. */}
          <figure className="day-media" ref={refs.dayMedia}>
            <img src="/assets/carousel/one-day.jpg" alt="A morning walk, tracked by Pura" />
          </figure>
        </div>
      </div>

      {/* The heading reads, so it is neither decorative nor aria-hidden. It is
          drawn in the back layer but kept in its own node so it stays in the
          accessibility tree and in the document's heading order. */}
      <div className="layer layer--copy">
        <div className="stage" style={stageStyle}>
          <div className="hero-copy" ref={refs.heading} style={{ top: `${copyTop}px` }}>
            <h1 ref={refs.headLine}>Your health, simplified.</h1>
            <p ref={refs.subLine}>
              Your wearables, medical history and lab results, together in one app.
            </p>
          </div>
        </div>
      </div>

      {/* The second act's copy. It sits BEHIND the device, which is the whole
          reason the kicker reads as arriving from somewhere: at 40% it is
          partly hidden by a phone that has not turned to face you yet. */}
      <div className="layer layer--copy">
        <div className="stage" style={stageStyle}>
          <h2 className="kicker" ref={refs.kicker}>
            A health companion that knows you
          </h2>
          <p className="body-copy" ref={refs.body}>
            Ask Pura AI anything. Every answer is built from your health records, lab
            results, and your history.
          </p>
        </div>
      </div>

      {/* -------------------------------------------- in front of the device */}
      {/* Two stacked washes, as Figma has them: one alone dissolves the foot of
          the device, both together clear enough room under it for the agent bar
          to sit on nothing. Purely decorative, so this layer is hidden. */}
      <div className="layer layer--front" aria-hidden="true">
        <div className="stage" style={stageStyle}>
          <Wash ref={refs.washA} />
          <Wash ref={refs.washB} />
        </div>
      </div>

      {/* In front of the wash, and this layer reads. It also carries the only
          controls inside the sequence — the carousel arrows — so it sits above
          the scroll wrapper rather than under it. */}
      <div className="layer layer--front layer--interactive">
        <div className="stage" style={stageStyle}>
          <h2 className="act3-head" ref={refs.act3Head}>
            One place for your whole health.
          </h2>
          <p className="act3-body" ref={refs.act3Body}>
            Pura brings your data, your doctors and your daily habits together, so
            every day adds up to a healthier life.
          </p>
          <div className="act3-cta" ref={refs.act3Cta}>
            <a href="#top">Why Pura</a>
            <a href="#top">How it works</a>
          </div>

          {/* Five cards, wider than the frame on purpose: slides 13 to 15 change
              nothing but this row's x, so the end of the page is a horizontal
              scroll driven by the vertical one. */}
          <div className="cards" ref={refs.cards}>
            {CARD_CONTENT.map((card) => (
              <article className="card" key={card.img}>
                <img
                  className={card.frame ? 'card__photo is-cropped' : 'card__photo'}
                  src={`/assets/cards/${card.img}.jpg`}
                  alt=""
                  style={
                    card.frame && {
                      width: `${card.frame.w}%`,
                      height: `${card.frame.h}%`,
                      left: `${card.frame.left}%`,
                      top: `${card.frame.top}%`,
                    }
                  }
                />
                <header className="card__head">
                  <span className="card__tag">
                    <img src={`/assets/icons/${card.icon}.svg`} alt="" />
                    {card.tag}
                  </span>
                </header>
                <footer className="card__foot">
                  <h3 className="card__title">{card.title}</h3>
                  <button type="button" className="card__more" aria-label={`More about ${card.title}`}>
                    <img src="/assets/icons/card-plus.svg" alt="" />
                  </button>
                </footer>
              </article>
            ))}
          </div>

          <h2 className="act4-head" ref={refs.act4Head}>
            Help for every part of your health.
          </h2>
          <div className="pills" ref={refs.pills} style={{ '--ps': layout.chipScale }}>
            {PILL_LABELS.map((label, i) => (
              <button type="button" className={i === 0 ? 'pill is-on' : 'pill'} key={label}>
                {label}
              </button>
            ))}
          </div>

          <Carousel
            scale={layout.cardScale}
            frameW={layout.frame[0]}
            innerRef={refs.carousel}
            controlRef={refs.carouselCtrl}
          />

          <h2 className="act5-head" ref={refs.act5Head}>
            See how Pura fits into one ordinary day.
          </h2>
          {/* 10,741px of ruler in Figma, drawn as 241 rectangles. Here it is a
              repeating gradient with the hours labelled over it. */}
          <div className="ruler" ref={refs.timeline} aria-hidden="true">
            {RULER_HOURS.map(([label, x]) => (
              <span key={label} style={{ left: `${x}px` }}>
                {label}
              </span>
            ))}
          </div>
          <span className="ruler-dot" ref={refs.timelineDot} aria-hidden="true" />
          {/* Slide 26: the day resolves into the app. The copy on the left says
              what the phone in the middle is showing. */}
          <div className="greeting" ref={refs.greeting}>
            <img src="/assets/pura-sparkle.png" alt="" width="32" height="32" />
            <p>Good morning, your health plan has kicked off.</p>
          </div>
          <p className="greeting-body" ref={refs.greetingBody}>
            Your Pura opens to one clear focus: a walk after lunch, a whole-grain swap and
            lights out by 11.
          </p>
          {/* The phone on slide 26 is the three.js device, brought back by
              DEVICE_POSE — not a picture of one. See DEVICE_FADE. */}

          <div className="agent-bar" ref={refs.bar}>
            <img className="agent-bar__mark" src="/assets/pura-sparkle.png" alt="" />
            <span className="agent-bar__label">Ask Pura anything</span>
            <span className="agent-bar__btn">
              <img src="/assets/agent-plus.svg" alt="" />
            </span>
            <span className="agent-bar__btn">
              <img src="/assets/agent-voice.svg" alt="" />
            </span>
          </div>
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
        <span className="cue__label" ref={refs.cueLabel}>{finished ? 'Back to top' : 'Scroll to explore'}</span>
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
          {/* Scroll length, and nothing else. Everything it drives lives in
              the fixed layers above, which is why this is empty — and why the
              page ends on the sequence's last frame rather than scrolling past
              it onto nothing. */}
          <div
            className="hero-spacer"
            ref={heroRef}
            style={{
              height: `${viewport.h + scrollLength(viewport.h, layout.name === 'mobile')}px`,
            }}
          />

        </div>
      </div>
    </>
  )
}
