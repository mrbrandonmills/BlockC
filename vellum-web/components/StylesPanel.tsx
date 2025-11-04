'use client'

import { useState } from 'react'
import { useBookStore, SectionType } from '@/lib/store'
import {
  ChevronRight,
  Hash,
  Type,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  Settings,
  Trash2,
} from 'lucide-react'

interface StylesPanelProps {
  viewMode: 'content' | 'styles'
}

export default function StylesPanel({ viewMode }: StylesPanelProps) {
  const {
    currentProject,
    activeChapterId,
    convertChapterType,
    toggleChapterNumbering,
    updateChapterMetadata,
    updateProjectISBN,
    deleteChapter,
  } = useBookStore()

  const [localISBN, setLocalISBN] = useState('')

  if (!currentProject || !activeChapterId) {
    return (
      <div className="text-center text-gray-400 py-12">
        <Settings className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm">Select a section to view options</p>
      </div>
    )
  }

  const chapter = currentProject.chapters.find((ch) => ch.id === activeChapterId)
  if (!chapter) return null

  const handleISBNSave = () => {
    if (localISBN) {
      updateProjectISBN(localISBN)
    }
  }

  const sectionTypes: Array<{ value: SectionType; label: string }> = [
    { value: 'title-page', label: 'Title Page' },
    { value: 'copyright', label: 'Copyright' },
    { value: 'dedication', label: 'Dedication' },
    { value: 'epigraph', label: 'Epigraph' },
    { value: 'foreword', label: 'Foreword' },
    { value: 'preface', label: 'Preface' },
    { value: 'prologue', label: 'Prologue' },
    { value: 'chapter', label: 'Chapter' },
    { value: 'epilogue', label: 'Epilogue' },
    { value: 'afterword', label: 'Afterword' },
    { value: 'acknowledgments', label: 'Acknowledgments' },
    { value: 'about-author', label: 'About the Author' },
    { value: 'also-by', label: 'Also By' },
    { value: 'image', label: 'Full Page Image' },
  ]

  if (viewMode === 'content') {
    return (
      <div className="space-y-6">
        {/* Section Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Section Settings
          </h3>

          <div className="space-y-3">
            {/* Convert To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convert To
              </label>
              <select
                value={chapter.sectionType || 'chapter'}
                onChange={(e) => convertChapterType(activeChapterId, e.target.value as SectionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
              >
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Numbered (for chapters) */}
            {chapter.sectionType === 'chapter' && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chapter.numbered ?? true}
                    onChange={() => toggleChapterNumbering(activeChapterId)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Numbered</div>
                    <div className="text-xs text-gray-500">Show chapter number</div>
                  </div>
                </label>
              </div>
            )}

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (optional)
              </label>
              <input
                type="text"
                value={chapter.subtitle || ''}
                onChange={(e) => updateChapterMetadata(activeChapterId, { subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Enter subtitle..."
              />
            </div>
          </div>
        </div>

        {/* Title Page Editor */}
        {chapter.sectionType === 'title-page' && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Title Info
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={currentProject.title}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={currentProject.author || currentProject.authors[0]}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN Number (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localISBN || currentProject.isbn || ''}
                    onChange={(e) => setLocalISBN(e.target.value)}
                    onBlur={handleISBNSave}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="978-1-234567-89-0"
                  />
                  {currentProject.isbn && (
                    <button className="p-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher (optional)
                </label>
                <input
                  type="text"
                  value={currentProject.publisher || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Publisher name"
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Upload (for image sections) */}
        {chapter.sectionType === 'image' && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Full Page Image
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: High resolution (300 DPI)
              </p>
            </div>
          </div>
        )}

        {/* Delete Section */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => {
              if (confirm(`Delete "${chapter.title}"?`)) {
                deleteChapter(activeChapterId)
              }
            }}
            className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete Section
          </button>
        </div>
      </div>
    )
  }

  // Styles View
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Section Styles
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Choose a style for this {chapter.sectionType === 'chapter' ? 'chapter' : 'section'}:
        </p>

        {/* Style Presets */}
        <div className="space-y-3">
          {['Classic', 'Modern', 'Elegant', 'Minimal', 'Bold'].map((style) => (
            <button
              key={style}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 mb-1">{style}</div>
              <div className="text-xs text-gray-500">
                {style === 'Classic' && 'Traditional serif fonts with ornamental details'}
                {style === 'Modern' && 'Clean sans-serif with minimal decoration'}
                {style === 'Elegant' && 'Refined typography with subtle accents'}
                {style === 'Minimal' && 'Ultra-clean design with maximum whitespace'}
                {style === 'Bold' && 'Strong typography with high contrast'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Drop Cap Option (for chapters) */}
      {chapter.sectionType === 'chapter' && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Text Features</h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">Drop Cap</div>
              <div className="text-xs text-gray-500">Large first letter</div>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
