'use client'

import { useState, useCallback } from 'react'
import { Upload, BookOpen, Sparkles, Search, ChevronRight, FileText, Zap } from 'lucide-react'
import { useBookStore } from '@/lib/store'

const TEMPLATES = [
  {
    id: 1,
    name: 'Classic Chapter',
    category: 'Fiction',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23fffef8" width="200" height="280"/%3E%3Ctext x="20" y="40" font-family="Georgia" font-size="24" font-weight="bold"%3EChapter 1%3C/text%3E%3Cline x1="20" y1="50" x2="100" y2="50" stroke="%23333" stroke-width="2"/%3E%3Ctext x="20" y="80" font-family="Georgia" font-size="14" fill="%23666"%3EIt was a dark and%3C/text%3E%3Ctext x="20" y="100" font-family="Georgia" font-size="14" fill="%23666"%3Estormy night when...%3C/text%3E%3C/svg%3E',
  },
  {
    id: 2,
    name: 'Modern Minimal',
    category: 'Non-Fiction',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23ffffff" width="200" height="280"/%3E%3Ctext x="20" y="140" font-family="Helvetica" font-size="32" font-weight="bold"%3E01%3C/text%3E%3Ctext x="20" y="170" font-family="Helvetica" font-size="16"%3EIntroduction%3C/text%3E%3Crect x="20" y="180" width="80" height="2" fill="%23000"/%3E%3C/svg%3E',
  },
  {
    id: 3,
    name: 'Art Deco',
    category: 'Fiction',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="deco" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231a1a2e"/%3E%3Cstop offset="100%25" style="stop-color:%2316213e"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23deco)" width="200" height="280"/%3E%3Ctext x="100" y="120" text-anchor="middle" font-family="Georgia" font-size="28" font-weight="bold" fill="%23ffd700"%3ECHAPTER%3C/text%3E%3Ctext x="100" y="160" text-anchor="middle" font-family="Georgia" font-size="48" font-weight="bold" fill="%23ffd700"%3EI%3C/text%3E%3Cline x1="60" y1="180" x2="140" y2="180" stroke="%23ffd700" stroke-width="2"/%3E%3C/svg%3E',
  },
  {
    id: 4,
    name: 'Botanical',
    category: 'Poetry',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23f0f9f0" width="200" height="280"/%3E%3Ccircle cx="100" cy="40" r="20" fill="%234a7c59" opacity="0.3"/%3E%3Ctext x="100" y="120" text-anchor="middle" font-family="Georgia" font-size="24" font-style="italic" fill="%234a7c59"%3EChapter One%3C/text%3E%3Ctext x="100" y="150" text-anchor="middle" font-family="Georgia" font-size="14" fill="%236b9b7f"%3E❦%3C/text%3E%3C/svg%3E',
  },
  {
    id: 5,
    name: 'Neon Cyberpunk',
    category: 'Sci-Fi',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%230a0e1a" width="200" height="280"/%3E%3Crect x="15" y="15" width="170" height="250" fill="none" stroke="%23ff006e" stroke-width="2"/%3E%3Crect x="20" y="20" width="160" height="240" fill="none" stroke="%2300f5ff" stroke-width="1" opacity="0.5"/%3E%3Ctext x="100" y="140" text-anchor="middle" font-family="monospace" font-size="24" font-weight="bold" fill="%23ff006e"%3E&gt; CHAPTER_01%3C/text%3E%3C/svg%3E',
  },
  {
    id: 6,
    name: 'Luxury Gold',
    category: 'Premium',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="gold" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ffd700"/%3E%3Cstop offset="50%25" style="stop-color:%23ffed4e"/%3E%3Cstop offset="100%25" style="stop-color:%23ffd700"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="%23000000" width="200" height="280"/%3E%3Crect x="30" y="30" width="140" height="220" fill="none" stroke="url(%23gold)" stroke-width="3"/%3E%3Ctext x="100" y="140" text-anchor="middle" font-family="Georgia" font-size="32" font-weight="bold" fill="url(%23gold)"%3EI%3C/text%3E%3C/svg%3E',
  },
  {
    id: 7,
    name: 'Magazine',
    category: 'Non-Fiction',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23ffffff" width="200" height="280"/%3E%3Crect x="0" y="0" width="200" height="100" fill="%23e94560"/%3E%3Ctext x="20" y="140" font-family="Arial" font-size="28" font-weight="bold"%3EChapter 1%3C/text%3E%3Ctext x="20" y="165" font-family="Arial" font-size="14" fill="%23666"%3EThe Beginning%3C/text%3E%3C/svg%3E',
  },
  {
    id: 8,
    name: 'Typewriter',
    category: 'Memoir',
    thumbnail: 'data:image/svg+xml,%3Csvg width="200" height="280" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23f5f5dc" width="200" height="280"/%3E%3Ctext x="20" y="40" font-family="Courier New" font-size="18" font-weight="bold"%3ECHAPTER ONE%3C/text%3E%3Ctext x="20" y="80" font-family="Courier New" font-size="12"%3EIt began on a...%3C/text%3E%3Ctext x="20" y="100" font-family="Courier New" font-size="12"%3Equiet morning in...%3C/text%3E%3C/svg%3E',
  },
]

export default function WelcomeScreen({ onImport }: { onImport: () => void }) {
  const { createProject } = useBookStore()
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const filteredTemplates = TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

    setProcessingStep(`Found ${chapters.length} chapters!`)
    await new Promise(resolve => setTimeout(resolve, 400))

    createProject(file.name.replace(/\.[^/.]+$/, ''), chapters)

    setIsProcessing(false)
    onImport()
  }

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Block C</h1>
            <p className="text-xs text-gray-500">Your Vellum Alternative</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Free Forever
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Templates */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 mb-3">Templates</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedTemplate.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="aspect-[3/4] mb-2 rounded overflow-hidden bg-gray-100">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500">{template.category}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              {filteredTemplates.length} templates available
            </p>
          </div>
        </div>

        {/* CENTER - Canvas Area */}
        <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-12">
          <div className="max-w-2xl text-center space-y-8">
            {/* Selected Template Preview */}
            <div className="mx-auto w-64 aspect-[3/4] rounded-xl shadow-2xl overflow-hidden bg-white">
              <img
                src={selectedTemplate.thumbnail}
                alt={selectedTemplate.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedTemplate.name} Template
                </span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900">
                What will you create today?
              </h2>

              <p className="text-lg text-gray-600">
                Upload your manuscript to get started with the <strong>{selectedTemplate.name}</strong> template.
                You can customize everything once you're inside.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept=".md,.txt,.pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="main-file-upload"
              />
              <label
                htmlFor="main-file-upload"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg cursor-pointer hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
              >
                <Upload className="w-5 h-5" />
                Upload Your Manuscript
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </label>
              <p className="text-sm text-gray-500">
                Supports .md, .txt, .pdf, .docx • No signup required
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Quick Start */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Start Guide</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Choose a Template</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Browse templates on the left and select your favorite style
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Upload Your Book</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Upload your manuscript in any format (.md, .txt, .pdf, .docx)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Design & Customize</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Use the visual editor to customize every element
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Export to PDF</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Download your print-ready PDF and start publishing
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">Features</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">21 Professional Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">3D Book Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Drag-Drop Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Print-Ready Export</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 -mx-6 -mb-6 p-6">
            <h3 className="font-bold text-gray-900 mb-2">Ready to start?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your manuscript and see the magic happen!
            </p>
            <label
              htmlFor="main-file-upload"
              className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg transition-all"
            >
              Get Started
            </label>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">{processingStep}</h3>
              <p className="text-gray-600">This will only take a moment...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
