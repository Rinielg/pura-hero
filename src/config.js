/** Fixed scene setup — the things that never change at runtime. */

/**
 * Which navigation the build ships.
 *
 * `'mvp'` is the first release: two items and a Partner with us dropdown, built
 * to the Figma `Menu MVP` page. `'full'` is the seven-group menu over the 23
 * inner pages, which is finished and kept — see `MENU` in site/content.js. The
 * routes stay mounted either way, so an inner page is still reachable by URL
 * and still links to its siblings; it is only the BAR that gets shorter.
 *
 * One switch rather than a deletion, because the full menu is a week of copy
 * that will be wanted back.
 */
export const NAVIGATION = 'mvp'

export const DEVICE = {
  /** The source model is authored in centimetres. 0.1 puts it in a sane scene
   *  scale; the hero's pose scale is applied on top of this, and the real size
   *  is measured from the asset rather than assumed (see Device.jsx). */
  scale: 0.1,
}

/**
 * Camera. A long-ish lens: at 28° the device's 3/4 pose keeps near-parallel
 * edges, which is what a product render looks like. A wider fov would splay
 * them and read as a phone photographed from too close.
 */
export const CAMERA = {
  position: [0, 0, 5.6],
  fov: 28,
}

/**
 * Render quality.
 *
 * Device pixel ratio dominates everything else here and it is quadratic, so
 * rendering at 2x instead of 1.5x is 1.8x the pixels every frame. On a page
 * where the device is in constant motion against a Lottie gradient, that is the
 * first thing to cap and the last thing anyone notices.
 */
export const QUALITY = {
  /** Capped at 1.5x. Above that the extra pixels are mostly invisible on a
   *  phone-sized object and the cost is quadratic. */
  dpr: [1, 1.5],
  /** Environment map the mirrored body samples. 128 squared is plenty for soft
   *  studio panels, and it is built once rather than per frame. */
  envResolution: 128,
  anisotropy: 4,
}
