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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Vellum Book Designer
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-2">
            Professional Book Formatting Made Simple
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Choose from luxury templates, see live previews, and export print-ready files
          </p>
        </div>

        {/* Upload area */}
        <div className="mb-10">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative bg-white border-2 border-dashed rounded-2xl p-16 transition-all duration-300 shadow-xl ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-102 shadow-2xl'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
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
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing your manuscript...</h3>
                  <p className="text-gray-600">Detecting chapters and structure</p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Drop your manuscript here
                  </h3>
                  <p className="text-base text-gray-600 mb-3">
                    or click to browse files
                  </p>
                  <p className="text-sm text-gray-500">
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
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Palette,
              title: 'Luxury Templates',
              description: 'Visual gallery with live book previews',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Zap,
              title: 'Professional Output',
              description: 'Print-ready PDF and EPUB exports',
              color: 'from-orange-500 to-red-500',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
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
