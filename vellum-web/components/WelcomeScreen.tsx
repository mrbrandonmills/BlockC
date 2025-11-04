'use client'

import { useState, useCallback } from 'react'
import { useBookStore } from '@/lib/store'
import { BookOpen, Upload, Sparkles, Zap, Palette } from 'lucide-react'

interface WelcomeScreenProps {
  onImport: () => void
}

export default function WelcomeScreen({ onImport }: WelcomeScreenProps) {
  const { createProject } = useBookStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = async (file: File) => {
    try {
      const content = await file.text()
      const lines = content.split('\n')
      const chapters: Array<{ title: string; content: string; order: number; sectionType?: any }> = []

      // Add title page
      chapters.push({
        title: 'Title Page',
        content: '',
        order: 0,
        sectionType: 'title-page',
      })

      let currentChapter: any = null
      let chapterOrder = 1

      for (const line of lines) {
        if (line.startsWith('# ')) {
          if (currentChapter) {
            chapters.push(currentChapter)
          }
          currentChapter = {
            title: line.replace(/^# /, '').trim(),
            content: '',
            order: chapterOrder++,
            sectionType: 'chapter',
          }
        } else if (currentChapter) {
          currentChapter.content += line + '\n'
        }
      }

      if (currentChapter) {
        chapters.push(currentChapter)
      }

      if (chapters.length === 1) {
        chapters.push({
          title: file.name.replace(/\.[^/.]+$/, ''),
          content: content,
          order: 1,
          sectionType: 'chapter',
        })
      }

      createProject(file.name.replace(/\.[^/.]+$/, ''), chapters)
      onImport()
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Failed to process file. Please try again.')
    }
  }

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
    setIsProcessing(true)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      await processFile(file)
    }

    setIsProcessing(false)
  }, [processFile])

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsProcessing(true)
      await processFile(file)
      setIsProcessing(false)
    }
  }, [processFile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 group cursor-pointer">
              {/* Geometric logo with multiple layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl transform rotate-12 opacity-80 group-hover:rotate-45 transition-all duration-700 ease-out shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 rounded-3xl transform -rotate-12 group-hover:-rotate-45 transition-all duration-700 ease-out shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl group-hover:scale-110 transition-all duration-700 ease-out shadow-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white drop-shadow-2xl" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
            Vellum
          </h1>
          <p className="text-2xl text-gray-300 font-light mb-3">
            Professional Book Designer
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Transform your manuscript into a beautifully formatted book.
            Import, design, and export to any platform.
          </p>
        </div>

        {/* Upload area */}
        <div className="mb-12">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative backdrop-blur-xl bg-white/10 border-2 border-dashed rounded-3xl p-16 transition-all duration-300 ${
              isDragging
                ? 'border-blue-400 bg-blue-500/20 scale-105 shadow-2xl'
                : 'border-white/30 hover:border-white/50 hover:bg-white/15'
            }`}
          >
            <input
              type="file"
              accept=".md,.txt,.pdf,.docx"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isProcessing}
            />

            <div className="text-center pointer-events-none">
              {isProcessing ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Processing your manuscript...</h3>
                  <p className="text-gray-400">This will just take a moment</p>
                </>
              ) : (
                <>
                  <Upload className="w-20 h-20 mx-auto mb-6 text-white/80" strokeWidth={1.5} />
                  <h3 className="text-3xl font-semibold text-white mb-3">
                    Drop your manuscript here
                  </h3>
                  <p className="text-lg text-gray-300 mb-2">
                    or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports Markdown (.md), Text (.txt), PDF, and Word (.docx)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: 'Smart Import',
              description: 'Automatically detects chapters and structure',
            },
            {
              icon: Palette,
              title: 'Beautiful Styles',
              description: '5 professional templates for any genre',
            },
            {
              icon: Zap,
              title: 'Multi-Platform',
              description: 'Export to PDF, EPUB, Kindle, and Apple Books',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" strokeWidth={1.5} />
              <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}
