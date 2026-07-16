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

// Positive match: if ANY names match these, ONLY those get colored
const BODY_KEYWORDS = /body|paint|panel|hood|door|roof|bonnet|fender|bumper|trunk|lid|shell|exterior|chassis|pillar|quarter|spoiler|skirt|sill|hull/i

// Use \b to ensure we match 'glass' but not 'G-class' or 'fiberglass'
const GLASS_KEYWORDS = /\b(glass)\b|window|windshield/i

// Hard exclusions (removed 'mat' because it matches 'Material', added 'carpet')
const EXCLUDE_KEYWORDS = /wheel|tire|tyre|tread|tireside|tiretread|rim|light|lamp|mirror|chrome|interior|seat|dash|steering|brake|caliper|disc|pad|axle|engine|mechanical|hardware|license|floor|carpet|badge|emblem|gasket|wiper|cage|alloy|rubber|hubcap|grille/i

export default function CarModel({ modelUrl, carColor, finish, ppfEnabled, windowTint = 0.2, scale = 1.0, yOffset = -0.05, onLoaded }) {
  const groupRef = useRef()
  const bodyMaterials = useRef([])
  const glassMaterials = useRef([])

  const { scene } = useGLTF(modelUrl)

  // Clone scene so we can safely modify materials per-instance
  const carScene = useMemo(() => scene.clone(true), [scene])

  // Build body materials on mount / when model changes
  useEffect(() => {
    const allMeshes = []
    const bodyMeshes = []
    const glassMeshes = []

    carScene.traverse((obj) => {
      if (!obj.isMesh) return
      obj.castShadow = true
      obj.receiveShadow = true

      const meshName = obj.name || ''
      const matName = obj.material?.name || ''
      const combinedName = `${meshName} ${matName}`

      if (GLASS_KEYWORDS.test(combinedName)) {
        glassMeshes.push(obj)
        return
      }

      if (EXCLUDE_KEYWORDS.test(combinedName)) return

      allMeshes.push(obj)
      if (BODY_KEYWORDS.test(combinedName)) {
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
        if (!obj.isMesh || GLASS_KEYWORDS.test(obj.name)) return
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

    // Set up ultra-realistic glass materials
    const gMats = []
    glassMeshes.forEach(obj => {
      const gMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff),
        transmission: 1.0,
        opacity: 1.0,
        transparent: true,
        roughness: 0.02,
        metalness: 0.1,
        ior: 1.5,
        thickness: 0.05,
        envMapIntensity: 2.0,
        clearcoat: 1.0,
      })
      obj.material = gMat
      gMats.push(gMat)
    })

    bodyMaterials.current = materials
    glassMaterials.current = gMats
    onLoaded?.()
  }, [carScene])

  // Reactively update color / finish / PPF / Tint
  useEffect(() => {
    const color = new THREE.Color(carColor)
    const finishProps = FINISH_PRESETS[finish] || FINISH_PRESETS.gloss
    bodyMaterials.current.forEach((mat) => {
      mat.color.set(color)
      Object.assign(mat, finishProps)
      if (ppfEnabled) Object.assign(mat, PPF_OVERRIDES)
      mat.needsUpdate = true
    })

    // Update glass tint (0 = clear, 1 = limo/black)
    glassMaterials.current.forEach((mat) => {
      const tintVal = Math.max(0, Math.min(1, windowTint))
      const c = 1 - (tintVal * 0.95) // never fully pitch black, 5% minimum
      mat.color.setRGB(c, c, c)
      // Darker tint absorbs more light (less transmission)
      mat.transmission = 1.0 - (tintVal * 0.6)
      mat.needsUpdate = true
    })
  }, [carColor, finish, ppfEnabled, windowTint])

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
        scale={scale}
        position={[0, yOffset, 0]}
        rotation={[0, Math.PI * 0.25, 0]}
      />
    </group>
  )
}
