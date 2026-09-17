import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { ACESFilmicToneMapping } from 'three'
import { CAMERA } from './config'
import { Device } from './Device'

/**
 * The device's materials are metalness 1 / roughness ~0, i.e. mirrors. Mirrors
 * have no diffuse response, so punctual lights do almost nothing here — what
 * you see is entirely the environment reflected back. This is a procedural
 * studio (no HDRI download): softboxes rendered once into an env map, shaped so
 * the highlights run along the device's edges as it turns into its 3/4 pose.
 *
 * Warmer than a neutral studio on purpose. The page behind it is a cream-to-
 * apricot gradient, and a phone lit by a cold studio sits on that background
 * like a cutout rather than an object in the same room as it.
 */
function Studio({ resolution }) {
  return (
    <Environment resolution={resolution} frames={1} environmentIntensity={0.5}>
      {/* Base bounce. Everything the panels don't cover reflects this. */}
      <color attach="background" args={['#41403f']} />

      {/* Key: tall narrow strip, front-left — the bright runner down the rail. */}
      <Lightformer
        form="rect"
        intensity={15}
        position={[-6, 1, 1.5]}
        rotation={[0, -Math.PI / 2.1, 0]}
        scale={[2.5, 12, 1]}
      />
      {/* Fill: broad and slightly cool, front-right, so the shadow side of the
          titanium doesn't fall to flat black. */}
      <Lightformer
        form="rect"
        intensity={6}
        position={[6.5, 1, 2]}
        rotation={[0, Math.PI / 2.6, 0]}
        scale={[6, 10, 1]}
        color="#e6efff"
      />
      {/* Overhead sheen across the glass. */}
      <Lightformer
        form="rect"
        intensity={4.5}
        position={[0, 8, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[7, 7, 1]}
      />
      {/* Warm rim from behind, picked to sit in the gradient's apricot half —
          this is what stops the device reading as pasted on. */}
      <Lightformer
        form="rect"
        intensity={7}
        position={[0, 0, -7]}
        rotation={[0, Math.PI, 0]}
        scale={[8, 8, 1]}
        color="#ffd2b0"
      />
      {/* Floor bounce, so the underside isn't a dead edge. */}
      <Lightformer
        form="rect"
        intensity={2.2}
        position={[0, -6, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 10, 1]}
        color="#f3e4d8"
      />
    </Environment>
  )
}

/**
 * No contact shadow. The device never touches a surface in this sequence — it
 * hangs above an open hand — and a ground shadow under a floating object is
 * worse than none.
 */
export function Scene({ layout, stageScale, quality }) {
  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ position: CAMERA.position, fov: CAMERA.fov }}
      // alpha: the canvas is a transparent layer over the Lottie gradient.
      gl={{
        alpha: true,
        antialias: true,


        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={(st) => {
        if (import.meta.env.DEV) window.__three = st
      }}
    >
      <Suspense fallback={null}>
        {/* Keyed so a resolution change rebuilds the env map rather than
            leaving the old one bound. */}
        <Studio key={quality.envResolution} resolution={quality.envResolution} />
        <Device layout={layout} stageScale={stageScale} anisotropy={quality.anisotropy} />
      </Suspense>
    </Canvas>
  )
}
