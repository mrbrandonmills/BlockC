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
  const { currentProject, activeChapterId, setActiveChapter, addChapter, reorderChapter, deleteChapter } = useBookStore()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['chapters']))

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
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>

        {/* Add Element Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Element
          </button>

          {showAddMenu && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
              {sectionOrder.map(({ type, label }) => {
                const Icon = SECTION_ICONS[type]
                return (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span>{label}</span>
                  </button>
                )
              })}

              <div className="border-t border-gray-200 my-2" />

              <button
                onClick={() => addSection('image')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <ImageIcon className="w-4 h-4 text-gray-600" />
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
                  className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors ${
                    activeChapterId === chapter.id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 border-l-2 border-transparent'
                  } ${type === 'chapter' ? 'pl-8' : 'pl-4'}`}
                >
                  <GripVertical className="w-3 h-3 text-gray-400" />
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{chapter.title}</div>
                    {chapter.numbered && chapter.chapterNumber && (
                      <div className="text-xs text-gray-500">Chapter {chapter.chapterNumber}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Total sections:</span>
            <span className="font-medium">{currentProject.chapters.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Chapters:</span>
            <span className="font-medium">{groupedChapters['chapter']?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
