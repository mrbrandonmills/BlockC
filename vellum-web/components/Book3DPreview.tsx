'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface Book3DProps {
  coverImage?: string
  title: string
  author: string
}

function Book({ coverImage, title, author }: Book3DProps) {
  const bookRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [pageFlip, setPageFlip] = useState(0)
  const pageRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (bookRef.current && !hovered) {
      // Gentle auto-rotation
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
      // Subtle floating animation
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }

    // Animate page flipping
    if (isOpen && pageFlip > 0) {
      pageRefs.current.forEach((page, i) => {
        if (page && i < pageFlip) {
          const targetRotation = Math.PI
          page.rotation.y += (targetRotation - page.rotation.y) * 0.1
        }
      })
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (!isOpen) {
      setIsOpen(true)
      setPageFlip(1)
    } else {
      setPageFlip(prev => Math.min(prev + 1, 5))
    }
  }

  // Create a canvas texture for the cover
  const coverTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 768
    const ctx = canvas.getContext('2d')!

    // Premium gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 768)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(0.5, '#16213e')
    gradient.addColorStop(1, '#0f3460')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 768)

    // Subtle pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < 512; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 768)
      ctx.stroke()
    }

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Georgia'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    // Wrap title text
    const words = title.split(' ')
    let line = ''
    let y = 350
    const maxWidth = 450

    for (const word of words) {
      const testLine = line + word + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, 256, y)
        line = word + ' '
        y += 60
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, 256, y)

    // Author
    ctx.font = '24px Georgia'
    ctx.fillStyle = '#e94560'
    ctx.shadowBlur = 5
    ctx.fillText(author, 256, y + 80)

    // Decorative elements
    ctx.strokeStyle = '#e94560'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(150, y + 100)
    ctx.lineTo(362, y + 100)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [title, author])

  // Pages edge texture
  const pagesTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    // Create paper texture with lines
    ctx.fillStyle = '#fffef0'
    ctx.fillRect(0, 0, 512, 64)

    // Add page lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
    for (let i = 0; i < 512; i += 2) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 64)
      ctx.stroke()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group
      ref={bookRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
      scale={hovered ? 1.05 : 1}
    >
      {/* Front Cover with texture */}
      <mesh position={[0, 0, 0.06]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial
          map={coverTexture}
          roughness={0.2}
          metalness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Book Spine with gradient */}
      <mesh position={[-1.025, 0, 0.03]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 3, 0.11]} />
        <meshStandardMaterial
          color="#16213e"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Animated Pages - individual pages that flip */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) pageRefs.current[i] = el }}
          position={[-1.025 + (isOpen && i < pageFlip ? 0 : 0), 0, 0.03 + i * 0.002]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.97, 2.94, 0.005]} />
          <meshStandardMaterial
            color="#fffef0"
            side={THREE.DoubleSide}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Remaining pages (static stack) */}
      <mesh position={[-0.015, 0, 0.03]} castShadow receiveShadow>
        <boxGeometry args={[1.97, 2.94, 0.08]} />
        <meshStandardMaterial
          color="#fffef0"
          map={pagesTexture}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Back Cover */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial
          color="#16213e"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle edge highlights */}
      <mesh position={[1, 0, 0.06]}>
        <boxGeometry args={[0.01, 3, 0.05]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight position={[0, 0, 2]} intensity={0.5} color="#e94560" />
      )}

      {/* Click hint */}
      {hovered && !isOpen && (
        <mesh position={[0, -1.7, 0.2]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

export default function Book3DPreview({ coverImage, title, author }: Book3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {/* Professional Studio Lighting */}
        <ambientLight intensity={0.4} />

        {/* Key light (main) */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Fill light (softer, opposite side) */}
        <directionalLight
          position={[-5, 3, -3]}
          intensity={0.5}
          color="#a8c5ff"
        />

        {/* Rim light (back edge lighting) */}
        <spotLight
          position={[0, 5, -5]}
          intensity={0.8}
          angle={0.5}
          penumbra={1}
          color="#ffffff"
        />

        {/* Subtle colored accent lights */}
        <pointLight position={[3, -2, 4]} intensity={0.3} color="#667eea" />
        <pointLight position={[-3, -2, 4]} intensity={0.3} color="#e94560" />

        {/* Environment map for reflections */}
        <Environment preset="studio" />

        {/* The Book */}
        <Book coverImage={coverImage} title={title} author={author} />

        {/* Premium ground with gradient */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.1}
            metalness={0.8}
            envMapIntensity={1}
          />
        </mesh>

        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#0f172a', 10, 25]} />
      </Canvas>
    </div>
  )
}
