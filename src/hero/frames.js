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
export const SLIDES = 36

/**
 * `n` slides holding the same value.
 *
 * Every full-length table below has to be exactly `SLIDES` long, and a miscount
 * does not fail — it shifts everything after it by one slide and looks like a
 * choreography bug. Counting is what this is for; `assertLengths` at the foot
 * of the file checks the result.
 */
const hold = (n, v) => Array(n).fill(v)

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
  // Slides 18-24: parked where slide 26 wants it, one page-rise below. The jump
  // from off the top to down here happens while DEVICE_FADE holds it at zero,
  // so nothing sweeps across the frame to get there.
  ...hold(7, { c: [959.7, 650.7 + 38], s: ai(663), r: FACE }),
  // Slide 25: the file has it half a frame lower, rising. That entrance is the
  // reason the landing on 26 reads as a landing rather than as an appearance.
  { c: [959.7, 1266.7], s: ai(663), r: FACE },
  // Slide 26: it lands, face on, at the size the file's phone group is — and
  // there it stays for the rest of the day. Slides 27 to 36 move the
  // photograph and the copy around it; the only thing that changes about the
  // phone itself is what is on its screen.
  ...hold(11, { c: [959.7, 570.7], s: ai(663), r: FACE }),
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
  ...hold(13, 1), // 1-13
  ...hold(11, 0), // 14-24
  // Back from slide 25, and it stays for the whole day.
  ...hold(12, 1), // 25-36
]

/**
 * From which slide the device draws IN FRONT of the Overlay.
 *
 * Up to here the wash is over the phone on purpose — it dissolves its foot,
 * which is what makes the resting state read as settled rather than cropped.
 * From the day's first scene the phone is the SUBJECT, so it comes forward and
 * the wash blurs only the photograph behind it. That is the order the file has
 * had since slide 25.
 *
 * This is a z-index, so it cannot be tweened: a fractional z-index is not a
 * valid value. It is a hard switch at a slide boundary instead, made one slide
 * early, while `DEVICE_FADE` still holds the device at zero and nothing can be
 * seen to change.
 */
export const DEVICE_FRONT_FROM = 25

/**
 * Where the phone is allowed to watch the cursor.
 *
 * Only slide 26, where it is face-on (`FACE` is [0, 0, 0]) and at rest at the
 * end of the sequence. Everywhere else it is mid-arc under the timeline's
 * control, and a second hand on the rotation would read as a fault rather than
 * as life. The timeline tweens this value like any other, so the tilt eases in
 * across the step into 26 instead of switching on.
 */
export const DEVICE_TILT = [
  ...hold(25, 0), // 1-25
  // Slides 26 to 36: face on, at rest, and watching the cursor.
  ...hold(11, 1),
]

/**
 * Which screen the phone is showing, as an INDEX into `SCREEN_URLS`.
 *
 * It used to be a 0-to-1 mix between two textures. The day needs six, so it is
 * an index now and the renderer crossfades between `floor` and `ceil` of it —
 * which means the ORDER of `SCREEN_URLS` is load-bearing. Consecutive slides
 * must differ by at most one step, or the crossfade passes through whatever
 * happens to sit between them and a wrong screen flashes up mid-scroll. The
 * list is ordered backwards through the day for exactly that reason: the
 * sequence walks 6 -> 7 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1 -> 0 and never skips.
 *
 * The list is: the day's six screens in reverse (f, e, d, c, b, a), then the
 * Home screen and Pura AI. Reversed because the day is the long walk and it
 * has to be the contiguous run.
 *
 * It crossfades across the turn to face-on, so the content changes while the
 * device is moving rather than snapping while it is sitting still.
 */
export const SCREEN_SEQ = [
  ...hold(6, 6), // 1-6    the Home screen
  ...hold(11, 7), // 7-17  Pura AI
  6, // 18       one step back down, so 7 -> 5 never skips 6
  ...hold(9, 5), // 19-27  the day's first screen, arriving while nothing shows
  // The day. Each scene brings its own screen; it changes on the SETTLED
  // slide and holds through the transition after it, which is the rule the
  // copy follows too — so the two can never disagree.
  4, 4, // 28-29
  3, 3, // 30-31
  2, 2, // 32-33
  1, 1, // 34-35
  0, //    36
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
export const CUE_LABEL = [...hold(3, 1), ...hold(32, 0), 1]

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
 * new headline already at full strength behind the old one at 0%. That overlap
 * is the design's, and it is what stops the page reading as a stack of separate
 * sections. The file used to bring it in at 20%; it now arrives resolved.
 */
export const ACT4_HEAD = parked(15, { c: [960.5, 1106], o: 0, b: 8 }, [
  { c: [960.5, 971], o: 1, b: 0 },
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
  // The file keeps this at 20% for the rest of the page. Off the top of a
  // 1920x1080 frame that is invisible, but a phone's frame is shorter and the
  // y compression drags anything parked above it back down — so it is taken to
  // zero here for the same reason the carousel itself is. See CAROUSEL.
  { c: [960, -66], o: 0, b: 8 },
])

/** "See how Pura fits into one ordinary day." */
export const ACT5_HEAD = parked(19, { c: [956, 1177], o: 0, b: 8 }, [
  // It now announces itself twice as quietly on the way in as it used to: the
  // file holds it at 30% for two slides while the carousel is still the
  // subject, and only resolves it once the carousel has started to leave.
  { c: [956, 1030], o: 0.3, b: 4 },
  { c: [956, 849], o: 0.3, b: 4 },
  { c: [956, 518], o: 1, b: 0 },
  { c: [956, 259], o: 1, b: 0 },
  // It hands over to the day itself from 24, and is gone by 26.
  { c: [956, 95], o: 0.3, b: 4 },
  { c: [956, 27], o: 0, b: 8 },
  { c: [956, -11], o: 0, b: 8 },
])

/**
 * The day timeline: a 10,741px ruler that slides left as the page scrolls, so
 * the hours pass under a fixed marker. Rebuilt as repeating CSS rather than the
 * 241 individual rectangles Figma draws it with.
 */
export const TIMELINE = parked(20, { c: [5929.5, 1147], o: 0, b: 4 }, [
  { c: [5929.5, 966], o: 0.6, b: 4 },
  // FOLLOWED LITERALLY, AND IT IS ODD: the file puts slide 22's ruler 196px to
  // the RIGHT of slide 21's, which under a scrub is the clock running backwards
  // for one step before it carries on. Every other step decreases. Flagged in
  // CONTEXT.md; the fix is a nudge in Figma, not a correction here.
  { c: [6125.5, 635], o: 0.6, b: 0 },
  { c: [5860.5, 376], o: 0.6, b: 0 },
  { c: [5593.5, 212], o: 0.6, b: 0 },
  { c: [5328.5, 144], o: 0.6, b: 0 },
  // Slide 26 onwards the ruler is the clock for the day. Each pair of slides
  // holds one hour under the marker: the settled slide moves it, the
  // transition after it does not. Read off the file as the Timeline
  // instance's own x plus half its 10,741px width.
  { c: [4794.5, 106], o: 0.6, b: 0 },
  { c: [4794.5, 106], o: 0.6, b: 0 },
  { c: [3735.5, 106], o: 0.6, b: 0 },
  { c: [3735.5, 106], o: 0.6, b: 0 },
  { c: [2125.5, 106], o: 0.6, b: 0 },
  { c: [2125.5, 106], o: 0.6, b: 0 },
  // The file has slide 32 six pixels higher than its neighbours. Held level
  // here: a one-slide jog up and back is a twitch, not a move. Flagged too.
  { c: [1049.5, 106], o: 0.6, b: 0 },
  { c: [1049.5, 106], o: 0.6, b: 0 },
  { c: [15.5, 106], o: 0.6, b: 0 },
  { c: [15.5, 106], o: 0.6, b: 0 },
  { c: [-3470.5, 106], o: 0.6, b: 0 },
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
 * The ruler runs 5:00 to midnight, and the marker sits at frame x 960. An
 * hour is therefore `960 - (TIMELINE.c[0] - 5370.5)` looked up below, which is
 * the arithmetic to check a ruler position with:
 *
 *   slide 23 -> 470 (5:00)    slide 30 -> 4205 (12:00)
 *   slide 26 -> 1536 (7:00)   slide 32 -> 5281 (14:00)
 *   slide 28 -> 2595 (9:00)   slide 34 -> 6315 (16:00)
 *                             slide 36 -> 9801 (23:00), which is what "lights
 *                                         out by 11" on that slide says.
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
  { c: [960, 170], o: 1, b: 0 },
  { c: [960, 102], o: 1, b: 0 },
  // Slide 26 onward. The whole day sits 80px higher than it used to, which is
  // the room the navigation used to take up in the file.
  { c: [960, 64], o: 1, b: 0 },
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

/* ------------------------------------------------------------------- the day */

/**
 * Slides 26 to 36 are six SCENES joined by five TRANSITIONS.
 *
 * A scene owns a photograph, a headline, the screen the phone is showing and —
 * for the first one only — a paragraph. A transition changes ONLY the
 * photograph, which is why the copy on slide 27 is still slide 26's and why the
 * ruler holds its hour across the pair. Settled slides are the even ones (26,
 * 28, 30, 32, 34, 36); the odd slides between them are the transitions.
 *
 * The phone does not move again after slide 26. Everything that happens for the
 * next ten slides happens either inside the panel or on its screen.
 */

/**
 * The panel the day plays out in: one fixed box on the right of the frame.
 * After slide 26 it never moves, so its numbers are a constant rather than a
 * table.
 */
const PANEL = { cx: 1366, top: 182, bottom: 960, w: 812, h: 778, r: 60 }

/**
 * The panel's top edge — the line every scene image hangs from.
 *
 * Exported because the timeline needs it to work out each shutter's image
 * offset, and a second copy of the number over there is exactly the kind of
 * thing that survives a redesign and then quietly disagrees. It moved 80px the
 * first time the file dropped the navigation.
 */
export const PANEL_TOP = PANEL.top

/** And its height, for the same reason. */
export const PANEL_H = PANEL.h

/**
 * Half the panel, which is where two photographs meet mid-transition. 778 does
 * not halve to this: the file leaves a 16px gap between the two windows.
 */
const HALF = 381

/**
 * One window onto a scene's photograph.
 *
 * The photograph NEVER MOVES. The window is a shutter over it, and `ih` is what
 * says so — the image keeps its full panel height whatever the window is doing,
 * and the track offsets it by however far the window's top has drifted from the
 * panel's. Let the image fill the window instead and it rescales as the window
 * shrinks, which reads as a squash rather than as a reveal.
 *
 * Every phase below leaves the image's top at `PANEL.top`, so a tween between
 * any two of them holds it perfectly still. That is the whole trick, and it is
 * why none of these rows needs to carry an image offset: it is derivable.
 */
const shutter = (top, h) => ({
  c: [PANEL.cx, top + h / 2],
  w: PANEL.w,
  h,
  r: PANEL.r,
  o: 1,
  ih: PANEL.h,
})

/** Shut against the bottom of the panel: a scene that has not arrived yet. */
const SHUT_LOW = shutter(PANEL.bottom, 0)
/** Half open from the bottom: a scene arriving. */
const RISING = shutter(PANEL.bottom - HALF, HALF)
/** The whole panel: the scene being told. */
const OPEN = shutter(PANEL.top, PANEL.h)
/** Half open from the top: a scene being pushed out by the next one. */
const LEAVING = shutter(PANEL.top, HALF)
/** Shut against the top: a scene that is over. */
const SHUT_HIGH = shutter(PANEL.top, 0)

/** How far a block of copy waits below its pose, and leaves above it. */
const COPY_RISE = RISE_26

/**
 * One block of copy's whole life, from its Figma box and the slide it belongs
 * to.
 *
 * Regular enough to generate: every block waits one rise below its pose, comes
 * up and into focus on its scene's settled slide, holds through the transition
 * after it, then carries on up and out. Writing ten of these by hand would be
 * ten chances to mistype a number the file states once.
 */
const copyTrack = ([x, y, w, h], settled) => {
  const c = [x + w / 2, y + h / 2]
  return parked(settled - 1, { c: [c[0], c[1] + COPY_RISE], o: 0, b: 6 }, [
    { c, o: 1, b: 0 },
    { c, o: 1, b: 0 },
    { c: [c[0], c[1] - COPY_RISE], o: 0, b: 6 },
  ])
}

/** A scene's window, from the slide it settles on. */
const mediaTrack = (settled) =>
  parked(settled - 2, SHUT_LOW, [RISING, OPEN, LEAVING, SHUT_HIGH])

/**
 * Slide 26: the day resolves into the app.
 *
 * The photo panel slides right and stands up, and a phone arrives in the middle
 * showing the same morning greeting the copy on the left is saying. Everything
 * here is new at slide 26, so it waits 38px below its pose — the page's own
 * rise on the 25 -> 26 step, which the ruler and the marker both confirm
 * (224 -> 186 and 182 -> 144).
 *
 * Scene A's window is this one rather than a `mediaTrack`, because it does not
 * arrive: it is the panel the carousel act already grew, inherited and then
 * shuttered away like the rest.
 */
export const DAY_MEDIA = parked(21, { c: [960, 1086], w: 154, h: 88, r: 150, o: 0 }, [
  { c: [960, 755], w: 154, h: 88, r: 150, o: 1 },
  { c: [960, 670.5], w: 764, h: 437, r: 290, o: 1 },
  { c: [960, 590.5], w: 1058, h: 605, r: 160, o: 1 },
  { c: [960, 549.5], w: 1152, h: 659, r: 150, o: 1 },
  // Slide 26: it slides right and stands up, making room for the phone. From
  // here it is a shutter, so it carries `ih` — which happens to equal its own
  // height on this slide, making the handover from filling to shuttering
  // invisible. `OPEN` IS that pose, which is the point: one constant describes
  // both the end of the growth and the start of the day.
  OPEN,
  LEAVING,
  SHUT_HIGH,
])

/**
 * The six scenes, in order.
 *
 * `screen` indexes `SCREEN_URLS` — see `SCREEN_SEQ` for why that list runs
 * backwards through the day. `bodyBox` is optional: the file gives only the
 * first scene a paragraph.
 */
export const DAY_SCENES = [
  {
    key: 'a',
    settled: 26,
    media: '/assets/day/scene-a.jpg',
    alt: 'A morning walk, tracked by Pura',
    screen: 5,
    head: 'Good morning, your health plan has kicked off.',
    body: 'Your Pura opens to one clear focus: a walk after lunch, a whole-grain swap and lights out by 11.',
    headBox: [148, 320, 487, 120],
    bodyBox: [148, 464, 479, 52],
    window: DAY_MEDIA,
  },
  {
    key: 'b',
    settled: 28,
    media: '/assets/day/scene-b.jpg',
    alt: 'A digital twin of the body, with the day\u2019s signals around it',
    screen: 4,
    head: 'Your score moved overnight with a pattern worth discussing with your doctor.',
    headBox: [148, 320, 487, 160],
    window: mediaTrack(28),
  },
  {
    key: 'c',
    settled: 30,
    media: '/assets/day/scene-c.jpg',
    alt: 'Lunch at home, logged in the app',
    screen: 3,
    head: 'Lunch was a solid choice today. However, your HbA1c from lab is 6.1, just nudging above normal.',
    headBox: [148, 320, 555, 160],
    window: mediaTrack(30),
  },
  {
    key: 'd',
    settled: 32,
    media: '/assets/day/scene-d.jpg',
    alt: 'A consultation on the phone, at home',
    screen: 2,
    head: 'Good morning, your appointment with Dr. El-Sayed has been confirmed.',
    headBox: [148, 277, 487, 160],
    window: mediaTrack(32),
  },
  {
    key: 'e',
    settled: 34,
    media: '/assets/day/scene-e.jpg',
    alt: 'Medication delivered to the door',
    screen: 1,
    head: 'Good afternoon, your medication has been delivered. Take care of yourself.',
    headBox: [148, 320, 487, 160],
    window: mediaTrack(34),
  },
  {
    key: 'f',
    settled: 36,
    media: '/assets/day/scene-f.jpg',
    alt: 'Winding down at the end of the day',
    screen: 0,
    head: 'Lights out by 11. Prioritise a smooth wind down to help you recharge.',
    headBox: [148, 320, 424, 160],
    window: mediaTrack(36),
  },
].map((scene) => ({
  ...scene,
  headAt: copyTrack(scene.headBox, scene.settled),
  // Only scene A carries a paragraph now. The rest say it all in the greeting,
  // and a `bodyAt` of null is what tells the timeline and the phone's measured
  // stack there is nothing under the headline to seat.
  bodyAt: scene.bodyBox ? copyTrack(scene.bodyBox, scene.settled) : null,
}))

export const DAY_PILL_LABELS = [
  ['Virtual consultations', 162],
  ['Prescriptions', 111],
  ['Home Sample test', 145],
  ['Care Plans', 97],
]
/**
 * One row of four now, 39px tall, not two wrapped rows. The file gives the row
 * a fixed 623px box that its four chips do not fill — they run to 575 with a
 * 20px gap and the rest is slack — so the box is the tracked thing and the
 * chips are left-aligned inside it.
 */
export const DAY_PILL_ROW_W = 623
export const DAY_PILL_GAP = 20
export const DAY_PILLS = copyTrack([148, 475, DAY_PILL_ROW_W, 39], 32)

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
 * What the carousel holds, per tab.
 *
 * The file draws seven versions of this band — one on Slides 18/19 and five
 * more as the `Carousel Selection 2..6` frames — and the only thing that
 * changes between them is the TITLE and BODY of each card. The little
 * visualisation at the top of every card is the same four widgets in the same
 * order on every tab, because in the file they are the same instances: the
 * designer swapped the words and left the chrome alone.
 *
 * So the chrome is written once and the tabs carry copy. Writing all thirty
 * cards out longhand would be thirty chances for the chrome to drift apart,
 * which is the one thing the file guarantees it never does.
 *
 * `fill` is how far along the card's little progress bar runs, as a fraction —
 * Figma draws it as a 212px track with a coloured bar over it.
 */
const LEAD = {
  kind: 'photo',
  img: 'lead',
  alt: 'Someone checking their health on the Pura app',
}

const WIDGETS = [
  { label: 'PureScore', value: '92', caption: '+8 pts \u00b7 Great', fill: 0.28 },
  { label: 'Health systems', value: '2 of 4', caption: 'Cardiovascular \u00b7 worth a look', fill: 0.5 },
  { label: 'Wearable data', value: '70 bpm', caption: 'Resting heart rate \u00b7 synced', fill: 0.62 },
  { label: 'Digital Twin', value: '12 mo', caption: 'Illustrative projection', fill: 0.8 },
  { label: 'Medical history', value: 'Synced', caption: 'Records and past results', fill: 1 },
]

/** One tab's band: the lead photograph, then a card per line of copy. */
const deck = (cards) => [
  LEAD,
  ...cards.map(([title, body], i) => ({ kind: 'card', ...WIDGETS[i], title, body })),
]

/**
 * One deck per tab, in `PILL_LABELS` order. The tabs are a real control — see
 * the note on the carousel in App.jsx — so this is indexed at runtime rather
 * than being a constant like everything else in this file.
 */
export const CAROUSEL_TABS = [
  // My Health
  deck([
    [
      'PureScore',
      'One score for your overall health, built from your lab results and wearable data, with what moved it explained in plain words.',
    ],
    [
      'Health systems',
      'Your results grouped by body system, from heart and metabolism to liver and kidneys, each with a simple status.',
    ],
    [
      'Wearable data',
      'Sleep, heart rate and activity from the wearable you already use, shown beside your lab results.',
    ],
    [
      'Digital Twin',
      'See how your health could change over 3, 6 and 12 months, and try a change before you commit to it.',
    ],
    [
      'Medical history',
      "Bring past results and records into one place, so Pura starts from what's already known about you.",
    ],
  ]),
  // Heart and Metabolism
  deck([
    [
      'Blood sugar',
      'See where your HbA1c sits and which everyday habits, like movement and sleep, can help bring it into range.',
    ],
    [
      'Cholesterol',
      'Your lipid results explained in plain language and tracked across every test you take.',
    ],
    [
      'Resting heart rate',
      'Follow your resting heart rate day to day and see how habits and stress affect it.',
    ],
    [
      'Home lab tests',
      'Book a blood test at home. Results flow straight into your health picture.',
    ],
  ]),
  // Sleep and Stress
  deck([
    [
      'Sleep duration',
      'See how long and how consistently you sleep, from your connected wearable.',
    ],
    [
      'Heart rate variability',
      'Track HRV as a signal of recovery and stress, and see what helps you bounce back.',
    ],
    ['Bedtime goal', 'Set a simple bedtime goal and tick it off each day.'],
    [
      'Mental wellness support',
      'Speak to a mental health specialist by video when you want support.',
    ],
  ]),
  // Care
  deck([
    [
      'Online Doctor',
      'See a UAE-licensed doctor by video, choosing by specialty and language.',
    ],
    [
      'Prescriptions delivered',
      'Your e-prescription goes to a licensed pharmacy and arrives at your door.',
    ],
    [
      'Insurance checked',
      'Pura checks your insurance eligibility before you book, so you see the cost up front.',
    ],
    [
      'Care Plans',
      'Doctor-led plans that bring consultations, medication and tests together for ongoing conditions.',
    ],
  ]),
  // Wellness
  deck([
    [
      'Goals and check-ins',
      'Daily goals tied to your results, with quick check-ins to keep you on track.',
    ],
    ['Challenges', 'Join community challenges or start one with friends and family.'],
    ['FitCoins', 'Earn FitCoins automatically as you hit goals and finish challenges.'],
    ['Rewards', 'Spend FitCoins on rewards from Pura partners across the UAE.'],
  ]),
  // Women's Health
  deck([
    ['PregnaCare', 'Week-by-week guidance through pregnancy, grounded in clinical advice.'],
    [
      'Pregnancy dashboard',
      'A personal view of your blood results, lifestyle and symptoms, in one place.',
    ],
    [
      'Gynaecologist consultations',
      'Speak to a gynaecologist by video when you have a question.',
    ],
  ]),
]

/** The band the page opens on. */
export const CAROUSEL_ITEMS = CAROUSEL_TABS[0]

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

/**
 * Every table that is read by slide number has to be exactly `SLIDES` long.
 *
 * `at()` clamps, so a table that is one short does not throw — it silently
 * repeats its last row for the missing slide and everything after the miscount
 * happens one step early. That has cost an afternoon twice. The check is cheap
 * and DEV-only, and it names the table rather than making you count.
 */
if (import.meta.env?.DEV) {
  const full = {
    DEVICE_POSE,
    DEVICE_FADE,
    DEVICE_TILT,
    SCREEN_SEQ,
    CUE_LABEL,
    STEP_WEIGHTS: [...STEP_WEIGHTS, null], // one shorter by definition
  }
  for (const [name, table] of Object.entries(full)) {
    if (table.length !== SLIDES) {
      console.error(`frames.js: ${name} has ${table.length} rows, expected ${SLIDES}`)
    }
  }
}
