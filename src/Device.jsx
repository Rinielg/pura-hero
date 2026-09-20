import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Box3, LinearSRGBColorSpace, MathUtils, Vector3 } from 'three'
import { DEVICE } from './config'
import variantData from './variants.json'
import { deviceProxy } from './deviceProxy'
import { loadImageElement, makeScreenTexture } from './screenTexture'
import { deviceRefHeight } from './hero/useHeroTimeline'

const MODEL_URL = '/models/iphone-18-pro.glb'
/** The two things the screen shows, crossfaded across the turn to face-on. */
/**
 * Every screen the phone shows, in the order `SCREEN_SEQ` walks them.
 *
 * Backwards through the day on purpose. The sequence is a tweened INDEX into
 * this list and the shader crossfades between the two entries either side of
 * it, so consecutive slides must be at most one step apart or the fade drags
 * through a screen that belongs to neither. Ordered like this the whole
 * sequence reads 4 -> 5 -> 4 -> 3 -> 2 -> 1 -> 0 and never skips.
 */
const SCREEN_URLS = [
  '/assets/day/ui-e.jpg', // 0  scene E - medication delivered
  '/assets/day/ui-d.jpg', // 1  scene D - the consultation
  '/assets/day/ui-c.jpg', // 2  scene C - the HbA1c answer
  '/assets/day/ui-b.jpg', // 3  scene B - the digital twin
  '/assets/pura-screen.jpg', // 4  Home
  '/assets/pura-ai-screen.jpg', // 5  Pura AI
]

/** Which entry the phone shows before anything has been tweened. */
const SCREEN_DEFAULT = 4

/** The colourway the hero uses. Black reads as one dark mass against the
 *  cream gradient, which makes the lit screen the brightest thing on the page —
 *  the opposite of the titanium, where the body competes with it. */
const FINISH = 'Black'

/**
 * The screen opts out of tone mapping entirely.
 *
 * ACES is right for the body — it is what keeps the highlights on a mirrored
 * rail from clipping — and wrong for a display, which is not a lit surface but
 * a source. Run the UI through it and the whites roll off to grey and the
 * accent colours desaturate. Excluding just this one material keeps the app
 * screen at the values it was designed at while the phone around it stays
 * filmic. Gain then stays at 1: there is nothing left to compensate for.
 */
const SCREEN_TONE_MAPPED = false

/** A transparent mesh covering at least this share of the display's area is
 *  treated as part of the display stack rather than as body detail. */
const COVER_AREA_SHARE = 0.5

/** What those layers reflect instead of the full environment. Low enough to
 *  read the screen through, high enough that the glass is not a hole. */
const COVER_ENV_INTENSITY = 0.08

/**
 * The wallpaper, as the asset binds it: a 1024×2048 texture on the display
 * material's *emissiveMap*, with a black base colour and white emissive. That
 * is how you author a screen that lights itself — and it is why looking for a
 * base-colour `map` finds an inner sheet of the display stack instead of the
 * thing you can actually see.
 */
const DISPLAY_EMISSIVE_MAP = 'YdpTjeQvCBWCMKR'

/** Each material's colour exactly as the model shipped it. */
const STOCK_COLOR = new WeakMap()
/** Per display material: its stock wallpaper and the shape of the surface. */
const STOCK_WALLPAPER = new WeakMap()

/** Width / height of a flat mesh, whichever pair of axes it happens to lie on. */
function surfaceAspect(mesh) {
  const geometry = mesh.geometry
  if (!geometry) return null
  geometry.computeBoundingBox()
  const size = geometry.boundingBox.getSize(new Vector3())
  const [height, width] = [size.x, size.y, size.z].sort((a, b) => b - a)
  return height > 0 ? width / height : null
}

/** Footprint of a mesh in the screen plane, used to tell a layer that covers
 *  the display from a detail that merely happens to be transparent. */
function planarArea(mesh) {
  const g = mesh.geometry
  if (!g) return 0
  if (!g.boundingBox) g.computeBoundingBox()
  const s = g.boundingBox.getSize(new Vector3())
  // The display plane is the two largest axes; the third is the device's depth.
  const [a, b] = [s.x, s.y, s.z].sort((x, y) => y - x)
  return a * b
}

/**
 * The asset's own materials are left alone except where the page needs
 * something the asset cannot know about.
 *
 * The display already lights itself correctly, so all that happens there is
 * noting its wallpaper so the Pura screen can be swapped in, and lifting its
 * emissive so ACES does not tone-map the UI to a flat grey.
 *
 * The real work is the COVER LAYERS. The display is not one surface — it is a
 * stack, and the sheets above it are transparent materials that reflect the
 * environment. Left at full strength they put a milky veil of studio softbox
 * across the entire screen and the UI becomes unreadable, which is exactly
 * backwards on a page whose whole subject is what is on that screen.
 *
 * They are identified by FOOTPRINT rather than by material type: any
 * transparent material whose mesh covers a large share of the display's own
 * area is over the screen, whatever its metalness happens to be. The first
 * version of this tested for `metalness > 0.9 && roughness < 0.05`, which found
 * the 780-triangle cover glass and missed the 9,480-triangle sheet sitting on
 * top of it — the one actually doing the damage.
 */
function adaptMaterials(scene) {
  const named = []
  const selfLit = []
  const meshFor = new Map()
  const transparentMeshes = []

  scene.traverse((o) => {
    const m = o.isMesh && o.material
    if (!m) return
    if (m.color && !STOCK_COLOR.has(m)) STOCK_COLOR.set(m, m.color.clone())

    if (m.emissiveMap) {
      if (!meshFor.has(m)) meshFor.set(m, o)
      if (m.emissiveMap.name === DISPLAY_EMISSIVE_MAP) named.push(m)
      // A screen, described without naming it: emits light, and its own base
      // colour is dark because everything you see is the emission.
      else if (m.emissive && m.emissive.r + m.emissive.g + m.emissive.b > 0.5) {
        const tris = o.geometry?.index?.count ?? o.geometry?.attributes?.position?.count ?? 0
        selfLit.push({ material: m, tris })
      }
    } else if (m.transparent && m.opacity < 0.6) {
      transparentMeshes.push(o)
    }
  })

  // Prefer the texture we know. The fallback means replacing the model degrades
  // to "picks the biggest lit surface" rather than to a screen swap that
  // silently does nothing.
  const displays = named.length
    ? named
    : selfLit.sort((a, b) => b.tris - a.tris).slice(0, 1).map((c) => c.material)

  let displayArea = 0
  for (const m of displays) {
    const mesh = meshFor.get(m)
    if (mesh) displayArea = Math.max(displayArea, planarArea(mesh))
    if (!STOCK_WALLPAPER.has(m)) {
      STOCK_WALLPAPER.set(m, { texture: m.emissiveMap, aspect: mesh ? surfaceAspect(mesh) : null })
    }
    m.emissiveIntensity = 1
    m.toneMapped = SCREEN_TONE_MAPPED
    m.needsUpdate = true
  }

  if (displayArea > 0) {
    for (const mesh of transparentMeshes) {
      if (planarArea(mesh) < displayArea * COVER_AREA_SHARE) continue
      mesh.material.envMapIntensity = COVER_ENV_INTENSITY
      mesh.material.needsUpdate = true
    }
  }

  if (import.meta.env.DEV && !displays.length) {
    console.warn('[device] no display material found - the Pura screen will not appear')
  }
}

/**
 * glTF has no way to carry a USD variant set, so the GLB ships with Black baked
 * in and `variants.json` describes what each other colourway changes. `colors`
 * are absolute and `tints` are multipliers for surfaces whose colour lives in a
 * texture we cannot swap. Both are linear — which is what the source holds and
 * what the renderer works in, so converting either through sRGB here would
 * double-correct them.
 */
function applyVariant(scene, variant) {
  const table = variantData.variants[variant]
  scene.traverse((o) => {
    const m = o.isMesh && o.material
    if (!m || !STOCK_COLOR.has(m)) return
    const rgb = table?.colors?.[m.name] ?? table?.tints?.[m.name]
    if (rgb) m.color.setRGB(rgb[0], rgb[1], rgb[2], LinearSRGBColorSpace)
    else m.color.copy(STOCK_COLOR.get(m))
  })
}

/**
 * The emissiveMap is the screen. The base colour stays black, exactly as the
 * asset has it, so the image reads as emitted light rather than a sticker.
 *
 * Two screens, not one, because the page changes what the phone is showing
 * halfway through. They are blended in the shader rather than swapped, and
 * rather than redrawn into a canvas texture every frame: the device is turning
 * from a 3/4 view to face-on while the content changes, and at no point in that
 * turn is the screen hidden enough to hide a cut. A one-line mix in the
 * emissive fragment costs nothing and is the only way the change reads as the
 * screen updating rather than as a glitch.
 */
function applyScreens(scene, textures) {
  if (!textures) return
  scene.traverse((o) => {
    const m = o.isMesh && o.material
    if (!m || !STOCK_WALLPAPER.has(m)) return

    // Assigning this is what defines USE_EMISSIVEMAP and gives the shader its
    // `vEmissiveMapUv`. The screens themselves come through uniforms below, so
    // which texture lands here only decides the first frame — but swapping
    // `emissiveMap` per frame would mean a material recompile per frame, and
    // uniforms cost nothing.
    m.emissiveMap = textures[SCREEN_DEFAULT]
    m.toneMapped = SCREEN_TONE_MAPPED

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uScreenA = { value: textures[SCREEN_DEFAULT] }
      shader.uniforms.uScreenB = { value: textures[SCREEN_DEFAULT] }
      shader.uniforms.uScreenMix = { value: 0 }
      // Supplying a uniform does not declare it. three.js only auto-declares
      // its own, so anything added here has to be prepended to the source by
      // hand or the program fails to compile with "undeclared identifier".
      shader.fragmentShader =
        'uniform sampler2D uScreenA;\nuniform sampler2D uScreenB;\nuniform float uScreenMix;\n' +
        shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#ifdef USE_EMISSIVEMAP
           vec4 puraA = texture2D( uScreenA, vEmissiveMapUv );
           vec4 puraB = texture2D( uScreenB, vEmissiveMapUv );
           vec4 emissiveColor = mix( puraA, puraB, uScreenMix );
           #ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
             emissiveColor = sRGBTransferEOTF( emissiveColor );
           #endif
           totalEmissiveRadiance *= emissiveColor.rgb;
         #endif`
      )
      m.userData.shader = shader
    }
    m.needsUpdate = true
    SCREEN_MATERIALS.add(m)
  })
}

/** Every display material, so the mix uniform can be pushed each frame. */
const SCREEN_MATERIALS = new Set()

/**
 * Point the display at a fractional index into `textures` and push it into
 * whichever materials have compiled so far.
 *
 * Only ever a crossfade between two NEIGHBOURS in the list. The index is
 * clamped rather than wrapped, so a table that overshoots holds the last screen
 * instead of jumping back to the first.
 */
function setScreen(index, textures) {
  if (!textures || !textures.length) return
  const i = Math.min(Math.max(index, 0), textures.length - 1)
  const a = Math.floor(i)
  const b = Math.min(a + 1, textures.length - 1)
  for (const m of SCREEN_MATERIALS) {
    const u = m.userData.shader?.uniforms
    if (!u) continue
    u.uScreenA.value = textures[a]
    u.uScreenB.value = textures[b]
    u.uScreenMix.value = i - a
  }
}

/** Anisotropy is per-texture, so it has to be walked onto every one in use. */
function applyAnisotropy(scene, level) {
  scene.traverse((o) => {
    const m = o.isMesh && o.material
    if (!m) return
    for (const key of ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap']) {
      const tex = m[key]
      if (tex && tex.anisotropy !== level) {
        tex.anisotropy = level
        tex.needsUpdate = true
      }
    }
  })
}

/** Any one of the display materials will do — they all share the same map. */
function findDisplay(scene) {
  let found = null
  scene.traverse((o) => {
    const m = o.isMesh && o.material
    if (!found && m && STOCK_WALLPAPER.has(m)) found = STOCK_WALLPAPER.get(m)
  })
  return found
}

/**
 * How far the phone turns to follow the cursor, in degrees, at the edge of the
 * viewport. Small on purpose: the phone is meant to acknowledge the pointer,
 * not track it like a turret. Yaw runs further than pitch because a screen
 * turning left and right reads as looking; the same angle up and down reads as
 * the phone falling over.
 */
const TILT_YAW = 18
const TILT_PITCH = 12

/** How fast it catches up. Higher is snappier; this is about a third of a
 *  second to close the gap, which is the difference between "it is watching
 *  me" and "it is attached to my mouse". */
const TILT_LAMBDA = 5

/**
 * The cursor's position, or null when there isn't one.
 *
 * `null` is a distinct state from "at the centre", because it is what says to
 * unwind rather than to hold: a cursor that leaves the window should let the
 * phone come back to face-on, not freeze it at whatever angle it was at when
 * it crossed the edge.
 *
 * Nothing is attached at all on a touch screen or under reduced motion, so the
 * tilt stays at zero and the render loop's damping never has anything to do.
 */
function usePointer() {
  const at = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || still) return

    const move = (e) => {
      at.current = { x: e.clientX, y: e.clientY }
    }
    const away = () => {
      at.current = null
    }

    // `pointerout` with no relatedTarget is the pointer leaving the window
    // rather than moving between two elements inside it.
    const out = (e) => {
      if (!e.relatedTarget) away()
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', out)
    window.addEventListener('blur', away)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', out)
      window.removeEventListener('blur', away)
    }
  }, [])

  return at
}

/**
 * The device.
 *
 * Its whole job on this page is to sit exactly where the DOM layer thinks it
 * is. `deviceProxy` carries a centre in frame pixels and a size as a multiple
 * of the reference height; this converts both into world units every frame,
 * through the same stage scale the DOM stage uses. Get that one conversion
 * right and the phone stays glued to the chip cloud at every viewport, with no
 * per-breakpoint fudging anywhere else in the codebase.
 */
export function Device({ layout, stageScale, anisotropy = 4 }) {
  const { scene } = useGLTF(MODEL_URL)
  const rig = useRef()
  const inner = useRef()
  const modelHeight = useRef(1)
  const { viewport, size, gl } = useThree()
  const [screenTexture, setScreenTexture] = useState(null)
  const pointer = usePointer()

  useLayoutEffect(() => {
    adaptMaterials(scene)
    applyVariant(scene, FINISH)
  }, [scene])

  useLayoutEffect(() => {
    applyAnisotropy(scene, Math.min(anisotropy, gl.capabilities.getMaxAnisotropy()))
  }, [scene, anisotropy, gl, screenTexture])

  // Measured, not assumed. The reference height is in frame pixels, so
  // converting it needs the model's own height in world units — and reading
  // that from the asset means a re-export at a different scale cannot quietly
  // change how big the phone looks. The rig is forced to 1 first so the
  // measurement can never pick up a scale a previous frame left on it.
  useLayoutEffect(() => {
    if (!inner.current || !rig.current) return
    const previous = rig.current.scale.clone()
    rig.current.scale.setScalar(1)
    rig.current.updateMatrixWorld(true)
    const s = new Box3().setFromObject(inner.current).getSize(new Vector3())
    rig.current.scale.copy(previous)
    // Longest axis: a phone's height, without assuming which way the model is
    // authored up.
    const h = Math.max(s.x, s.y, s.z)
    if (h > 0) modelHeight.current = h
  }, [scene])

  useEffect(() => {
    let cancelled = false
    let built = null
    // Both screens are needed before either is applied: compiling the shader
    // with only one bound would leave the second sampler undefined, and the
    // first frame of the crossfade would be the frame that shows it.
    Promise.all(
      SCREEN_URLS.map((url) =>
        fetch(url)
          .then((r) => r.blob())
          .then(loadImageElement)
      )
    )
      .then((images) => {
        if (cancelled) return
        const display = findDisplay(scene)
        built = images.map((image) => makeScreenTexture(image, display))
        setScreenTexture(built)
      })
      .catch((error) => console.warn('[device] screen textures failed:', error.message))
    return () => {
      cancelled = true
      built?.forEach((t) => t.dispose())
    }
  }, [scene])

  useLayoutEffect(() => {
    applyScreens(scene, screenTexture)
    return () => SCREEN_MATERIALS.clear()
  }, [scene, screenTexture])

  useFrame((_, delta) => {
    const g = rig.current
    if (!g) return

    // One frame pixel, in world units: frame px -> CSS px -> world units.
    const u = stageScale * (viewport.height / size.height)

    g.position.set(
      (deviceProxy.fx - layout.frame[0] / 2) * u,
      -(deviceProxy.fy - layout.frame[1] / 2) * u,
      0
    )

    // --- the phone looks at the cursor ---------------------------------------
    // Measured from the DEVICE's centre on screen, not the viewport's, so the
    // angle is the one the phone would actually have to turn through. That
    // centre comes out of the same conversion the position above uses: a frame
    // pixel is `stageScale` CSS pixels, and the canvas is centred on the frame.
    //
    // The screen faces +Z. Rotating +X swings that normal down, and +Y swings
    // it right — which is why a cursor BELOW centre gives a positive pitch and
    // one to the RIGHT a positive yaw, with no sign flips.
    const p = pointer.current
    let wantX = 0
    let wantY = 0
    if (p && deviceProxy.tilt > 0.001) {
      const cx = size.width / 2 + (deviceProxy.fx - layout.frame[0] / 2) * stageScale
      const cy = size.height / 2 + (deviceProxy.fy - layout.frame[1] / 2) * stageScale
      const nx = MathUtils.clamp((p.x - cx) / (size.width / 2), -1, 1)
      const ny = MathUtils.clamp((p.y - cy) / (size.height / 2), -1, 1)
      wantX = ny * TILT_PITCH
      wantY = nx * TILT_YAW
    }
    // Framerate-independent easing, so the follow feels the same on a 60Hz
    // panel and a 120Hz one.
    deviceProxy.tiltX = MathUtils.damp(deviceProxy.tiltX, wantX, TILT_LAMBDA, delta)
    deviceProxy.tiltY = MathUtils.damp(deviceProxy.tiltY, wantY, TILT_LAMBDA, delta)

    g.rotation.set(
      MathUtils.degToRad(deviceProxy.rx + deviceProxy.tiltX * deviceProxy.tilt),
      MathUtils.degToRad(deviceProxy.ry + deviceProxy.tiltY * deviceProxy.tilt),
      MathUtils.degToRad(deviceProxy.rz)
    )
    g.scale.setScalar((deviceProxy.s * deviceRefHeight(layout) * u) / modelHeight.current)
    setScreen(deviceProxy.screen, screenTexture)
  })

  return (
    <group ref={rig}>
      <primitive ref={inner} object={scene} scale={DEVICE.scale} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
