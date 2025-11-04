'use client'

import { useState } from 'react'
import { useBookStore, SectionType } from '@/lib/store'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  GripVertical,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Star,
  Copyright,
  Heart,
  Users,
  Info,
} from 'lucide-react'

const SECTION_ICONS: Record<SectionType, any> = {
  'title-page': Star,
  'copyright': Copyright,
  'dedication': Heart,
  'epigraph': FileText,
  'foreword': FileText,
  'preface': FileText,
  'prologue': FileText,
  'chapter': BookOpen,
  'epilogue': FileText,
  'afterword': FileText,
  'acknowledgments': Users,
  'about-author': Info,
  'also-by': FileText,
  'image': ImageIcon,
}

export default function TableOfContents() {
  const { currentProject, activeChapterId, setActiveChapter, addChapter } = useBookStore()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['chapter']))

  if (!currentProject) return null

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const groupedChapters = currentProject.chapters.reduce((acc, chapter) => {
    const type = chapter.sectionType || 'chapter'
    if (!acc[type]) acc[type] = []
    acc[type].push(chapter)
    return acc
  }, {} as Record<string, typeof currentProject.chapters>)

  const sectionOrder: Array<{ type: SectionType; label: string }> = [
    { type: 'title-page', label: 'Title Page' },
    { type: 'copyright', label: 'Copyright' },
    { type: 'dedication', label: 'Dedication' },
    { type: 'epigraph', label: 'Epigraph' },
    { type: 'foreword', label: 'Foreword' },
    { type: 'preface', label: 'Preface' },
    { type: 'prologue', label: 'Prologue' },
    { type: 'chapter', label: 'Chapters' },
    { type: 'epilogue', label: 'Epilogue' },
    { type: 'afterword', label: 'Afterword' },
    { type: 'acknowledgments', label: 'Acknowledgments' },
    { type: 'about-author', label: 'About the Author' },
    { type: 'also-by', label: 'Also By' },
  ]

  const addSection = (type: SectionType) => {
    const sectionLabels: Record<SectionType, string> = {
      'title-page': 'Title Page',
      'copyright': 'Copyright',
      'dedication': 'Dedication',
      'epigraph': 'Epigraph',
      'foreword': 'Foreword',
      'preface': 'Preface',
      'prologue': 'Prologue',
      'chapter': 'Untitled Chapter',
      'epilogue': 'Epilogue',
      'afterword': 'Afterword',
      'acknowledgments': 'Acknowledgments',
      'about-author': 'About the Author',
      'also-by': 'Also By',
      'image': 'Full Page Image',
    }

    addChapter({
      title: sectionLabels[type],
      content: '',
      sectionType: type,
    })

    setShowAddMenu(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold text-white mb-3">Contents</h2>

        {/* Add Element Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Element
          </button>

          {showAddMenu && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50 max-h-96 overflow-y-auto">
              {sectionOrder.map(({ type, label }) => {
                const Icon = SECTION_ICONS[type]
                return (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span>{label}</span>
                  </button>
                )
              })}

              <div className="border-t border-white/10 my-2" />

              <button
                onClick={() => addSection('image')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
              >
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <span>Full Page Image</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TOC List */}
      <div className="flex-1 overflow-y-auto py-2">
        {sectionOrder.map(({ type, label }) => {
          const chapters = groupedChapters[type] || []
          if (chapters.length === 0 && type !== 'chapter') return null

          const isExpanded = expandedSections.has(type)
          const Icon = SECTION_ICONS[type]

          return (
            <div key={type} className="mb-1">
              {/* Section Group Header (for chapters) */}
              {type === 'chapter' && chapters.length > 0 && (
                <button
                  onClick={() => toggleSection(type)}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <BookOpen className="w-4 h-4" />
                  <span>Chapters ({chapters.length})</span>
                </button>
              )}

              {/* Chapter Items */}
              {(isExpanded || type !== 'chapter') && chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapter(chapter.id)}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-all duration-200 ${
                    activeChapterId === chapter.id
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-2 border-blue-500'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent'
                  } ${type === 'chapter' ? 'pl-8' : 'pl-4'}`}
                >
                  <GripVertical className="w-3 h-3 opacity-50" />
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{chapter.title}</div>
                    {chapter.numbered && chapter.chapterNumber && (
                      <div className="text-xs opacity-60">Chapter {chapter.chapterNumber}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 bg-slate-900/50">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Total sections:</span>
            <span className="font-medium text-gray-300">{currentProject.chapters.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Chapters:</span>
            <span className="font-medium text-gray-300">{groupedChapters['chapter']?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
