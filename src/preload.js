/**
 * What the page waits for, and what it quietly fetches afterwards.
 *
 * The sequence is one continuous move over about forty megabytes of
 * photographs, app screens and a glTF phone. Almost none of that is needed to
 * draw the first frame, and waiting for all of it would put a loading screen in
 * front of the reader for several seconds of nothing.
 *
 * So there are two tiers, and the split is the whole design:
 *
 *   CRITICAL — what slide 1 is made of. The phone model, the screen it is
 *   showing, the hand, the gradient behind it, and the brand face. The loader
 *   holds until these are in, because every one of them is visible in the first
 *   frame and any of them arriving late is a visible pop.
 *
 *   DEFERRED — everything below. The carousel's panels, the day's photographs,
 *   the closing rows. Those are ordinary `<img>` elements in fixed layers, so
 *   they are in the DOM from the first paint whether anyone has scrolled to
 *   them or not, and the browser will happily fetch all hundred and forty of
 *   them at once. They carry `fetchpriority="low"` in App.jsx instead, which is
 *   what keeps them from starving the things above — before that, the phone's
 *   own screen textures were not getting a connection for fourteen seconds.
 *
 * Progress is REAL. Each task carries a weight roughly proportional to its
 * bytes, and the bar reports what has actually landed rather than easing to
 * 90% and sitting there. The one concession is `DEADLINE`: a task that never
 * settles must not strand the page behind an overlay, so the whole thing
 * releases after it regardless.
 */

/** How long the loader may hold the page, whatever happens. */
const DEADLINE = 12000

/** key -> { weight, done }. Insertion order is irrelevant; only the sum is. */
const tasks = new Map()
const listeners = new Set()
let released = false

/**
 * Whether `begin` has run.
 *
 * Without this the loading screen would never be seen. React runs a child's
 * effects BEFORE its parent's, so `Preloader` subscribes a beat before `App`
 * claims anything — and an empty task set is, quite correctly, complete. The
 * flag makes "nobody has asked for anything yet" and "everything asked for has
 * arrived" two different answers instead of the same one.
 */
let started = false
/** `begin` is idempotent: StrictMode mounts every effect twice in development. */
let beginning = null

function emit() {
  const p = progress()
  for (const fn of listeners) fn(p, released)
}

/** Declare a task the loader should wait for, and how heavy it is. */
export function claim(key, weight = 1) {
  if (!tasks.has(key)) {
    tasks.set(key, { weight, done: false })
    emit()
  }
}

/** Mark one done. Safe to call twice, and safe to call for an unknown key —
 *  a task that was never claimed cannot hold anything up. */
export function settle(key) {
  const task = tasks.get(key)
  if (!task || task.done) return
  task.done = true
  emit()
}

/** 0 to 1, by weight. Nothing claimed yet is 0; nothing left to claim is 1. */
export function progress() {
  if (!started) return 0
  let total = 0
  let done = 0
  for (const t of tasks.values()) {
    total += t.weight
    if (t.done) done += t.weight
  }
  return total === 0 ? 1 : done / total
}

export function subscribe(fn) {
  listeners.add(fn)
  fn(progress(), released)
  return () => listeners.delete(fn)
}

/** Force the end of the wait — the deadline, or a hard failure. */
export function release() {
  if (released) return
  released = true
  emit()
}

/**
 * Fetch and DECODE an image.
 *
 * `decode()` is the part that matters: a loaded image is still a compressed
 * buffer, and the decode happens on first paint — which for a 3MB photograph is
 * a dropped frame at exactly the moment it animates in. Awaiting it here moves
 * that cost into the loader, where there is nothing to drop.
 *
 * It never rejects. A missing asset is a gap in the page, not a reason to hold
 * the reader behind an overlay for ever.
 */
export function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => (img.decode ? img.decode().then(resolve, resolve) : resolve())
    img.onerror = resolve
    img.src = url
  })
}

/** The phone model and its nine screens, reported by Device.jsx. */
export const DEVICE_MODEL = 'device:model'
export const DEVICE_SCREENS = 'device:screens'

/** Everything in the first frame that is not the device. */
function criticalImages(phone) {
  return [
    '/assets/hand.webp',
    phone ? '/bg/gradient-bg-mobile.jpg' : null,
    '/assets/pura-logo.svg',
  ].filter(Boolean)
}

/**
 * Start the critical wait.
 *
 * Returns a promise that settles when the page may be shown. The device's two
 * tasks are claimed here rather than by the device itself, so that a Canvas
 * that never mounts — WebGL unavailable, say — is still accounted for and still
 * released by the deadline.
 */
export function begin({ phone }) {
  if (beginning) return beginning
  started = true
  const images = criticalImages(phone)
  for (const url of images) claim(`img:${url}`, 1)
  claim(DEVICE_MODEL, 6)
  claim(DEVICE_SCREENS, 6)
  claim('fonts', 1)

  for (const url of images) loadImage(url).then(() => settle(`img:${url}`))

  // The brand face is loaded by the document, not by us. `fonts.ready` is the
  // supported way to wait for it; it resolves on its own if nothing is pending.
  const fonts = document.fonts?.ready ?? Promise.resolve()
  fonts.then(() => settle('fonts'), () => settle('fonts'))

  const timer = setTimeout(release, DEADLINE)

  beginning = new Promise((resolve) => {
    const stop = subscribe((p, done) => {
      if (p < 1 && !done) return
      clearTimeout(timer)
      // Defer so the bar is painted at 100% rather than jumping straight from
      // wherever it was to gone.
      requestAnimationFrame(() => {
        stop()
        resolve()
      })
    })
  })
  return beginning
}
