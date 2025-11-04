'use client'

import { useState } from 'react'
import { useBookStore, Chapter, SectionType } from '@/lib/store'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Download,
  Save,
  RotateCcw,
  Settings,
  FileText,
  Image as ImageIcon,
  Palette,
  Type,
  AlignLeft,
  Eye,
} from 'lucide-react'
import TableOfContents from '@/components/TableOfContents'
import ContentEditor from '@/components/ContentEditor'
import StylesPanel from '@/components/StylesPanel'

type ViewMode = 'content' | 'styles'

export default function BookEditor() {
  const { currentProject, setActiveChapter, saveProject } = useBookStore()
  const [viewMode, setViewMode] = useState<ViewMode>('content')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No project loaded</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await saveProject()
    setTimeout(() => setIsSaving(false), 1000)
  }

  const handleExport = async (format: 'pdf' | 'epub' | 'kindle' | 'apple' | 'all') => {
    setShowExportMenu(false)

    try {
      if (format === 'all') {
        // Export to all formats
        await exportToFormat('pdf')
        await new Promise(resolve => setTimeout(resolve, 1000))
        await exportToFormat('epub')
      } else {
        await exportToFormat(format)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  const exportToFormat = async (format: string) => {
    const endpoint = format === 'kindle' || format === 'apple' ? 'epub' : format

    const response = await fetch(`/api/export/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: currentProject.chapters
          .sort((a, b) => a.order - b.order)
          .map(ch => `<h1>${ch.title}</h1>\n${ch.content}`)
          .join('\n\n'),
        title: currentProject.title,
        authors: [currentProject.author],
        contentType: 'html',
      }),
    })

    if (!response.ok) throw new Error('Export failed')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentProject.title}.${endpoint}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar - Apple Style */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo and Project Name */}
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg transform rotate-12 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg transform -rotate-12" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            </div>

            <div>
              <h1 className="font-bold text-lg text-gray-900">{currentProject.title}</h1>
              <p className="text-xs text-gray-500">{currentProject.chapters.length} sections</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Generate
                <ChevronDown className="w-4 h-4" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium">Print PDF</div>
                      <div className="text-xs text-gray-500">For IngramSpark, etc.</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExport('epub')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">EPUB</div>
                      <div className="text-xs text-gray-500">Universal format</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExport('kindle')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="font-medium">Kindle</div>
                      <div className="text-xs text-gray-500">Amazon KDP</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExport('apple')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium">Apple Books</div>
                      <div className="text-xs text-gray-500">iBooks format</div>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 my-2" />

                  <button
                    onClick={() => handleExport('all')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 font-medium flex items-center gap-3"
                  >
                    <Download className="w-4 h-4" />
                    Export All Formats
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Three-Column Layout - Vellum Style */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Table of Contents */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <TableOfContents />
        </div>

        {/* Center - Content Editor */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <ContentEditor />
        </div>

        {/* Right Sidebar - Styles Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          {/* Content/Styles Switcher */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('content')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === 'content'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
                Content
              </button>
              <button
                onClick={() => setViewMode('styles')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === 'styles'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                Styles
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="p-4">
            <StylesPanel viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  )
}
