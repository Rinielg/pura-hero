import { ClampToEdgeWrapping, LinearFilter, SRGBColorSpace, Texture } from 'three'

/**
 * Turn a decoded image into a drop-in replacement for the display's wallpaper.
 *
 * The crop is done in UV space — `repeat` and `offset` on the texture — rather
 * than by redrawing pixels, so nothing is resampled.
 *
 * The shape to crop to comes from the MESH rather than from the stock texture.
 * Those two disagree on this model: the texture is 1024×2048 (1:2) and the
 * screen is 72.8 × 158.3 mm (1:2.174), with UVs running 0→1 across the whole
 * surface, so the stock wallpaper is displayed about 9% taller than it was
 * drawn. Cropping to the geometry is what makes a real screenshot land
 * undistorted — which matters here, because the screenshot is the Pura UI and a
 * 9% vertical stretch on a product screen is the kind of thing that ships.
 */
export function makeScreenTexture(image, display) {
  const texture = new Texture(image)

  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  const original = display?.texture
  const targetAspect =
    display?.aspect ?? (original?.image?.width ?? 1024) / (original?.image?.height ?? 2048)
  const sourceAspect = sourceHeight ? sourceWidth / sourceHeight : targetAspect

  // Cover: fill the display, crop the overhang, never letterbox. Centred, which
  // is also why flipY doesn't complicate the offset — a centred crop is
  // symmetrical on both axes.
  let repeatX = 1
  let repeatY = 1
  if (sourceAspect > targetAspect) repeatX = targetAspect / sourceAspect
  else repeatY = sourceAspect / targetAspect

  texture.colorSpace = SRGBColorSpace
  texture.repeat.set(repeatX, repeatY)
  texture.offset.set((1 - repeatX) / 2, (1 - repeatY) / 2)
  // Clamped, or the cropped-away edges wrap around and bleed back in.
  texture.wrapS = ClampToEdgeWrapping
  texture.wrapT = ClampToEdgeWrapping
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false

  if (original) {
    // glTF textures are flipY:false. Getting this wrong shows up as an
    // upside-down screen, which is obvious — unlike the UV channel, which
    // silently samples the wrong coordinates.
    texture.flipY = original.flipY
    texture.channel = original.channel
  }
  texture.needsUpdate = true
  return texture
}

/** Decode a Blob into an <img>. */
export function loadImageElement(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not decode the screen image'))
    }
    image.src = url
  })
}
