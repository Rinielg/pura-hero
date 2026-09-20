import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Scene } from './Scene'
import { Backdrop } from './Backdrop'
import { QUALITY } from './config'
import { AppStores, Nav } from './hero/Chrome'
import {
  CARD_CONTENT,
  CAROUSEL_GEO,
  CAROUSEL_TABS,
  CHIPS,
  COPY_CLEAR,
  COPY_LEFT,
  DEVICE_LEFT,
  DAY_PILL_GAP,
  DAY_PILL_LABELS,
  DAY_PILL_ROW_W,
  DAY_SCENES,
  HAND_ASPECT,
  MOBILE_CHIPS,
  PARTNER_BAND,
  PARTNER_LOGOS,
  PARTNER_SETS,
  PARTNER_SET_W,
  PILL_LABELS,
  RULER_HOURS,
  scrollLength,
} from './hero/frames'
import {
  frameWindow,
  pickLayout,
  projectChip,
  stageScale as computeStageScale,
} from './hero/layout'
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
 * The partner band on slide 17.
 *
 * Everything in it is positioned against the band's own top-left in frame
 * pixels and scaled by one number, `--bs`. One number rather than the usual two
 * projections because the band travels as a single box: if the box took the
 * object scale and its contents took the chip convergence, they would come
 * apart on a phone exactly the way the day's two photo windows did.
 *
 * The row is TILED — four copies of the eight marks, laid down starting one
 * whole set to the left of where the file puts them. The set is 1581 wide in a
 * 1920 band, so a single copy does not reach both edges, and a row that has to
 * scroll cannot have an end. At slide 17 with no drift the second copy sits
 * exactly on the file's 169 and the first fills the left edge, so the settled
 * slide is the file's composition with the tiling either side of it.
 */
function Partners({ scale, frameW, innerRef, rowRef }) {
  const B = PARTNER_BAND
  const px = (v) => `calc(${v}px * var(--bs))`

  return (
    <section
      className="partners"
      ref={innerRef}
      aria-label="Built by PureHealth"
      style={{ width: `${frameW}px`, height: `${B.h * scale}px`, '--bs': scale }}
    >
      {/* The gradient is one image hung far above the band and clipped by it,
          so what shows is its bottom edge. */}
      <img
        className="partners__grad"
        src="/assets/partners/gradient.jpg"
        alt=""
        style={{ left: px(B.grad.x), top: px(B.grad.y), width: px(B.grad.w), height: px(B.grad.h) }}
      />
      {/* Figma blurs the backdrop here as well as washing it. Skipped: one
          `backdrop-filter` band gives a hard line where its box starts, which is
          the whole reason the hero's own wash is built in four layers — and over
          a gradient this smooth there is nothing for it to soften anyway. */}
      <span className="partners__wash" style={{ top: px(B.wash.y), height: px(B.wash.h) }} />

      <h2 className="partners__head" style={{ top: px(B.head) }}>
        Built by PureHealth
      </h2>
      <p className="partners__sub" style={{ top: px(B.sub) }}>
        One of the world’s largest and most trusted healthcare networks.
      </p>

      {/* A rail around the row, masked at both ends.
          The file centres ONE set of eight with clear margins either side. A row
          that scrolls cannot do that — it has to be tiled, and a tiled row has a
          partial mark at each edge. The mask fades those out instead of cutting
          them, and the eight the file draws sit well inside it, so the settled
          slide is still the file's composition. */}
      <div className="partners__rail" style={{ top: px(B.row), height: px(B.logoH) }}>
        <div
          className="partners__row"
          ref={rowRef}
          style={{ left: px(B.rowLeft - PARTNER_SET_W), gap: px(B.gap) }}
        >
          {Array.from({ length: PARTNER_SETS }, (_, set) =>
            PARTNER_LOGOS.map(([slug, w, name]) => (
              <img
                key={`${set}-${slug}`}
                src={`/assets/partners/partner-${slug}.png`}
                // One copy reads; the rest are the same marks again and would be
                // read out four times over.
                alt={set === 1 ? name : ''}
                aria-hidden={set === 1 ? undefined : true}
                style={{ width: px(w), height: px(B.logoH) }}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Bring a tab fully into view inside its own scroll box.
 *
 * Only ever does anything where the row overflows, which in practice is a
 * phone. Without it, picking the last visible tab leaves the one you have just
 * chosen half off the edge — and since choosing it also changes the cards
 * below, it reads as the page having jumped rather than as a selection.
 */
function centreTab(el) {
  const box = el.parentElement?.parentElement
  if (!box || box.scrollWidth <= box.clientWidth) return
  box.scrollTo({
    left: el.offsetLeft + el.offsetWidth / 2 - box.clientWidth / 2,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

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
 *
 * The TAB decides which deck is in the row, and changing it takes the row back
 * to the start. Not a detail: the decks are different lengths — Women's Health
 * has three cards where My Health has five — so a tab picked while the row was
 * paged along would open somewhere in its middle, with its first card off the
 * left edge and no indication there was anything there. The file draws every
 * selection from its first card.
 */
function Carousel({ items, tab, scale, frameW, pad, innerRef, controlRef }) {
  const [page, setPage] = useState(0)
  const rowRef = useRef(null)

  const { item, gap } = CAROUSEL_GEO
  const step = (item + gap) * scale
  // The gutter is on the LEFT only. A trailing one would be pointless: the row
  // is wider than its viewport by design and its right end is always clipped.
  const rowW = (pad + items.length * item + (items.length - 1) * gap) * scale
  const overflow = Math.max(0, rowW - frameW)
  const pages = Math.max(1, Math.ceil(overflow / step) + 1)
  const offset = Math.min(page * step, overflow)

  // Clamp if the breakpoint changed under us and there are fewer pages now.
  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1))
  }, [pages])

  // A new deck opens at its start.
  useEffect(() => {
    setPage(0)
  }, [tab])

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
      <div
        className="carousel"
        ref={innerRef}
        style={{ width: `${frameW}px` }}
        id="band"
        role="tabpanel"
        aria-labelledby={`band-tab-${tab}`}
      >
        <div
          className="carousel__row"
          ref={rowRef}
          style={{ paddingLeft: `${pad * scale}px`, gap: `${gap * scale}px` }}
        >
          {items.map((it, i) =>
            it.kind === 'photo' ? (
              <figure
                className="carousel__photo"
                key={i}
                style={{ width: `${item * scale}px`, height: `${CAROUSEL_GEO.photoH * scale}px` }}
              >
                <img src={`/assets/carousel/${it.img}.jpg`} alt={it.alt} />
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
    partners: useRef(null),
    partnerRow: useRef(null),
    pills: useRef(null),
    carousel: useRef(null),
    carouselCtrl: useRef(null),
    timeline: useRef(null),
    timelineDot: useRef(null),
    // One entry per scene, in DAY_SCENES order.
    scenes: useRef([]),
    heads: useRef([]),
    bodies: useRef([]),
    dayPills: useRef(null),

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
  // Which band of the carousel is showing. The file draws six versions of it —
  // Slides 18/19 plus `Carousel Selection 2..6` — and this is which one.
  const [tab, setTab] = useState(0)

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

  /**
   * Where the screen's left edge falls inside the frame, and what that does to
   * the two things hung off it.
   *
   * The stage COVERS the viewport, so a window narrower than 16:9 loses a slice
   * of the frame off each side — about 290 frame pixels each at 5:4, which is
   * the whole of the day's copy column and the carousel's first card. Neither
   * belongs to the middle of the composition, so neither should follow it.
   *
   * Two rules, and both are the identity at 16:9 and wider:
   *
   *   The gutter is a PROPORTION of what can be seen, not a fixed length. The
   *   file's 148px on a 1920 frame is 7.7% of the width, and 7.7% is what it
   *   stays — a fixed 148 against a 1345px window reads as a much wider margin
   *   than the design has.
   *
   *   The column may not walk into the phone. It is pinned left, so as the
   *   window narrows the room between it and the phone is what runs out; the
   *   copy re-wraps into what is left rather than sliding under it. Below about
   *   4:3 that column gets tight, and a floor stops it collapsing to a word a
   *   line.
   *
   * Recomputed on resize by ordinary React state, which is the reason it is
   * here and expressed as CSS variables rather than in the timeline: the
   * timeline is rebuilt only when the BREAKPOINT changes, so a number that
   * follows the window continuously cannot live in it.
   */
  const phone = layout.name === 'mobile'
  const win = frameWindow(viewport.w, viewport.h, layout)
  const copyLeft = phone ? COPY_LEFT : win.inset + COPY_LEFT * win.k
  const copyCol = phone ? 1e5 : Math.max(280, DEVICE_LEFT - COPY_CLEAR - copyLeft)

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
  /** The stage that carries the left-hung furniture — see the note above. */
  const columnStyle = {
    ...stageStyle,
    '--day-l': `${copyLeft}px`,
    '--day-col': `${copyCol}px`,
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
          the first act scrolls away and what it uncovers is the page.
          On a phone it is a still image rather than the Lottie — see Backdrop. */}
      <div className="layer layer--backdrop" aria-hidden="true">
        <div className="stage" style={stageStyle}>
          <div className="backdrop-travel" ref={refs.backdrop}>
            <Backdrop />
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

          {/* The day's six photo panels, stacked in one box.
              They live BEHIND the device and behind the wash, which is the
              order the file has from slide 25 on: panel, then Overlay, then the
              phone. Above the wash they would have nothing to blur, and they
              would cover the device outright.

              Each is a shutter over an image that never moves — see `shutter`
              in frames.js. Only one or two are ever open, but all six stay
              mounted: unmounting them would drop the decoded image and make
              scrolling back up a reload. */}
          {DAY_SCENES.map((scene, i) => (
            <figure
              className="day-media"
              key={scene.key}
              ref={(el) => {
                refs.scenes.current[i] = el
              }}
            >
              <img src={scene.media} alt={scene.alt} />
            </figure>
          ))}
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
        <div className="stage" style={columnStyle}>
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

          {/* Slide 17 only. First among the fourth act's children so it paints
              under them, though at the positions the file gives nothing in this
              act ever overlaps it. */}
          <Partners
            scale={layout.cardScale}
            frameW={layout.frame[0]}
            innerRef={refs.partners}
            rowRef={refs.partnerRow}
          />

          <h2 className="act4-head" ref={refs.act4Head}>
            Help for every part of your health.
          </h2>
          {/* A tab list, not six decorative chips: each one swaps the deck in
              the carousel below. Marked up as tabs so a keyboard and a screen
              reader get the relationship — the panel they control is the
              carousel, which is a sibling rather than a child because its
              position on the page is on the scroll timeline and the tabs' is
              too, separately.

              Two elements, not one: the outer box is the row's VIEWPORT and is
              what the timeline moves, and the inner row is what overflows it.
              Six labels come to 603px, which fits a 1920 frame and does not fit
              a 430 one — and when they were decoration, the two that fell off
              the ends did not matter. As controls they do. */}
          <div
            className="pills"
            ref={refs.pills}
            style={{ '--ps': layout.chipScale, '--pvw': `${layout.frame[0]}px` }}
          >
            <div className="pills__row" role="tablist" aria-label="Parts of your health">
              {PILL_LABELS.map((label, i) => (
                <button
                  type="button"
                  role="tab"
                  id={`band-tab-${i}`}
                  aria-selected={i === tab}
                  aria-controls="band"
                  className={i === tab ? 'pill is-on' : 'pill'}
                  key={label}
                  onClick={(e) => {
                    setTab(i)
                    centreTab(e.currentTarget)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* The band's viewport is what can be SEEN of the frame, not the
              frame — so on a narrow window it clips at the real screen edges
              and the row still starts one gutter in from the left. Centred on
              frame x 960 as before, which lands its left edge exactly on the
              screen's: `inset + visible / 2` is 960 whatever the window. */}
          <Carousel
            items={CAROUSEL_TABS[tab]}
            scale={layout.cardScale}
            frameW={win.visible}
            pad={CAROUSEL_GEO.rowPad * win.k}
            innerRef={refs.carousel}
            controlRef={refs.carouselCtrl}
            tab={tab}
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
          {/* Slides 26 to 36: the day, told in six scenes. The copy on the
              left says what the phone in the middle is showing, and both change
              on the settled slides only — the transitions between them move the
              photograph and nothing else.

              All six are in the DOM at once and cross-fade past each other.
              Swapping the text of one element instead would mean the outgoing
              and incoming words could never overlap, and the hand-off is the one
              moment where they have to. */}
          {DAY_SCENES.map((scene, i) => (
            <div
              className="greeting"
              key={scene.key}
              style={{ '--gw': `${scene.headBox[2]}px` }}
              ref={(el) => {
                refs.heads.current[i] = el
              }}
            >
              <img src="/assets/pura-sparkle.png" alt="" width="32" height="32" />
              <p>{scene.head}</p>
            </div>
          ))}
          {/* Only the first scene has a paragraph. The others are rendered as
              nothing rather than as an empty node, which leaves that scene's
              slot in `refs.bodies` undefined — and undefined is what the
              timeline and the phone's measured stack both check for. */}
          {DAY_SCENES.map((scene, i) =>
            scene.body ? (
              <p
                className="greeting-body"
                key={scene.key}
                style={{ '--gw': `${scene.bodyBox[2]}px` }}
                ref={(el) => {
                  refs.bodies.current[i] = el
                }}
              >
                {scene.body}
              </p>
            ) : null
          )}

          {/* Scene D is the only one that carries anything under its headline.
              It follows the copy exactly — same slides, same rise. */}
          <div
            className="day-pills"
            ref={refs.dayPills}
            style={{ '--gw': `${DAY_PILL_ROW_W}px`, '--dpg': `${DAY_PILL_GAP}px` }}
          >
            {DAY_PILL_LABELS.map(([label, w]) => (
              <span className="pill pill--static" key={label} style={{ '--pw': `${w}px` }}>
                {label}
              </span>
            ))}
          </div>
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
