'use client'

import { useState } from 'react'
import { useBookStore } from '@/lib/store'
import {
  BookOpen,
  Download,
  Save,
  Settings,
  FileText,
  Sparkles,
} from 'lucide-react'
import TableOfContents from '@/components/TableOfContents'
import ContentEditor from '@/components/ContentEditor'
import StylesPanel from '@/components/StylesPanel'

type ViewMode = 'content' | 'styles'

export default function BookEditor() {
  const { currentProject, saveProject } = useBookStore()
  const [viewMode, setViewMode] = useState<ViewMode>('content')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">No project loaded</p>
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Premium Top Navigation Bar */}
      <header className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo and Project Name */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 group cursor-pointer">
              {/* Animated geometric logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl transform rotate-12 opacity-80 group-hover:rotate-45 transition-all duration-500 shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 rounded-xl transform -rotate-12 group-hover:-rotate-45 transition-all duration-500 shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl group-hover:scale-110 transition-all duration-500 shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={2} />
              </div>
            </div>

            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">{currentProject.title}</h1>
              <p className="text-xs text-gray-400">{currentProject.chapters.length} sections • {currentProject.author}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center gap-2 border border-white/10 hover:border-white/20 disabled:opacity-50 backdrop-blur-xl"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Generate Book
                <Sparkles className="w-4 h-4" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 overflow-hidden">
                  {[
                    { format: 'pdf', label: 'Print PDF', desc: 'For IngramSpark, KDP Print', color: 'red' },
                    { format: 'epub', label: 'EPUB', desc: 'Universal ebook format', color: 'blue' },
                    { format: 'kindle', label: 'Kindle', desc: 'Amazon KDP optimized', color: 'orange' },
                    { format: 'apple', label: 'Apple Books', desc: 'iBooks format', color: 'purple' },
                  ].map((item) => (
                    <button
                      key={item.format}
                      onClick={() => handleExport(item.format as any)}
                      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <FileText className={`w-5 h-5 text-${item.color}-400`} />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </button>
                  ))}

                  <div className="border-t border-white/10 my-2" />

                  <button
                    onClick={() => handleExport('all')}
                    className="w-full px-4 py-3 text-left bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">Export All Formats</div>
                      <div className="text-xs text-gray-400">Get everything at once</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Three-Column Premium Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Table of Contents */}
        <div className="w-72 bg-slate-800/50 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
          <TableOfContents />
        </div>

        {/* Center - Content Editor */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900/50 to-slate-800/50">
          <ContentEditor />
        </div>

        {/* Right Sidebar - Styles Panel */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
          {/* Content/Styles Switcher */}
          <div className="sticky top-0 bg-slate-800/80 backdrop-blur-xl border-b border-white/10 p-4 z-10">
            <div className="flex gap-2 bg-slate-900/50 rounded-xl p-1.5 border border-white/5">
              <button
                onClick={() => setViewMode('content')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  viewMode === 'content'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                Content
              </button>
              <button
                onClick={() => setViewMode('styles')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  viewMode === 'styles'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Styles
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="p-5">
            <StylesPanel viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  )
}
