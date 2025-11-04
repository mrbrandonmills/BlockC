'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Upload, BookOpen, Sparkles, Zap, Palette, Download, ArrowRight, Star } from 'lucide-react'
import { useBookStore } from '@/lib/store'

// Flowing particles configuration
const PARTICLES_COUNT = 50
const createParticle = (index: number) => ({
  id: index,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  speedX: (Math.random() - 0.5) * 0.5,
  speedY: (Math.random() - 0.5) * 0.5,
  opacity: Math.random() * 0.5 + 0.1,
})

interface WelcomeScreenProps {
  onImport: () => void
}

export default function WelcomeScreen({ onImport }: WelcomeScreenProps) {
  const { createProject } = useBookStore()
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [particles, setParticles] = useState(() =>
    Array.from({ length: PARTICLES_COUNT }, (_, i) => createParticle(i))
  )
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Animated particle system
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    if (file) {
      await processFile(file)
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }, [])

  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setProcessingStep('Reading your manuscript...')

    await new Promise(resolve => setTimeout(resolve, 500))

    const content = await file.text()

    setProcessingStep('Detecting chapters...')
    await new Promise(resolve => setTimeout(resolve, 400))

    // Parse chapters from markdown
    const chapters: any[] = []
    const lines = content.split('\n')
    let currentChapter: any = null

    for (const line of lines) {
      if (line.startsWith('# ')) {
        if (currentChapter) {
          chapters.push(currentChapter)
        }
        currentChapter = {
          title: line.replace('# ', '').trim(),
          content: '',
          sectionType: 'chapter',
          numbered: true,
        }
      } else if (currentChapter) {
        currentChapter.content += line + '\n'
      }
    }

    if (currentChapter) {
      chapters.push(currentChapter)
    }

    setProcessingStep(`Found ${chapters.length} chapters! Formatting...`)
    await new Promise(resolve => setTimeout(resolve, 600))

    createProject(file.name.replace(/\.[^/.]+$/, ''), chapters)

    setProcessingStep('Opening your book designer...')
    await new Promise(resolve => setTimeout(resolve, 400))

    setIsProcessing(false)
    onImport()
  }

  const features = [
    {
      icon: Palette,
      title: 'Visual Designer',
      description: 'Drag-drop elements like Canva. Click to edit anything.',
    },
    {
      icon: Sparkles,
      title: '3D Preview',
      description: 'Rotate and inspect your book in stunning 3D.',
    },
    {
      icon: Zap,
      title: 'Instant Templates',
      description: 'Browse hundreds of professional templates.',
    },
    {
      icon: Download,
      title: 'Print-Ready Export',
      description: 'Export to PDF with professional formatting.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(157, 255, 32, 0.15), rgba(99, 102, 241, 0.15) 40%, transparent 70%)`,
        }}
      />

      {/* Flowing Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-600 transition-all duration-1000"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px rgba(99, 102, 241, ${p.opacity})`,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern with parallax */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(157,255,32,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(157,255,32,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          transform: `translateY(${scrollY * 0.3}px) scale(1.2)`,
        }}
      />

      {/* Dynamic Orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          top: '10%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(157,255,32,0.4), transparent 70%)',
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          bottom: '10%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)',
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(233,69,96,0.3), transparent 70%)',
          animationDelay: '2s',
        }}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-lime-400/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-lime-400 rounded-full border-t-transparent animate-spin" />
              </div>
              <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-lime-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{processingStep}</h3>
              <p className="text-gray-400">This will only take a moment...</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-8 py-32">
          <div className="text-center space-y-8 mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400/10 backdrop-blur-xl border border-lime-400/20 rounded-full">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-lime-300">Your personal Vellum alternative • Free forever</span>
            </div>

            {/* Headline with staggered animation */}
            <h1 className="text-8xl font-black tracking-tight leading-none">
              <span
                className="inline-block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                Design Books
              </span>
              <br />
              <span
                className="inline-block bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent animate-fade-in-up"
                style={{ animationDelay: '0.3s', textShadow: '0 0 40px rgba(157,255,32,0.3)' }}
              >
                Like Never Before
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '0.5s' }}
            >
              <span className="text-lime-400 font-semibold">Visual editor</span>. Drag-drop design. <span className="text-blue-400 font-semibold">3D preview</span>. Export print-ready PDFs.
              <br />
              Everything you need to create <span className="text-purple-400 font-semibold">stunning books</span>.
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center gap-6 pt-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative group transition-all duration-500 ${
                  isDragging ? 'scale-105' : ''
                }`}
              >
                <input
                  type="file"
                  accept=".md,.txt,.pdf,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center gap-4 group-hover:shadow-2xl transition-all">
                    <Upload className="w-6 h-6" />
                    <span className="text-xl font-bold">Drop Your Manuscript or Click to Upload</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </label>
              </div>

              <p className="text-sm text-gray-500">
                Supports .md, .txt, .pdf, .docx • Free to use • No signup required
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-8 mb-32">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive 3D Preview Section */}
          <div className="relative mb-32">
            <div className="absolute inset-0 bg-gradient-to-r from-lime-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-white mb-2">See Your Book Come to Life</h3>
                <p className="text-gray-400">Upload your manuscript and watch it transform into a beautiful book in seconds</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 min-h-[600px] flex items-center justify-center relative overflow-hidden">
                {/* Background animation */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-400 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Interactive Book Preview */}
                <div className="relative z-10 text-center space-y-8">
                  <div className="relative inline-block animate-float">
                    {/* Book mockup */}
                    <div className="relative w-64 h-80 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-blue-400/20 rounded-lg" />
                      <div className="absolute inset-4 flex flex-col items-center justify-center text-white">
                        <Star className="w-16 h-16 mb-4 text-lime-400" />
                        <div className="text-2xl font-bold mb-2">Your Book</div>
                        <div className="text-sm text-gray-300">Beautifully Formatted</div>
                      </div>
                      {/* Page edge effect */}
                      <div className="absolute right-0 top-4 bottom-4 w-2 bg-gradient-to-r from-transparent to-white/10" />
                    </div>

                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-lime-400 rounded-full animate-pulse" />
                    <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                        <span>Instant Formatting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span>3D Preview</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <span>Print Ready</span>
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-white">
                      Drop your manuscript above to get started →
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-12">
              <div className="space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Books Designed</div>
              </div>
              <div className="w-px h-16 bg-white/10" />
              <div className="space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Templates</div>
              </div>
              <div className="w-px h-16 bg-white/10" />
              <div className="space-y-2">
                <div className="text-5xl font-black bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Print Ready</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-400">Loved by 5,000+ authors</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
