'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, BookOpen, Sparkles, Zap, Palette, Download, ArrowRight } from 'lucide-react'
import { useBookStore } from '@/lib/store'

interface WelcomeScreenProps {
  onImport: () => void
}

export default function WelcomeScreen({ onImport }: WelcomeScreenProps) {
  const { createProject } = useBookStore()
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

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

  const processFile = async (file: File) => {
    const content = await file.text()

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

    createProject(file.name.replace(/\.[^/.]+$/, ''), chapters)
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
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.3), transparent 50%)`,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-8 py-32">
          <div className="text-center space-y-8 mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">The future of book design</span>
            </div>

            {/* Headline */}
            <h1 className="text-8xl font-black tracking-tight leading-none">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Design Books
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Visual editor. Drag-drop design. 3D preview. Export print-ready PDFs.
              <br />
              Everything you need to create stunning books.
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

          {/* Preview Section */}
          <div className="relative mb-32">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 aspect-video flex items-center justify-center">
                <div className="text-center space-y-6">
                  <BookOpen className="w-32 h-32 mx-auto text-blue-400 opacity-50" />
                  <p className="text-3xl font-bold text-gray-500">Upload a manuscript to see the magic</p>
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
