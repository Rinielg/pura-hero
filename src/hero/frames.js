/**
 * The choreography, measured straight out of Figma.
 *
 * Slides 1–8 of `Pura Website → Final Website` are eight moments of one
 * continuous move, not eight screens. Every number below is a position that
 * slide put an element at, in the design frame's own pixels — so this file is
 * checkable against Figma by reading it, and a design change is a number
 * change rather than a re-derivation.
 *
 * Positions are CENTRES, not top-left corners. Figma reports top-left; the
 * conversion happens once, at extraction.
 *
 * REGENERATING: `tools/extract-frames.js` is the plugin snippet that produced
 * these numbers. Paste it into the Figma console after a design change rather
 * than re-deriving by hand — the slides get rebuilt with new node ids often
 * enough that nothing here should ever be matched by id.
 *
 * `Slide overview` on the same page is an assembly board rather than a moment
 * in the sequence, and is deliberately ignored.
 */

/** The frame every coordinate below is expressed in. */
export const FRAME = { w: 1920, h: 1080 }

/** Slides in the sequence. Adding one in Figma means adding an entry below. */
export const SLIDES = 15

/**
 * The twelve pillar chips.
 *
 * `at` runs slide 1→5 and then stops: by slide 5 the cloud has collapsed to the
 * centre and faded out, and slides 6, 7 and 8 leave it there. Clamping is how
 * "and then nothing happens" is expressed without repeating identical rows.
 *
 * Two chips read "Respiratory". That is what the design says; `key` keeps them
 * distinct.
 */
export const CHIPS = [
  {
    key: 'lab-results',
    label: 'Lab results',
    icon: 'health-report',
    at: [
      { c: [263.1, 397.7], o: 0.6 },
      { c: [440.1, 419.7], o: 0.6 },
      { c: [630.1, 322.7], o: 0.6 },
      { c: [934.1, 304.7], o: 0 },
      { c: [977.1, 259.7], o: 0 },
    ],
  },
  {
    key: 'medical-history',
    label: 'Medical history',
    icon: 'health-records',
    at: [
      { c: [1318.6, 447.7], o: 1 },
      { c: [1247.6, 431.7], o: 1 },
      { c: [1145.6, 297.7], o: 1 },
      { c: [1025.6, 297.7], o: 0 },
      { c: [979.6, 298.7], o: 0 },
    ],
  },
  {
    key: 'wearables',
    label: 'Wearables',
    icon: 'wearables',
    at: [
      { c: [668.6, 630.7], o: 1 },
      { c: [825.6, 593.7], o: 1 },
      { c: [968.6, 444.7], o: 1 },
      { c: [968.6, 444.7], o: 0 },
      { c: [970.6, 262.7], o: 0 },
    ],
  },
  {
    key: 'liver',
    label: 'Liver',
    icon: 'purescore',
    at: [
      { c: [287, 679], o: 0.6 },
      { c: [504, 659], o: 0.6 },
      { c: [733, 519], o: 0.6 },
      { c: [833, 519], o: 0 },
      { c: [911, 304], o: 0 },
    ],
  },
  {
    key: 'renal',
    label: 'Renal',
    icon: 'renal',
    at: [
      { c: [1549, 486], o: 0.8 },
      { c: [1459, 475], o: 0.8 },
      { c: [1278, 392], o: 0.8 },
      { c: [998, 412], o: 0 },
      { c: [1099, 229], o: 0 },
    ],
  },
  {
    key: 'metabolic',
    label: 'Metabolic',
    icon: 'metabolic',
    at: [
      { c: [564.5, 755], o: 0.8 },
      { c: [738.5, 714], o: 0.8 },
      { c: [883.5, 574], o: 0.8 },
      { c: [883.5, 574], o: 0 },
      { c: [972.5, 289], o: 0 },
    ],
  },
  {
    key: 'respiratory-a',
    label: 'Respiratory',
    icon: 'pulmonology',
    at: [
      { c: [1172, 556], o: 1 },
      { c: [1123, 533], o: 1 },
      { c: [1063, 393], o: 1 },
      { c: [963, 393], o: 0 },
      { c: [996, 205], o: 0 },
    ],
  },
  {
    key: 'mental-wellness',
    label: 'Mental Wellness',
    icon: 'brain',
    at: [
      { c: [1716.6, 362.7], o: 0.3 },
      { c: [1568.6, 369.7], o: 0.3 },
      { c: [1407.6, 289.7], o: 0.3 },
      { c: [1010.6, 342.7], o: 0 },
      { c: [1014.6, 220.7], o: 0 },
    ],
  },
  {
    key: 'sleep',
    label: 'Sleep',
    icon: 'partly-cloudy-night',
    at: [
      { c: [1263, 755], o: 0.6 },
      { c: [1127, 731], o: 0.6 },
      { c: [908, 653], o: 0.6 },
      { c: [908, 653], o: 0 },
      { c: [935, 296], o: 0 },
    ],
  },
  {
    key: 'nutrition',
    label: 'Nutrition',
    icon: 'metabolic',
    at: [
      { c: [892.5, 542], o: 1 },
      { c: [935.5, 508], o: 1 },
      { c: [935.5, 328], o: 1 },
      { c: [935.5, 328], o: 0 },
      { c: [949.5, 272], o: 0 },
    ],
  },
  {
    key: 'respiratory-b',
    label: 'Respiratory',
    icon: 'pulmonology',
    at: [
      { c: [1401, 633], o: 0.6 },
      { c: [1322, 601], o: 0.6 },
      { c: [1135, 490], o: 0.6 },
      { c: [895, 510], o: 0 },
      { c: [1095, 232], o: 0 },
    ],
  },
  {
    key: 'cardiovascular',
    label: 'Cardiovascular',
    icon: 'pregnacare',
    at: [
      { c: [556.5, 506], o: 0.8 },
      { c: [676.5, 487], o: 0.8 },
      { c: [814.5, 414], o: 0.8 },
      { c: [914.5, 414], o: 0 },
      { c: [1016.5, 235], o: 0 },
    ],
  },
]

/**
 * Which chips survive on a phone. Twelve in a 390px-wide cloud is mush, so the
 * six that carry the idea stay and the rest are dropped — chosen for spread
 * across the cloud rather than for what reads best in a list.
 */
export const MOBILE_CHIPS = new Set([
  'lab-results',
  'wearables',
  'metabolic',
  'mental-wellness',
  'sleep',
  'cardiovascular',
])

/** Slide 4's device rect is the reference: 1440px tall renders at 1.23. */
const sz = (rectHeight) => Math.round((rectHeight / 1440) * 1.23 * 1e4) / 1e4
/**
 * Slides 7 onward have no Device node — Figma draws a separate flat front-on
 * mock. Its SCREEN height converts to a body height through the model's own
 * screen-to-body ratio, which is what keeps the turn to face-on continuous
 * across the handover from one representation to the other.
 */
const ai = (screenHeight) => Math.round(((screenHeight * 163.371) / 158.259 / 630) * 1e4) / 1e4

const TILT = [-32, -35, -24]
const FACE = [0, 0, 0]

/**
 * The device, as eight poses.
 *
 * The arc: front-on and small at rest (1), turning into a 3/4 view as it rises
 * through the chip cloud (2–4), settling toward the hand (5), lifting and
 * growing again (6), then turning back to FACE-ON as the page becomes about
 * Pura AI (7–8).
 *
 * That last turn is the whole argument for the device being real geometry.
 * Figma can only swap one flat render for another; the rotation between them
 * does not exist in the file and has to be inferred, which is exactly the kind
 * of thing a static frame cannot express and a 3D object gets for free.
 *
 * Sizes derive from each slide's device rect height, so re-sizing the device in
 * Figma carries through proportionally. The 3/4 rotation is deliberately more
 * face-on than the reference render — legibility of the screen beats matching
 * the picture; see the README.
 */
export const DEVICE_POSE = [
  { c: [959.8, 928], s: 0.975, r: FACE },
  { c: [905.7, 833], s: sz(1736), r: TILT },
  { c: [905.7, 643], s: sz(1736), r: TILT },
  { c: [905.7, 503], s: sz(1440), r: TILT },
  { c: [905.7, 479.9], s: sz(1035), r: TILT },
  { c: [905.7, 518.5], s: sz(1435), r: TILT },
  { c: [960, 753.5], s: ai(901), r: FACE },
  { c: [959.9, 753], s: ai(901), r: FACE },
  // From slide 9 the whole scene starts travelling up and out of frame, and
  // the device goes with it — smaller, and rising faster than the copy.
  { c: [959.9, 628.5], s: ai(823), r: FACE },
  { c: [959.9, 348.5], s: ai(823), r: FACE },
  { c: [959.9, 62.5], s: ai(823), r: FACE },
  { c: [959.9, -82.5], s: ai(823), r: FACE },
  { c: [959.9, -424.5], s: ai(823), r: FACE },
  { c: [959.9, -424.5], s: ai(823), r: FACE },
  { c: [959.9, -424.5], s: ai(823), r: FACE },
]

/**
 * What the screen is showing: 0 = the Home screen, 1 = Pura AI.
 *
 * It crossfades across the turn to face-on, so the content changes while the
 * device is moving rather than snapping while it is sitting still.
 */
export const SCREEN_MIX = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]

/**
 * The hand.
 *
 * `c` is the centre of the hand IMAGE — Figma groups it with a backdrop that
 * extends below, so the group's own centre is not the image's. It has no node
 * before slide 4, so the early slides park it below the frame rather than
 * fading it in: a hand that materialises in mid-air reads as a glitch, one that
 * rises into shot reads as the point.
 *
 * From slide 5 it FADES IN PLACE and never moves again. Figma's later slides do
 * drift it around, but on a page those few pixels of travel read as the hand
 * being dragged off rather than letting go — it should simply stop being there.
 * So the resting pose is held and only opacity moves.
 *
 * It goes all the way to zero in one step, and over less than half of it (see
 * STEP_WINDOWS). Figma holds it at 20% for a slide, which on a static frame
 * reads as "nearly gone" and in motion reads as a smudge that will not leave.
 */
/**
 * Where the hand rests and fades from. The asset was replaced for slides 4–6:
 * a different cut-out at a different aspect (500 x 942 rather than 476 x 1016),
 * so every number here is the new one and HAND_ASPECT moved with it.
 */
const HAND_REST = { c: [895, 929], w: 386 }
/** Parked below the frame: the hand has no node at all before slide 4. */
const HAND_BELOW = { c: [895, 1866], w: 500, o: 1 }

export const HAND_POSE = [
  HAND_BELOW,
  HAND_BELOW,
  HAND_BELOW,
  { c: [895, 1246], w: 500, o: 1 },
  { ...HAND_REST, o: 1 },
  // Figma now takes it to zero by slide 6 as well, so the design and the page
  // agree: it is gone, not nearly gone.
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
  { ...HAND_REST, o: 0 },
]

/** Native size of `hand.webp`, so width alone can drive it. */
export const HAND_ASPECT = 942 / 500

/**
 * The hero copy.
 *
 * It does not just fade — it goes OUT OF FOCUS as it fades, and that is the
 * part that makes it read as receding rather than as being turned down. Figma
 * puts `LAYER_BLUR 8` on the heading and `LAYER_BLUR 4` on the sub-heading at
 * the moment they drop back, and the two are not treated the same: the heading
 * loses opacity while the sub-heading keeps it and only softens. Animating them
 * as one block loses that, so they are two tracks over a shared translate.
 *
 * `y` is the shared travel, `o` opacity, `b` blur radius in frame pixels.
 */
export const COPY_Y = [0, -50, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100]

export const COPY_HEAD = [
  { o: 1, b: 0 },
  { o: 0.4, b: 8 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
  { o: 0, b: 12 },
]

export const COPY_SUB = [
  { o: 1, b: 0 },
  { o: 1, b: 4 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
  { o: 0, b: 10 },
]

/**
 * "A health companion that knows you" — the second act's headline. It arrives
 * behind the device at 40% while the device is still tilted, then rises and
 * resolves as the device turns to face you.
 */
export const KICKER = [
  { y: 306, o: 0, b: 8 },
  { y: 306, o: 0, b: 8 },
  { y: 306, o: 0, b: 8 },
  { y: 306, o: 0, b: 8 },
  { y: 306, o: 0, b: 8 },
  { y: 306, o: 0.4, b: 8 },
  { y: 206, o: 1, b: 0 },
  { y: 206, o: 1, b: 0 },
  // It hands over to the third act's headline from here, rising and softening
  // back out the way it came in.
  { y: 146, o: 0.4, b: 8 },
  { y: 116, o: 0, b: 8 },
  { y: 116, o: 0, b: 8 },
  { y: 116, o: 0, b: 8 },
  { y: 116, o: 0, b: 8 },
  { y: 116, o: 0, b: 8 },
  { y: 116, o: 0, b: 8 },
]

/** The supporting paragraph, which slides in from the right as it resolves. */
export const BODY_COPY = [
  { c: [576.5, 414.5], o: 0, b: 8 },
  { c: [576.5, 414.5], o: 0, b: 8 },
  { c: [576.5, 414.5], o: 0, b: 8 },
  { c: [576.5, 414.5], o: 0, b: 8 },
  { c: [576.5, 414.5], o: 0, b: 8 },
  { c: [576.5, 414.5], o: 0, b: 8 },
  { c: [576.5, 414.5], o: 0.4, b: 8 },
  { c: [536.5, 414.5], o: 1, b: 0 },
  { c: [536.5, 344.5], o: 0.6, b: 4 },
  { c: [536.5, 314.5], o: 0, b: 8 },
  { c: [536.5, 314.5], o: 0, b: 8 },
  { c: [536.5, 314.5], o: 0, b: 8 },
  { c: [536.5, 314.5], o: 0, b: 8 },
  { c: [536.5, 314.5], o: 0, b: 8 },
  { c: [536.5, 314.5], o: 0, b: 8 },
]

/**
 * The Pura agent bar. It appears with the AI screen and then WIDENS — the one
 * beat in the sequence that reads as the interface responding rather than as
 * the camera moving.
 */
export const AGENT_BAR = [
  { c: [960, 931], w: 354, o: 0 },
  { c: [960, 931], w: 354, o: 0 },
  { c: [960, 931], w: 354, o: 0 },
  { c: [960, 931], w: 354, o: 0 },
  { c: [960, 931], w: 354, o: 0 },
  { c: [960, 931], w: 354, o: 0 },
  { c: [960, 931], w: 354, o: 1 },
  { c: [960, 931], w: 560, o: 1 },
  { c: [960, 957], w: 306, o: 1 },
  { c: [960, 677], w: 302, o: 1 },
  { c: [960, 391], w: 302, o: 1 },
  { c: [960, 246], w: 302, o: 1 },
  { c: [960, -96], w: 302, o: 1 },
  { c: [960, -96], w: 302, o: 1 },
  { c: [960, -96], w: 302, o: 1 },
]

/**
 * The white wash, as two stacked layers.
 *
 * It has a POSITION now, not just an opacity. Up to slide 9 it sits against the
 * bottom of the frame as page furniture; from slide 10 the whole first-act
 * scene travels up and out and the wash goes with it, because it belongs to
 * that scene rather than to the viewport.
 *
 * Figma really does stack two identical gradient rectangles from slide 7 — that
 * is how the AI screen's foot dissolves hard enough for the agent bar to sit on
 * nothing. One layer cannot express it, so there are two here too.
 */
const washY = [858, 858, 858, 858, 858, 858, 858, 858, 858, 637, 351, 206, -136, -136, -136]
const washA = [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
const washB = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]

export const WASH_A = washY.map((y, i) => ({ y, o: washA[i] }))
export const WASH_B = washY.map((y, i) => ({ y, o: washB[i] }))

/**
 * The gradient backdrop's own travel.
 *
 * Figma moves the background rectangle itself from slide 10, which is the file
 * saying "the page scrolls on now". Everything below where it ends up is plain
 * white — so the backdrop layer translates and the page shows through beneath
 * it, exactly as the design has it.
 */
export const BACKDROP_Y = [0, 0, 0, 0, 0, 0, 0, 0, 0, -221, -507, -652, -994, -994, -994]

/* ------------------------------------------------------------ the third act */

/**
 * "One place for your whole health." and its paragraph.
 *
 * They rise from below the fold as the first act leaves, arriving blurred and
 * dim and resolving as they settle — the same treatment every other piece of
 * copy on this page gets.
 */
export const ACT3_HEAD = [
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0, b: 8 },
  { c: [960.5, 908], o: 0.4, b: 8 },
  { c: [960.5, 643], o: 1, b: 0 },
  { c: [960.5, 498], o: 1, b: 0 },
  { c: [960.5, 216], o: 1, b: 0 },
  { c: [960.5, 216], o: 1, b: 0 },
  { c: [960.5, 216], o: 1, b: 0 },
]

export const ACT3_BODY = [
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0, b: 8 },
  { c: [960, 982], o: 0.2, b: 8 },
  { c: [960, 717], o: 1, b: 0 },
  { c: [960, 572], o: 1, b: 0 },
  { c: [960, 290], o: 1, b: 0 },
  { c: [960, 290], o: 1, b: 0 },
  { c: [960, 290], o: 1, b: 0 },
]

/** The two pills under the paragraph. They arrive a slide later than the copy. */
export const ACT3_CTA = [
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 1064], o: 0 },
  { c: [960, 799], o: 1 },
  { c: [960, 654], o: 1 },
  { c: [960, 372], o: 1 },
  { c: [960, 372], o: 1 },
  { c: [960, 372], o: 1 },
]

/**
 * The promo card row.
 *
 * Five 376px cards with a 16px gap — 1944px of row against a 1920px frame, so
 * it is always wider than the screen. Slides 13, 14 and 15 change nothing but
 * its x, which makes the last stretch of the page a horizontal scroll driven by
 * the vertical one. That is the only place in the sequence where the two axes
 * are crossed, and it is why the row is tracked as a position rather than
 * living in an overflow container.
 */
export const CARD_ROW_W = 1944
export const CARDS = [
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1368], o: 0 },
  { c: [1891, 1103], o: 1 },
  { c: [1581, 958], o: 1 },
  { c: [1291, 676], o: 1 },
  { c: [1112, 676], o: 1 },
  { c: [808, 676], o: 1 },
]

/**
 * What each card is.
 *
 * `frame` is how the photo sits inside the card. Three of the five are a plain
 * cover crop; the other two carry a Figma CROP transform, which is a window
 * onto the source rather than a fit — so those two get explicit width/left/top
 * percentages taken from that transform. Everything is a percentage of the card
 * so it survives the card being any size.
 */
export const CARD_CONTENT = [
  {
    img: 'movement',
    icon: 'tag-movement',
    tag: 'Movement',
    title: 'Move with a reason',
    frame: { w: 189.9, h: 99.91, left: -44.95, top: 0 },
  },
  {
    img: 'nutrition',
    icon: 'tag-nutrition',
    tag: 'Nutrition',
    title: 'Know what your food is doing for you',
    frame: { w: 200.69, h: 105.59, left: -50.35, top: -5.52 },
  },
  {
    img: 'mental-wellness',
    icon: 'tag-mental-wellness',
    tag: 'Mental Wellness',
    title: 'Give your mind the same attention',
  },
  {
    img: 'mental-wellness-2',
    icon: 'tag-mental-wellness',
    tag: 'Mental Wellness',
    title: 'Give your mind the same attention',
  },
  {
    img: 'family',
    icon: 'tag-family',
    tag: 'Family',
    title: 'Health for the whole family',
  },
]


/**
 * How much scroll each step gets, relative to the others. Equal: every step is
 * a slice of one continuous move, and weighting them makes the joins audible
 * under a scrub.
 */
export const STEP_WEIGHTS = Array(SLIDES - 1).fill(1)

/**
 * Where inside a step a given element actually moves, as [start, end] fractions.
 *
 * Everything runs across the whole step by default, which is right for a camera
 * move — but step 5→6 is not one. There the hand lets go of the device, and
 * both happening at once reads as the phone escaping rather than being
 * released. So the hand goes first — all the way out, over the first 40% of the
 * step — and the device only starts climbing as it finishes, with a short
 * overlap, because a clean handover would be a stop and a restart.
 *
 * Keyed by step index: step 4 is slide 5 → slide 6.
 */
export const STEP_WINDOWS = {
  hand: { 4: [0, 0.4] },
  device: { 4: [0.34, 1] },
}

/**
 * Pinned scroll distance, in CSS pixels — half a viewport per step.
 *
 * Derived from the step count rather than fixed, so adding a slide in Figma
 * lengthens the page by exactly one step's worth of scroll and changes nothing
 * about how fast anything moves. The floor stops a short window turning each
 * step into a flick.
 */
export const scrollLength = (vh, isMobile) =>
  STEP_WEIGHTS.length * (isMobile ? vh * 0.52 : Math.max(360, vh * 0.5))
