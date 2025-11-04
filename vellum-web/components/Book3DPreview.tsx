'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface Book3DProps {
  coverImage?: string
  title: string
  author: string
}

function Book({ coverImage, title, author }: Book3DProps) {
  const bookRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (bookRef.current && !hovered) {
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <group
      ref={bookRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Book Cover */}
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Book Spine */}
      <mesh position={[-1.05, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Book Pages */}
      <mesh position={[-0.02, 0, 0]} castShadow>
        <boxGeometry args={[1.96, 2.96, 0.08]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
      </mesh>

      {/* Title Text (simplified) */}
      <mesh position={[0, 0.5, 0.11]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

export default function Book3DPreview({ coverImage, title, author }: Book3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-5, 5, 5]} intensity={0.5} />

        {/* The Book */}
        <Book coverImage={coverImage} title={title} author={author} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  )
}
