'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, BookOpen, Sparkles } from 'lucide-react'
import { useBookStore } from '@/lib/store'

interface WelcomeScreenProps {
  onImport: () => void
}

export default function WelcomeScreen({ onImport }: WelcomeScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { createProject } = useBookStore()

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    try {
      const text = await file.text()

      // Parse the document and create chapters
      const chapters = parseDocument(text, file.name)

      // Create project
      createProject(`${file.name.replace(/\.[^/.]+$/, "")}`, chapters)

      onImport()
    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import file. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const parseDocument = (content: string, filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()

    if (ext === 'md') {
      return parseMarkdown(content)
    } else {
      // Simple text parsing - split by chapter headings
      return parseText(content)
    }
  }

  const parseMarkdown = (content: string) => {
    const lines = content.split('\n')
    const chapters: Array<{ title: string; content: string; order: number }> = []
    let currentChapter: { title: string; content: string; order: number } | null = null
    let chapterOrder = 0

    for (const line of lines) {
      // Detect h1 headers as chapter titles
      if (line.startsWith('# ')) {
        if (currentChapter) {
          chapters.push(currentChapter)
        }
        currentChapter = {
          title: line.replace(/^# /, '').trim(),
          content: '',
          order: chapterOrder++,
        }
      } else if (currentChapter) {
        currentChapter.content += line + '\n'
      }
    }

    if (currentChapter) {
      chapters.push(currentChapter)
    }

    // If no chapters found, create a single chapter
    if (chapters.length === 0) {
      chapters.push({
        title: 'Chapter 1',
        content,
        order: 0,
      })
    }

    return chapters
  }

  const parseText = (content: string) => {
    // Try to split by common chapter patterns
    const chapterPattern = /(?:Chapter|CHAPTER|chapter)\s+(\d+|[IVXLCDM]+)/gi
    const splits = content.split(chapterPattern)

    if (splits.length > 1) {
      const chapters: Array<{ title: string; content: string; order: number }> = []
      for (let i = 1; i < splits.length; i += 2) {
        const chapterNumber = splits[i]
        const chapterContent = splits[i + 1] || ''
        chapters.push({
          title: `Chapter ${chapterNumber}`,
          content: chapterContent.trim(),
          order: Math.floor(i / 2),
        })
      }
      return chapters
    }

    // No chapters found, return as single chapter
    return [{
      title: 'Untitled',
      content,
      order: 0,
    }]
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.pdf'))) {
      await handleFileSelect(file)
    } else {
      alert('Please upload a .md, .txt, or .pdf file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileSelect(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            {/* Geometric Logo */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl transform rotate-12 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl transform -rotate-12" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Vellum Book Designer
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional book formatting made simple and free.
            <span className="block text-sm mt-2 text-gray-500">
              Import your manuscript and create a beautiful book in minutes.
            </span>
          </p>
        </div>

        {/* Import Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-16 text-center">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="inline-block">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Processing your manuscript...
                  </h3>
                  <p className="text-gray-600">
                    We're analyzing your content and creating chapters
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                    <Upload className="w-12 h-12 text-blue-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Import Your Manuscript
                  </h2>

                  <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                    Drag and drop your file here, or click to browse.
                    We support Markdown (.md), Text (.txt), and PDF files.
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FileText className="w-5 h-5" />
                    Choose File
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt,.pdf,.doc,.docx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Smart Parsing</h3>
                    <p className="text-sm text-gray-600">
                      Automatically detects chapters and structure
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Professional Styles</h3>
                    <p className="text-sm text-gray-600">
                      Choose from beautiful pre-made templates
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-3">
                      <FileText className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Export Anywhere</h3>
                    <p className="text-sm text-gray-600">
                      PDF, EPUB, Kindle, Apple Books, and more
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Free alternative to Vellum ($249.99) • Built with love for indie authors
          </p>
        </div>
      </div>
    </div>
  )
}
