/**
 * The choreography, measured straight out of Figma.
 *
 * Slides 1–6 of `Pura Website → Final Website` are six moments of one
 * continuous move, not six screens. Every number below is the position that
 * slide put an element at, in the design frame's own pixels — so this file is
 * checkable against Figma by reading it, and a design change is a number
 * change rather than a re-derivation.
 *
 * Positions are CENTRES, not top-left corners. Figma reports top-left; the
 * conversion happens here, once, rather than in every consumer.
 *
 * Slide 7 is the assembled composition rather than a moment in the sequence,
 * so it is not a keyframe. It was used to confirm the resting layout and the
 * device-to-hand relationship, and it agrees with slide 2 offset by 280px.
 */

/** The frame every coordinate below is expressed in. */
export const FRAME = { w: 1920, h: 1080 }

const centre = (x, y, w, h) => [Math.round((x + w / 2) * 10) / 10, Math.round((y + h / 2) * 10) / 10]

/**
 * The twelve pillar chips.
 *
 * `at` is one entry per slide 1→6. Slides 4, 5 and 6 are identical for the
 * chips — they have already collapsed to the centre and faded out by then, so
 * the last three entries repeat. Two chips read "Respiratory"; that is what the
 * design says, and `key` keeps them distinct.
 *
 * Figma builds these two different ways (four as component instances at 53px
 * tall, eight as frames at 68px) but renders them identically. They are one
 * component here — the split is a Figma-file artefact, not a design intent.
 */
export const CHIPS = [
  {
    key: 'lab-results',
    label: 'Lab results',
    icon: 'health-report',
    at: [
      { c: centre(295, 341, 148, 53), o: 1 },
      { c: centre(596, 165, 148, 53), o: 1 },
      { c: centre(713, 173, 148, 53), o: 1 },
      { c: centre(903, 233, 148, 53), o: 0 },
    ],
  },
  {
    key: 'medical-history',
    label: 'Medical history',
    icon: 'health-records',
    at: [
      { c: centre(1024, 379, 179, 53), o: 1 },
      { c: centre(948, 333, 179, 53), o: 1 },
      { c: centre(1040, 212, 179, 53), o: 1 },
      { c: centre(890, 272, 179, 53), o: 0 },
    ],
  },
  {
    key: 'wearables',
    label: 'Wearables',
    icon: 'wearables',
    at: [
      { c: centre(486, 541, 151, 53), o: 1 },
      { c: centre(579, 422, 151, 53), o: 1 },
      { c: centre(655, 316, 151, 53), o: 0.3 },
      { c: centre(895, 236, 151, 53), o: 0 },
    ],
  },
  {
    key: 'liver',
    label: 'Liver',
    icon: 'purescore',
    at: [
      { c: centre(306, 626, 128, 68), o: 0.6 },
      { c: centre(776, 521, 128, 68), o: 0.6 },
      { c: centre(847, 420, 128, 68), o: 0.6 },
      { c: centre(847, 270, 128, 68), o: 0 },
    ],
  },
  {
    key: 'renal',
    label: 'Renal',
    icon: 'renal',
    at: [
      { c: centre(1370, 465, 148, 68), o: 0.6 },
      { c: centre(1163, 370, 148, 68), o: 0.6 },
      { c: centre(1055, 305, 148, 68), o: 0.6 },
      { c: centre(1025, 195, 148, 68), o: 0 },
    ],
  },
  {
    key: 'metabolic',
    label: 'Metabolic',
    icon: 'metabolic',
    at: [
      { c: centre(514, 687, 167, 68), o: 1 },
      { c: centre(871, 524, 167, 68), o: 1 },
      { c: centre(889, 405, 167, 68), o: 1 },
      { c: centre(889, 255, 167, 68), o: 0 },
    ],
  },
  {
    key: 'respiratory-a',
    label: 'Respiratory',
    icon: 'pulmonology',
    at: [
      { c: centre(1088, 500, 186, 68), o: 1 },
      { c: centre(952, 427, 186, 68), o: 1 },
      { c: centre(903, 321, 186, 68), o: 1 },
      { c: centre(903, 171, 186, 68), o: 0 },
    ],
  },
  {
    key: 'mental-wellness',
    label: 'Mental Wellness',
    icon: 'brain',
    at: [
      { c: centre(1460, 368, 187, 53), o: 1 },
      { c: centre(1113, 227, 187, 53), o: 1 },
      { c: centre(1071, 134, 187, 53), o: 1 },
      { c: centre(921, 194, 187, 53), o: 0 },
    ],
  },
  {
    key: 'sleep',
    label: 'Sleep',
    icon: 'partly-cloudy-night',
    at: [
      { c: centre(1189, 721, 148, 68), o: 0.6 },
      { c: centre(861, 592, 148, 68), o: 0.6 },
      { c: centre(861, 412, 148, 68), o: 0.6 },
      { c: centre(861, 262, 148, 68), o: 0 },
    ],
  },
  {
    key: 'nutrition',
    label: 'Nutrition',
    icon: 'metabolic',
    at: [
      { c: centre(844, 498, 155, 68), o: 1 },
      { c: centre(777, 412, 155, 68), o: 1 },
      { c: centre(832, 338, 155, 68), o: 0.6 },
      { c: centre(872, 238, 155, 68), o: 0 },
    ],
  },
  {
    key: 'respiratory-b',
    label: 'Respiratory',
    icon: 'pulmonology',
    at: [
      { c: centre(1308, 599, 186, 68), o: 0.6 },
      { c: centre(1002, 528, 186, 68), o: 0.6 },
      { c: centre(1002, 348, 186, 68), o: 0.6 },
      { c: centre(1002, 198, 186, 68), o: 0 },
    ],
  },
  {
    key: 'cardiovascular',
    label: 'Cardiovascular',
    icon: 'pregnacare',
    at: [
      { c: centre(637, 389, 203, 68), o: 0.8 },
      { c: centre(801, 243, 203, 68), o: 0.8 },
      { c: centre(815, 241, 203, 68), o: 0.8 },
      { c: centre(915, 201, 203, 68), o: 0 },
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

/**
 * The device, as six poses.
 *
 * `c` is the centre in frame pixels. `s` is a multiple of the model's reference
 * size. `r` is [x, y, z] rotation in degrees.
 *
 * These are NOT the Figma render's pose, and that is deliberate. Fitting the
 * reference image's silhouette gives roughly (-34, -51, -29) — accurate, and
 * turned far enough away that the app UI stops being readable. On a page whose
 * entire subject is what is on that screen, "matches the render" loses to "you
 * can read it". These poses keep the phone more face-on for the whole
 * sequence, and the screen stays legible from slide 2 to slide 6.
 *
 * The centre also sits left of where Figma puts it — about 2.7% of the viewport
 * width — which leaves the chip cloud's right-hand side visible for longer as
 * the device rises through it.
 *
 * Slide 1 is the only front-on pose, and the only one on the centre line: the
 * design shows a flat screenshot there and switches to a rendered 3/4 view from
 * slide 2 on. Rotating into that pose rather than cross-fading between two
 * images is the whole reason the device is real geometry.
 */
const TILT = [-32, -35, -24]
/** Horizontal offset for every rotated pose, as the other build has it. */
const OFF_X = 960 - 0.027 * FRAME.w

export const DEVICE_POSE = [
  { c: [960, 0.859 * FRAME.h], s: 0.975, r: [0, 0, 0] },
  { c: [OFF_X, 0.805 * FRAME.h], s: 1.23, r: TILT },
  { c: [OFF_X, 0.638 * FRAME.h], s: 1.23, r: TILT },
  { c: [OFF_X, 0.499 * FRAME.h], s: 1.23, r: TILT },
  { c: [OFF_X, 0.486 * FRAME.h], s: 0.99, r: TILT },
  { c: [OFF_X, 0.106 * FRAME.h], s: 0.99, r: TILT },
]

/**
 * The hand. It has no node at all before slide 4, so slides 1–3 park it below
 * the frame rather than fading it in — a hand that materialises in mid-air
 * reads as a glitch, one that rises into shot reads as the point.
 *
 * `c` is the centre of the hand image; `w` its width in design px. Slides 4→5
 * scale the hand and the device by the same 0.805, which is what makes that
 * step read as the camera pulling back rather than the phone shrinking.
 */
const HAND_BELOW = { c: [915, 1263 + 620], w: 476 }
export const HAND_POSE = [
  HAND_BELOW,
  HAND_BELOW,
  HAND_BELOW,
  { c: [915, 1263], w: 476 },
  { c: [913.5, 1082], w: 383 },
  { c: [913.5, 672], w: 383 },
]

/** Native size of `hand.png`, so width alone can drive it. */
export const HAND_ASPECT = 1016 / 476

/**
 * Heading and sub-heading. They travel together and leave through the top
 * between slides 1 and 2, then stay gone.
 */
export const HEADING_Y = [175, -105, -105, -105, -105, -105]

/** The white wash across the bottom of slide 1, gone by slide 2. */
export const OVERLAY_O = [1, 0, 0, 0, 0, 0]

/**
 * How much scroll each step gets, relative to the others.
 *
 * Equal. An earlier version weighted step 1 more heavily because it carries the
 * largest change, and eased it — which reads well as a single gesture and badly
 * as part of a scrub, because every weighted, eased step turns its own boundary
 * into a stop and a restart. Under a finger or a wheel, one constant rate for
 * the whole sequence is what feels like a camera move rather than five
 * animations queued up.
 */
export const STEP_WEIGHTS = [1, 1, 1, 1, 1]

/**
 * Pinned scroll distance, in CSS pixels.
 *
 * 2.5 viewport heights, floored at 1800px so a short window does not turn the
 * sequence into a flick. Roughly half what a per-slide-per-screen reading would
 * give you — the sequence is one continuous move, and paying a full screen of
 * scroll for each of its six moments makes it feel padded.
 */
export const scrollLength = (vh, isMobile) =>
  isMobile ? vh * 2.6 : Math.max(1800, vh * 2.5)

/**
 * The hero copy leaves by fading as it travels, over most (but not all) of the
 * first step. Figma can only express the travel; a static frame has no way to
 * say "and it is gone before the step ends".
 */
export const COPY_EXIT = { y: -0.26, opacity: 0, duration: 0.95 }

/** The white wash goes earlier still — it belongs to the resting state only. */
export const WASH_EXIT = { duration: 0.7 }
