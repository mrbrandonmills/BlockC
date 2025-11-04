'use client'

import { useState } from 'react'
import { useBookStore } from '@/lib/store'
import { BookOpen, Download, Sparkles } from 'lucide-react'
import TemplateCarousel from '@/components/TemplateCarousel'
import DesignAssistant from '@/components/DesignAssistant'

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

    // Premium templates from baergroup.com aesthetic
    switch (templateId) {
      case 'executive-lime':
        return (
          <div className="h-full flex items-center justify-center p-16 bg-gray-50">
            <div className="max-w-2xl space-y-12">
              <div className="space-y-4">
                <div className="text-9xl font-black tracking-tighter leading-none text-lime-400">01</div>
                <h1 className="text-5xl font-bold tracking-tight leading-tight text-black">{title}</h1>
              </div>
              <div className="text-lg font-light leading-relaxed text-black" style={{ lineHeight: '2.2' }}>
                <p className="first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:leading-none first-letter:text-green-800">
                  {firstPara.slice(0, 300)}...
                </p>
              </div>
              <div className="w-24 h-1 bg-lime-400 shadow-lg" />
            </div>
          </div>
        )

      case 'monochrome-luxury':
        return (
          <div className="h-full flex items-center justify-center p-20 bg-white">
            <div className="max-w-xl space-y-16">
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-black" />
                <span className="text-xs font-light tracking-[0.3em] uppercase text-gray-600">Chapter One</span>
              </div>
              <h1 className="text-6xl font-thin tracking-tight leading-none text-black">{title}</h1>
              <p className="text-base font-light text-black" style={{ lineHeight: '2.5' }}>{firstPara.slice(0, 250)}...</p>
            </div>
          </div>
        )

      case 'asymmetric-bold':
        return (
          <div className="h-full flex items-end p-16 bg-black">
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-7 space-y-10">
                <div>
                  <div className="text-sm font-bold tracking-widest uppercase mb-6 text-yellow-400">Chapter 01</div>
                  <h1 className="text-7xl font-black leading-none text-white">
                    {title.split(' ').map((word, i) => (
                      <div key={i} className={i % 2 === 0 ? '' : 'ml-16'}>{word}</div>
                    ))}
                  </h1>
                </div>
              </div>
              <div className="col-span-5 flex items-end">
                <p className="text-sm font-light leading-relaxed text-white opacity-80" style={{ lineHeight: '2' }}>
                  {firstPara.slice(0, 200)}...
                </p>
              </div>
            </div>
          </div>
        )

      case 'gradient-editorial':
        return (
          <div className="h-full flex items-center justify-center p-16 bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="max-w-2xl space-y-12 text-center">
              <div className="text-9xl font-black opacity-20 text-white">1</div>
              <h1 className="text-6xl font-bold tracking-tight leading-tight -mt-20 text-white">{title}</h1>
              <div className="flex justify-center">
                <div className="w-32 h-1 bg-yellow-200 opacity-60" />
              </div>
              <p className="text-lg font-light text-white opacity-90" style={{ lineHeight: '2.2' }}>
                {firstPara.slice(0, 250)}...
              </p>
            </div>
          </div>
        )

      case 'swiss-precision':
        return (
          <div className="h-full p-16 bg-gray-50">
            <div className="h-full grid grid-cols-24 gap-4">
              <div className="col-span-4 flex flex-col justify-between">
                <div className="text-7xl font-bold text-red-600">01</div>
                <div className="w-2 h-32 bg-black" />
              </div>
              <div className="col-span-16 flex flex-col justify-center space-y-8">
                <h1 className="text-5xl font-semibold tracking-tight leading-tight text-gray-900">{title}</h1>
                <p className="text-base font-normal text-gray-900" style={{ lineHeight: '2' }}>
                  {firstPara.slice(0, 300)}...
                </p>
              </div>
            </div>
          </div>
        )

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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{currentProject.title}</h2>
            <p className="text-xs text-gray-600">{currentProject.chapters.length} sections</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Template Carousel */}
        <div className="w-2/5 bg-white border-r border-gray-200 overflow-y-auto p-8">
          {/* AI Design Assistant */}
          <div className="mb-8">
            <DesignAssistant />
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Browse All Templates</h3>
            <p className="text-gray-600">32 professional designs organized by mood</p>
          </div>

          <TemplateCarousel
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>

        {/* Right - Live Preview */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-600">See your book with each template instantly</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-12">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '6/9', minHeight: '900px' }}>
              {renderPreview(selectedTemplate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
