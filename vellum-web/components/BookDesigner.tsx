'use client'

import { useState, Suspense } from 'react'
import { useBookStore } from '@/lib/store'
import { BookOpen, Download, Eye, Edit3, Layout, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import VisualEditor from '@/components/VisualEditor'
import VisualTemplateGallery from '@/components/VisualTemplateGallery'

// Dynamically import 3D component to avoid SSR issues
const Book3DPreview = dynamic(() => import('@/components/Book3DPreview'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading 3D Preview...</p>
      </div>
    </div>
  )
})

type ViewMode = 'templates' | 'editor' | 'preview'

export default function BookDesigner() {
  const { currentProject, setSelectedStyle } = useBookStore()
  const [viewMode, setViewMode] = useState<ViewMode>('templates')
  const [isExporting, setIsExporting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  if (!currentProject) return null

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
          style: 'luxury-lab',
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

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template)
    setViewMode('editor')
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Top Bar with Glass Morphism */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Project Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">{currentProject.title}</h2>
              <p className="text-sm text-gray-600">by {currentProject.author}</p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('templates')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                viewMode === 'templates'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layout className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setViewMode('editor')}
              disabled={!selectedTemplate}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                viewMode === 'editor'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 disabled:opacity-50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              3D Preview
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'templates' && (
          <div className="h-full">
            {/* Visual Template Gallery with Search */}
            <VisualTemplateGallery onSelectTemplate={handleSelectTemplate} />
          </div>
        )}

        {viewMode === 'editor' && (
          <div className="h-full">
            {/* Drag-Drop Visual Editor */}
            {selectedTemplate ? (
              <div className="h-full flex flex-col">
                {/* Editor Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-gray-900">Editing: {selectedTemplate.name}</h3>
                        <p className="text-xs text-gray-600">Drag elements, click to edit, customize everything</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewMode('preview')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Preview in 3D
                    </button>
                  </div>
                </div>

                {/* Visual Editor Canvas */}
                <div className="flex-1">
                  <VisualEditor
                    pageWidth={600}
                    pageHeight={900}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center">
                  <Layout className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Template Selected</h3>
                  <p className="text-gray-600 mb-6">Choose a template from the gallery to start designing</p>
                  <button
                    onClick={() => setViewMode('templates')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    Browse Templates
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="h-full p-8">
            {/* 3D Book Preview */}
            <div className="h-full bg-gradient-to-br from-slate-100 via-gray-100 to-blue-100 rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-full flex">
                {/* 3D Canvas */}
                <div className="flex-1">
                  <Suspense fallback={<div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading 3D...</div>}>
                    <Book3DPreview
                      title={currentProject.title}
                      author={currentProject.author}
                    />
                  </Suspense>
                </div>

                {/* Info Panel */}
                <div className="w-80 bg-white/90 backdrop-blur-sm p-8 space-y-6 border-l border-gray-200">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">3D Book Preview</h3>
                    <p className="text-sm text-gray-600">Rotate and zoom with your mouse to inspect your book from every angle</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Book Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pages:</span>
                          <span className="font-bold">{currentProject.chapters.length} chapters</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-bold">6" × 9"</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Binding:</span>
                          <span className="font-bold">Perfect Bound</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div className="text-xs text-amber-900">
                          <span className="font-bold">Pro Tip:</span> Click and drag to rotate the book. Scroll to zoom in and out for detailed inspection.
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewMode('editor')}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    Return to Editor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
