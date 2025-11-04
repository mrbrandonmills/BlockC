'use client'

import { useState } from 'react'
import { useBookStore } from '@/lib/store'
import { Check, BookOpen, Download, Sparkles, ArrowLeft } from 'lucide-react'

const TEMPLATES = [
  { id: 'luxury-lab', name: 'Luxury Laboratory', category: 'Modern' },
  { id: 'serif-classic', name: 'Serif Classic', category: 'Traditional' },
  { id: 'modern-sans', name: 'Modern Sans', category: 'Contemporary' },
  { id: 'minimalist', name: 'Minimalist', category: 'Ultra-Clean' },
  { id: 'academic', name: 'Academic', category: 'Professional' },
]

export default function BookDesigner() {
  const { currentProject, setSelectedStyle } = useBookStore()
  const [selectedTemplate, setSelectedTemplate] = useState(currentProject?.selectedStyle || 'luxury-lab')
  const [isExporting, setIsExporting] = useState(false)

  if (!currentProject) return null

  // Get first chapter with actual content for preview
  const previewChapter = currentProject.chapters.find(ch => ch.sectionType === 'chapter' && ch.content)
    || currentProject.chapters[0]

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setSelectedStyle(templateId)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentProject.chapters
            .sort((a, b) => a.order - b.order)
            .map(ch => `<h1>${ch.title}</h1>\n${ch.content}`)
            .join('\n\n'),
          title: currentProject.title,
          authors: [currentProject.author],
          style: selectedTemplate,
          contentType: 'html',
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentProject.title}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const renderPreview = (templateId: string) => {
    const content = previewChapter?.content || 'It was a bright cold day in April, and the clocks were striking thirteen.'
    const title = previewChapter?.title || 'Chapter 1'
    const firstPara = content.split('\n')[0] || content

    switch (templateId) {
      case 'luxury-lab':
        return (
          <div className="bg-gradient-to-br from-slate-100 to-gray-100 p-12 h-full flex items-center justify-center">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-3 text-slate-700 justify-center">
                <div className="w-12 h-px bg-cyan-500" />
                <span className="text-sm uppercase tracking-widest font-bold">Chapter 1</span>
                <div className="w-12 h-px bg-cyan-500" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 text-center">{title}</h2>
              <div className="space-y-4 text-base leading-relaxed text-slate-700">
                <p>
                  <span className="text-6xl float-left mr-3 text-cyan-600 font-serif leading-none">
                    {firstPara.charAt(0)}
                  </span>
                  {firstPara.slice(1, 200)}...
                </p>
              </div>
            </div>
          </div>
        )

      case 'serif-classic':
        return (
          <div className="bg-amber-50 p-12 h-full flex items-center justify-center">
            <div className="space-y-6 max-w-2xl">
              <div className="text-center">
                <div className="text-base text-amber-700 mb-2">❦</div>
                <div className="text-sm uppercase tracking-widest text-amber-800">Chapter One</div>
                <h2 className="text-4xl font-serif font-bold text-amber-900 mt-3">{title}</h2>
                <div className="text-base text-amber-700 mt-2">❦</div>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-amber-900 font-serif">
                <p>
                  <span className="text-7xl float-left mr-3 font-serif leading-none">
                    {firstPara.charAt(0)}
                  </span>
                  {firstPara.slice(1, 200)}...
                </p>
              </div>
            </div>
          </div>
        )

      case 'modern-sans':
        return (
          <div className="bg-white p-12 h-full flex items-center justify-center border-2 border-blue-200">
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-blue-600 font-bold">Chapter 1</div>
                <h2 className="text-4xl font-sans font-bold text-gray-900">{title}</h2>
                <div className="h-1 w-16 bg-blue-500 rounded" />
              </div>
              <div className="space-y-4 text-base leading-relaxed text-gray-700 font-sans">
                <p>{firstPara.slice(0, 200)}...</p>
              </div>
            </div>
          </div>
        )

      case 'minimalist':
        return (
          <div className="bg-white p-12 h-full flex items-center justify-center">
            <div className="space-y-8 max-w-2xl">
              <div className="text-xs text-gray-400">01</div>
              <h2 className="text-3xl font-light text-gray-900 tracking-tight">{title}</h2>
              <div className="space-y-5 text-sm leading-relaxed text-gray-600 font-light">
                <p>{firstPara.slice(0, 200)}...</p>
              </div>
            </div>
          </div>
        )

      case 'academic':
        return (
          <div className="bg-gray-50 p-12 h-full flex items-center justify-center border-2 border-gray-300">
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">1. {title}</h2>
                <div className="h-px w-full bg-gray-300 mt-3" />
              </div>
              <div className="space-y-4 text-base leading-relaxed text-gray-800 font-serif">
                <p className="indent-8">{firstPara.slice(0, 200)}...</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Left Panel - Template Gallery */}
      <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{currentProject.title}</h2>
              <p className="text-xs text-gray-600">{currentProject.chapters.length} sections</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Choose Template</h3>

          <div className="space-y-3">
            {TEMPLATES.map((template) => {
              const isSelected = selectedTemplate === template.id

              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{template.name}</div>
                      <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {template.category}
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5" />}
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export Book
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-600">Your book in {TEMPLATES.find(t => t.id === selectedTemplate)?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '6/9', minHeight: '800px' }}>
            {renderPreview(selectedTemplate)}
          </div>
        </div>
      </div>
    </div>
  )
}
