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
export const SLIDES = 8

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
 * Slides 7 and 8 have no Device node — Figma draws a separate flat front-on
 * mock there, 901px of SCREEN. Converting that to body height through the
 * model's own screen-to-body ratio is what keeps the turn continuous.
 */
const AI_SIZE = Math.round(((901 * 163.371) / 158.259 / 630) * 1e4) / 1e4

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
  { c: [960, 753.5], s: AI_SIZE, r: FACE },
  { c: [960, 753.5], s: AI_SIZE, r: FACE },
]

/**
 * What the screen is showing: 0 = the Home screen, 1 = Pura AI.
 *
 * It crossfades across the turn to face-on, so the content changes while the
 * device is moving rather than snapping while it is sitting still.
 */
export const SCREEN_MIX = [0, 0, 0, 0, 0, 0, 1, 1]

/**
 * The hand.
 *
 * `c` is the centre of the hand IMAGE — Figma groups it with a backdrop that
 * extends below, so the group's own centre is not the image's. It has no node
 * before slide 4, so the early slides park it below the frame rather than
 * fading it in: a hand that materialises in mid-air reads as a glitch, one that
 * rises into shot reads as the point. By slide 6 it is fading out again as the
 * device lifts away from it.
 */
const HAND_BELOW = { c: [915, 1883], w: 476, o: 1 }
export const HAND_POSE = [
  HAND_BELOW,
  HAND_BELOW,
  HAND_BELOW,
  { c: [915, 1263], w: 476, o: 1 },
  { c: [912.4, 999.3], w: 342, o: 1 },
  { c: [913.2, 1202.4], w: 383, o: 0.2 },
  { c: [913.2, 1042.4], w: 383, o: 0 },
  { c: [913.2, 1042.4], w: 383, o: 0 },
]

/** Native size of `hand.png`, so width alone can drive it. */
export const HAND_ASPECT = 1016 / 476

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
export const COPY_Y = [0, -50, -100, -100, -100, -100, -100, -100]

export const COPY_HEAD = [
  { o: 1, b: 0 },
  { o: 0.4, b: 8 },
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
]

/**
 * The white wash across the bottom, as two stacked layers.
 *
 * Figma really does stack two identical gradient rectangles on slides 7 and 8 —
 * that is how the AI screen's foot dissolves hard enough for the agent bar to
 * sit on nothing. One layer cannot express it, so there are two here too.
 */
export const WASH_A = [1, 0, 0, 0, 1, 1, 1, 1]
export const WASH_B = [0, 0, 0, 0, 0, 0, 1, 1]

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
 * released. So the hand fades over the first part of that step, and the device
 * only begins its climb once the hand has nearly gone — with a short overlap,
 * because a clean handover would be a stop and a restart.
 *
 * Keyed by step index: step 4 is slide 5 → slide 6.
 */
export const STEP_WINDOWS = {
  hand: { 4: [0, 0.55] },
  device: { 4: [0.45, 1] },
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
