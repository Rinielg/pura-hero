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
export const SLIDES = 26

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

/**
 * Leading slides for an element that has no node until partway through.
 *
 * Tracks may be SHORTER than SLIDES — the timeline holds the last value — but
 * they cannot be short at the front, because slide 1 has to render something.
 * This is how a late arrival says "parked here, invisible, until then".
 */
const parked = (untilSlide, state, rest) => [...Array(untilSlide).fill(state), ...rest]

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
  { c: [959.9, -424.5], s: ai(823), r: FACE },
  // Slide 17 drops the device from the file altogether. It still has 11px of
  // itself inside the frame at slide 16, so it is carried out on the same
  // 434px rise the rest of the scene takes rather than simply switched off.
  { c: [959.9, -858.5], s: ai(823), r: FACE },
  // Slides 18-25: parked where slide 26 wants it, one page-rise below. The jump
  // from off the top to down here happens while DEVICE_FADE holds it at zero,
  // so nothing sweeps across the frame to get there.
  ...Array(8).fill({ c: [959.7, 650.7 + 38], s: ai(663), r: FACE }),
  // Slide 26: it comes back, face on, at the size the file's phone group is.
  { c: [959.7, 650.7], s: ai(663), r: FACE },
]

/**
 * Whether the device is drawn at all.
 *
 * It exists for the whole sequence — it is one WebGL object, not something that
 * mounts and unmounts — so this is the gate. It goes to zero at slide 14, long
 * after the device has left the top of the frame, which makes the big
 * repositioning between 17 and 18 invisible. It comes back for slide 26.
 */
export const DEVICE_FADE = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
]

/**
 * What the screen is showing: 0 = the Home screen, 1 = Pura AI.
 *
 * It crossfades across the turn to face-on, so the content changes while the
 * device is moving rather than snapping while it is sitting still.
 */
export const SCREEN_MIX = [
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  // Back to the home screen for slide 26, which is what the file's phone shows.
  // The change happens while the device is invisible.
  0, 0, 0, 0, 0, 0, 0, 0, 0,
]

/**
 * The hand.
 *
 * `c` is the centre of the image and `w` its width, both in frame pixels.
 * OPACITY IS NOT HERE — it is HAND_FADE below, on its own track, because the
 * two need different timing inside the same step.
 *
 * It has no node before slide 4, so the early slides park it below the frame
 * rather than fading it in: a hand that materialises in mid-air reads as a
 * glitch, one that rises into shot reads as the point. And it never moves once
 * it has arrived — Figma's later slides drift it around while it fades, which
 * on a page reads as the hand being dragged off rather than letting go.
 *
 * The asset was replaced for slides 4–6: a different cut-out at a different
 * aspect (500 x 942 rather than 476 x 1016), so every number here is the new
 * one and HAND_ASPECT moved with it.
 */
const HAND_REST = { c: [895, 929], w: 386 }
/** Parked below the frame. */
const HAND_BELOW = { c: [895, 1866], w: 500 }

export const HAND_POSE = [
  HAND_BELOW,
  HAND_BELOW,
  HAND_BELOW,
  { c: [895, 1246], w: 500 },
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
  HAND_REST,
]

/**
 * The hand's opacity, tracked separately from its movement.
 *
 * It starts going halfway through slide 4 → 5 — the moment the phone comes to
 * rest against the fingers — and is gone shortly after slide 5. Splitting it
 * from HAND_POSE is what allows that: the hand still travels and shrinks
 * across the whole of step 3 while the fade only occupies the back half of it.
 * Running both on one track would have delayed the movement too.
 */
export const HAND_FADE = [1, 1, 1, 1, 0.45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

/** Native size of `hand.webp`, so width alone can drive it. */
/**
 * Whether the cue's WORDS are showing. The disc is not affected — it is the
 * control, and it stays put for the whole sequence.
 *
 * "Scroll to explore" is an instruction, and it stops being true the moment the
 * page starts answering it. The hand first rises into frame over slide 3 -> 4,
 * so the label goes with it and comes back on the way up, which the scrub gives
 * for free.
 *
 * The last entry brings it back for the final slide, where the label has
 * changed to "Back to top" and is worth reading again.
 */
export const CUE_LABEL = [
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
]

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
  { c: [960, -96], w: 302, o: 1 },
  { c: [960, -530], w: 302, o: 1 },
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
// The last entry is slide 17, where Figma deletes the overlay. 86px of it are
// still inside the frame at slide 16, so it leaves on the scene's own rise.
/**
 * Only ONE of them travels now.
 *
 * The file used to move both washes up and out with the first act. It now keeps
 * a second Overlay pinned to the bottom of the frame on every slide from 1 to
 * 26 — the blur band is page furniture, not part of the scene that leaves. From
 * slide 17 the travelling one is gone and the pinned one is all that is left,
 * which is why the bottom of the page stays blurred for the whole scroll.
 *
 * Check it against the file by counting Overlay nodes per slide: one on 1-4,
 * two on 5-12, three on 13-16 (the travelling pair plus the pinned one), and
 * one from 17 on.
 */
const washAY = [858, 858, 858, 858, 858, 858, 858, 858, 858, 637, 351, 206, -136, -136, -136, -136, -570]
const washAO = [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
const washBO = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

export const WASH_A = washAY.map((y, i) => ({ y, o: washAO[i] }))
/** Pinned: same y on every slide, for the whole sequence. */
export const WASH_B = washBO.map((o) => ({ y: 858, o }))

/**
 * The gradient backdrop's own travel.
 *
 * Figma moves the background rectangle itself from slide 10, which is the file
 * saying "the page scrolls on now". Everything below where it ends up is plain
 * white — so the backdrop layer translates and the page shows through beneath
 * it, exactly as the design has it.
 */
export const BACKDROP_Y = [0, 0, 0, 0, 0, 0, 0, 0, 0, -221, -507, -652, -994, -994, -994, -994, -1428]

/* ------------------------------------------------------------ the third act */

/**
 * "One place for your whole health." and its paragraph.
 *
 * They rise from below the fold as the first act leaves, arriving blurred and
 * dim and resolving as they settle — the same treatment every other piece of
 * copy on this page gets.
 */
export const ACT3_HEAD = [
  // Waiting 221px below slide 10's pose — the page's own rise on that step, so
  // the copy arrives travelling rather than appearing in place.
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 1129], o: 0, b: 8 },
  { c: [960.5, 908], o: 0.4, b: 8 },
  { c: [960.5, 643], o: 1, b: 0 },
  { c: [960.5, 498], o: 1, b: 0 },
  { c: [960.5, 216], o: 1, b: 0 },
  { c: [960.5, 216], o: 1, b: 0 },
  { c: [960.5, 216], o: 1, b: 0 },
  // Slide 16: the third act leaves the way it arrived.
  { c: [960.5, 81], o: 0, b: 8 },
  { c: [960.5, -353], o: 0, b: 8 },
]

export const ACT3_BODY = [
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 1203], o: 0, b: 8 },
  { c: [960, 982], o: 0.2, b: 8 },
  { c: [960, 717], o: 1, b: 0 },
  { c: [960, 572], o: 1, b: 0 },
  { c: [960, 290], o: 1, b: 0 },
  { c: [960, 290], o: 1, b: 0 },
  { c: [960, 290], o: 1, b: 0 },
  { c: [960, 155], o: 0.2, b: 4 },
  { c: [960, -279], o: 0, b: 8 },
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
  { c: [960, 237], o: 0.4 },
  { c: [960, -197], o: 0 },
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
  // 16 and 17 carry the promo row off to the left as the fourth act arrives.
  { c: [502, 541], o: 1 },
  { c: [-212, 107], o: 1 },
  // Gone from slide 18 in the file. The row keeps drifting on its own axis
  // while the page carries it up, and fades out over that step.
  { c: [-926, -192], o: 0 },
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
    icon: 'tag-care',
    tag: 'Care',
    title: 'Give your mind the same attention',
  },
  {
    img: 'family',
    icon: 'tag-family',
    tag: 'Family',
    title: 'Health for the whole family',
  },
]


/* ------------------------------------------- the fourth and fifth acts */

/**
 * "Help for every part of your health." and the category pills under it.
 *
 * The fourth act arrives while the third is still leaving — slide 16 has the
 * new headline at 20% behind the old one at 0%. That overlap is the design's,
 * and it is what stops the page reading as a stack of separate sections.
 */
export const ACT4_HEAD = parked(15, { c: [960.5, 1106], o: 0, b: 8 }, [
  { c: [960.5, 971], o: 0.2, b: 8 },
  { c: [960.5, 537], o: 1, b: 0 },
  { c: [960.5, 238], o: 1, b: 0 },
  { c: [960.5, 238], o: 1, b: 0 },
  { c: [960.5, 91], o: 0.3, b: 8 },
  { c: [960.5, -90], o: 0, b: 8 },
])

export const PILLS = parked(16, { c: [960, 1068], o: 0, b: 8 }, [
  { c: [960, 634], o: 1, b: 0 },
  { c: [960, 335], o: 1, b: 0 },
  { c: [960, 335], o: 1, b: 0 },
  { c: [960, 188], o: 0.6, b: 4 },
  { c: [960, 7], o: 0.2, b: 4 },
  { c: [960, -324], o: 0.2, b: 4 },
])

/**
 * The feature carousel.
 *
 * This track moves the whole carousel through the page. What the arrows move is
 * the row INSIDE it, which is not on the timeline at all — see CAROUSEL_ITEMS
 * and the note on the component. Slides 18 and 19 are identical here on
 * purpose: that is the stretch where the carousel stands still and the reader
 * drives it.
 */
export const CAROUSEL = parked(16, { c: [1668, 1387], o: 0 }, [
  { c: [1668, 953], o: 1 },
  { c: [960, 654], o: 1 },
  { c: [960, 654], o: 1 },
  { c: [960, 507], o: 1 },
  { c: [960, 326], o: 1 },
  { c: [960, -5], o: 1 },
  { c: [960, -264], o: 1 },
  // Off-frame on desktop from here, so the fade is invisible there. On a phone
  // the frame is shorter and the y compression (chipK 0.8) drags anything
  // parked above it back down — 41px of card text was showing under the nav.
  { c: [960, -264], o: 0 },
])

export const CAROUSEL_CTRL = parked(17, { c: [960, 1231], o: 0, b: 0 }, [
  { c: [960, 932], o: 1, b: 0 },
  { c: [960, 932], o: 1, b: 0 },
  { c: [960, 785], o: 1, b: 0 },
  { c: [960, 604], o: 1, b: 0 },
  { c: [960, 273], o: 0.2, b: 8 },
  { c: [960, 14], o: 0.2, b: 8 },
  { c: [960, -70], o: 0, b: 8 },
])

/** "See how Pura fits into one ordinary day." */
export const ACT5_HEAD = parked(19, { c: [956, 1177], o: 0, b: 8 }, [
  { c: [956, 1030], o: 1, b: 0 },
  { c: [956, 849], o: 1, b: 0 },
  { c: [956, 518], o: 1, b: 0 },
  { c: [956, 259], o: 1, b: 0 },
  // It hands over to the day itself from 24, and is gone by 26.
  { c: [956, 175], o: 0.3, b: 4 },
  { c: [956, 107], o: 0.1, b: 8 },
  { c: [956, 69], o: 0, b: 8 },
])

/**
 * The day timeline: a 10,741px ruler that slides left as the page scrolls, so
 * the hours pass under a fixed marker. Rebuilt as repeating CSS rather than the
 * 241 individual rectangles Figma draws it with.
 */
export const TIMELINE = parked(20, { c: [6285.5, 1147], o: 0, b: 4 }, [
  { c: [6285.5, 966], o: 0.6, b: 4 },
  { c: [5931.5, 635], o: 0.6, b: 0 },
  { c: [5860.5, 376], o: 0.6, b: 0 },
  { c: [5593.5, 292], o: 0.6, b: 0 },
  { c: [5328.5, 224], o: 0.6, b: 0 },
  { c: [5328.5, 186], o: 0.6, b: 0 },
])

/**
 * The hour labels, as CENTRES in the ruler's own pixels.
 *
 * Taken one by one from the file rather than spaced evenly, because they are
 * not evenly spaced: Figma builds the ruler as an auto-layout row of 241 ticks
 * and labels, and a label's own width pushes its neighbours along. Spreading
 * them evenly puts 5:00 about a thousand pixels from where the design has it,
 * which matters here — the marker sits still and the ruler moves under it, so
 * a label in the wrong place tells the wrong time.
 *
 * The ruler runs 5:00 to midnight. Slides 21 to 23 travel from just before
 * 5:00 to exactly 6:00.
 */
export const RULER_HOURS = [
  ['5:00', 471],
  ['6:00', 1002.5],
  ['7:00', 1534],
  ['8:00', 2065.5],
  ['9:00', 2597.5],
  ['10:00', 3133],
  ['11:00', 3669.5],
  ['12:00', 4205],
  ['13:00', 4742],
  ['14:00', 5279.5],
  ['15:00', 5817.5],
  ['16:00', 6314.5],
  ['17:00', 6811],
  ['18:00', 7307.5],
  ['19:00', 7804.5],
  ['20:00', 8304],
  ['21:00', 8803],
  ['22:00', 9301],
  ['23:00', 9801],
  ['00:00', 10303.5],
]

export const TIMELINE_DOT = parked(20, { c: [960, 1105], o: 0, b: 4 }, [
  { c: [960, 924], o: 0.4, b: 4 },
  { c: [960, 593], o: 1, b: 0 },
  { c: [960, 334], o: 1, b: 0 },
  { c: [960, 250], o: 1, b: 0 },
  { c: [960, 182], o: 1, b: 0 },
  { c: [960, 144], o: 1, b: 0 },
])

/**
 * The day's media panel. It does not fade in — it GROWS, from a 154x88 pill
 * into a 764x437 stadium, and its corner radius grows with it so the shape
 * stays a stadium the whole way rather than becoming a rounded rectangle.
 */
/**
 * Slide 26: the day resolves into the app.
 *
 * The photo panel slides right and stands up, and a phone arrives in the middle
 * showing the same morning greeting the copy on the left is saying. Everything
 * here is new at slide 26, so it waits 38px below its pose — the page's own
 * rise on the 25 -> 26 step, which the ruler and the marker both confirm
 * (224 -> 186 and 182 -> 144).
 */
const RISE_26 = 38

export const GREETING = parked(25, { c: [391.5, 417 + RISE_26], o: 0, b: 6 }, [
  { c: [391.5, 417], o: 1, b: 0 },
])

export const GREETING_BODY = parked(25, { c: [387.5, 527 + RISE_26], o: 0, b: 6 }, [
  { c: [387.5, 527], o: 1, b: 0 },
])


export const DAY_MEDIA = parked(21, { c: [960, 1086], w: 154, h: 88, r: 150, o: 0 }, [
  { c: [960, 755], w: 154, h: 88, r: 150, o: 1 },
  { c: [960, 670.5], w: 764, h: 437, r: 290, o: 1 },
  { c: [960, 670.5], w: 1058, h: 605, r: 160, o: 1 },
  { c: [960, 629.5], w: 1152, h: 659, r: 150, o: 1 },
  // Slide 26: it slides right and stands up, making room for the phone.
  { c: [1420, 651], w: 920, h: 778, r: 60, o: 1 },
])

/** The category pills, in order. The first is the selected one. */
export const PILL_LABELS = [
  'My Health',
  'Heart and Metabolism',
  'Sleep and Stress',
  'Care',
  'Wellness',
  "Women's Health",
]

/**
 * What the carousel holds: a lead photograph, then five feature cards.
 *
 * `fill` is how far along the card's little progress bar runs, as a fraction —
 * Figma draws it as a 212px track with a coloured bar over it.
 */
export const CAROUSEL_ITEMS = [
  { kind: 'photo', img: 'lead', alt: 'Someone checking their health on the Pura app' },
  {
    kind: 'card',
    label: 'PureScore',
    value: '92',
    caption: '+8 pts · Great',
    fill: 0.28,
    title: 'PureScore',
    body: 'One score for your overall health, built from your lab results and wearable data, with what moved it explained in plain words.',
  },
  {
    kind: 'card',
    label: 'Health systems',
    value: '2 of 4',
    caption: 'Cardiovascular · worth a look',
    fill: 0.5,
    title: 'Health systems',
    body: 'Your results grouped by body system, from heart and metabolism to liver and kidneys, each with a simple status.',
  },
  {
    kind: 'card',
    label: 'Wearable data',
    value: '70 bpm',
    caption: 'Resting heart rate · synced',
    fill: 0.62,
    title: 'Wearable data',
    body: 'Sleep, heart rate and activity from the wearable you already use, shown beside your lab results.',
  },
  {
    kind: 'card',
    label: 'Digital Twin',
    value: '12 mo',
    caption: 'Illustrative projection',
    fill: 0.8,
    title: 'Digital Twin',
    body: 'See how your health could change over 3, 6 and 12 months, and try a change before you commit to it.',
  },
  {
    kind: 'card',
    label: 'Medical history',
    value: 'Synced',
    caption: 'Records and past results',
    fill: 1,
    title: 'Medical history',
    body: "Bring past results and records into one place, so Pura starts from what's already known about you.",
  },
]

/** Carousel geometry, in frame pixels. */
export const CAROUSEL_GEO = { rowPad: 140, item: 300, gap: 24, photoH: 420, cardH: 424 }

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
 * move — but the handover from hand to device is not one. The hand lets go
 * while the device climbs away, and both happening at once reads as the phone
 * escaping rather than being released. So the fade goes first and the device
 * only starts climbing as it finishes, with a short overlap, because a clean
 * handover would be a stop and a restart.
 *
 * Keyed by step index: step 3 is slide 4 → slide 5, step 4 is slide 5 → 6.
 */
export const STEP_WINDOWS = {
  // The fade begins halfway through step 3 and finishes early in step 4; the
  // hand's movement is untouched and still runs both steps end to end.
  handFade: { 3: [0.5, 1], 4: [0, 0.4] },
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
