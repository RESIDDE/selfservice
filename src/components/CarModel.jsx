import { useRef, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Material property presets for each finish type
const FINISH_PRESETS = {
  gloss: { roughness: 0.08, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.05 },
  metallic: { roughness: 0.25, metalness: 0.85, clearcoat: 0.4, clearcoatRoughness: 0.1 },
  matte: { roughness: 0.9, metalness: 0.0, clearcoat: 0.0, clearcoatRoughness: 1.0 },
}

// PPF adds a protective glossy layer
const PPF_OVERRIDES = {
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
  reflectivity: 0.95,
}

// Positive match: if ANY mesh names match these, ONLY those get colored
// (keeps tires/wheels/glass safe when the model uses explicit body naming)
const BODY_KEYWORDS = /^(body|paint|panel|hood|door|roof|bonnet|fender|bumper|trunk|lid|shell|exterior|chassis|pillar|quarter|spoiler|skirt|sill)/i

// Hard exclusions: never color these regardless of approach
const EXCLUDE_KEYWORDS = /glass|window|windshield|wheel|tire|tyre|tread|tireside|tiretread|rim|light|lamp|mirror|chrome|interior|seat|dash|steering|brake|caliper|disc|pad|axle|engine|mechanical|hardware|license|floor|mat|badge|emblem|gasket|wiper|cage/i

export default function CarModel({ modelUrl, carColor, finish, ppfEnabled, onLoaded }) {
  const groupRef = useRef()
  const bodyMaterials = useRef([])

  const { scene } = useGLTF(modelUrl)

  // Clone scene so we can safely modify materials per-instance
  const carScene = useMemo(() => scene.clone(true), [scene])

  // Build body materials on mount / when model changes
  useEffect(() => {
    const allMeshes = []
    const bodyMeshes = []

    carScene.traverse((obj) => {
      if (!obj.isMesh) return
      obj.castShadow = true
      obj.receiveShadow = true

      if (EXCLUDE_KEYWORDS.test(obj.name)) return

      allMeshes.push(obj)
      if (BODY_KEYWORDS.test(obj.name)) {
        bodyMeshes.push(obj)
      }
    })

    // Prefer explicit body meshes; fall back to all non-excluded meshes
    const targets = bodyMeshes.length > 0 ? bodyMeshes : allMeshes

    const materials = []
    targets.forEach((obj) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(carColor),
        ...FINISH_PRESETS[finish],
        envMapIntensity: 1.5,
      })
      obj.material = mat
      materials.push(mat)
    })

    // Absolute fallback if model has no recognizable meshes
    if (materials.length === 0) {
      carScene.traverse((obj) => {
        if (!obj.isMesh) return
        const mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(carColor),
          ...FINISH_PRESETS[finish],
          envMapIntensity: 1.5,
        })
        obj.material = mat
        obj.castShadow = true
        materials.push(mat)
      })
    }

    bodyMaterials.current = materials
    onLoaded?.()
  }, [carScene])

  // Reactively update color / finish / PPF
  useEffect(() => {
    const color = new THREE.Color(carColor)
    const finishProps = FINISH_PRESETS[finish] || FINISH_PRESETS.gloss
    bodyMaterials.current.forEach((mat) => {
      mat.color.set(color)
      Object.assign(mat, finishProps)
      if (ppfEnabled) Object.assign(mat, PPF_OVERRIDES)
      mat.needsUpdate = true
    })
  }, [carColor, finish, ppfEnabled])

  // Gentle float animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <primitive
        object={carScene}
        scale={1.0}
        position={[0, -0.05, 0]}
        rotation={[0, Math.PI * 0.25, 0]}
      />
    </group>
  )
}
