'use client'

import { useState } from 'react'
import { useBookStore, SectionType } from '@/lib/store'
import {
  Settings,
  Sparkles,
  Check,
  Type,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react'

interface StylesPanelProps {
  viewMode: 'content' | 'styles'
}

const BOOK_STYLES = [
  {
    id: 'luxury-lab',
    name: 'Luxury Laboratory',
    category: 'Modern',
    preview: (
      <div className="bg-gradient-to-br from-slate-100 to-gray-100 p-6 rounded-lg border border-gray-300">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-8 h-px bg-cyan-500" />
            <span className="text-xs uppercase tracking-wider font-bold">Chapter 1</span>
            <div className="w-8 h-px bg-cyan-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">The Beginning</h2>
          <div className="space-y-2 text-xs leading-relaxed text-slate-700">
            <p><span className="text-4xl float-left mr-2 text-cyan-600 font-serif">I</span>t was a bright cold day in April, and the clocks were striking thirteen.</p>
            <p className="text-[10px] opacity-60">Modern geometric design with scientific aesthetic and cyan accents</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'serif-classic',
    name: 'Serif Classic',
    category: 'Traditional',
    preview: (
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-xs text-amber-700 mb-1">❦</div>
            <div className="text-xs uppercase tracking-widest text-amber-800">Chapter One</div>
            <h2 className="text-2xl font-serif font-bold text-amber-900 mt-2">The Beginning</h2>
            <div className="text-xs text-amber-700 mt-1">❦</div>
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-amber-900 font-serif">
            <p><span className="text-5xl float-left mr-2 font-serif leading-none">I</span>t was a bright cold day in April, and the clocks were striking thirteen.</p>
            <p className="text-[10px] opacity-60 font-sans">Traditional serif fonts with drop caps and ornamental details</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    category: 'Contemporary',
    preview: (
      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Chapter 1</div>
            <h2 className="text-2xl font-sans font-bold text-gray-900">The Beginning</h2>
            <div className="h-1 w-12 bg-blue-500 rounded" />
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-gray-700 font-sans">
            <p>It was a bright cold day in April, and the clocks were striking thirteen.</p>
            <p className="text-[10px] opacity-60">Clean sans-serif with minimal decoration and bold accents</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Ultra-Clean',
    preview: (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-6">
          <div className="text-[10px] text-gray-400">01</div>
          <h2 className="text-xl font-light text-gray-900 tracking-tight">The Beginning</h2>
          <div className="space-y-3 text-[11px] leading-relaxed text-gray-600 font-light">
            <p>It was a bright cold day in April, and the clocks were striking thirteen.</p>
            <p className="text-[9px] opacity-50">Maximum whitespace, minimal styling, pure elegance</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Professional',
    preview: (
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">1. The Beginning</h2>
            <div className="h-px w-full bg-gray-300 mt-2" />
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-gray-800 font-serif">
            <p className="indent-4">It was a bright cold day in April, and the clocks were striking thirteen.</p>
            <p className="text-[10px] opacity-60 font-sans">Professional academic style with traditional margins and footnotes</p>
          </div>
        </div>
      </div>
    ),
  },
]

export default function StylesPanel({ viewMode }: StylesPanelProps) {
  const {
    currentProject,
    activeChapterId,
    convertChapterType,
    toggleChapterNumbering,
    updateChapterMetadata,
    updateProjectISBN,
    deleteChapter,
    setSelectedStyle,
  } = useBookStore()

  const [localISBN, setLocalISBN] = useState('')
  const [selectedStyleId, setSelectedStyleId] = useState(currentProject?.selectedStyle || 'luxury-lab')

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

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId)
    setSelectedStyle(styleId)
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
        {/* Section Settings */}
        <div>
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Section Settings
          </h3>

          <div className="space-y-3">
            {/* Convert To */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Convert To
              </label>
              <select
                value={chapter.sectionType || 'chapter'}
                onChange={(e) => convertChapterType(activeChapterId, e.target.value as SectionType)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-white/20 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
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
                    <div className="text-sm font-medium text-white">Numbered</div>
                    <div className="text-xs text-gray-400">Show chapter number</div>
                  </div>
                </label>
              </div>
            )}

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subtitle (optional)
              </label>
              <input
                type="text"
                value={chapter.subtitle || ''}
                onChange={(e) => updateChapterMetadata(activeChapterId, { subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-white/20 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter subtitle..."
              />
            </div>
          </div>
        </div>

        {/* Title Page Editor */}
        {chapter.sectionType === 'title-page' && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Title Info
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={currentProject.title}
                  disabled
                  className="w-full px-3 py-2 bg-slate-900/50 border border-white/20 rounded-lg text-sm text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={currentProject.author || currentProject.authors[0]}
                  disabled
                  className="w-full px-3 py-2 bg-slate-900/50 border border-white/20 rounded-lg text-sm text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  ISBN Number (optional)
                </label>
                <input
                  type="text"
                  value={localISBN || currentProject.isbn || ''}
                  onChange={(e) => setLocalISBN(e.target.value)}
                  onBlur={handleISBNSave}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-white/20 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
                  placeholder="978-1-234567-89-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Upload */}
        {chapter.sectionType === 'image' && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Full Page Image
            </h3>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-900/30">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-300">
                Click to upload image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: High resolution (300 DPI)
              </p>
            </div>
          </div>
        )}

        {/* Delete Section */}
        <div className="border-t border-white/10 pt-6">
          <button
            onClick={() => {
              if (confirm(`Delete "${chapter.title}"?`)) {
                deleteChapter(activeChapterId)
              }
            }}
            className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Section
          </button>
        </div>
      </div>
    )
  }

  // Styles View - Visual Template Gallery
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Choose Your Style
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Select a visual template for your book
        </p>

        {/* Visual Style Gallery */}
        <div className="space-y-4">
          {BOOK_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={`w-full text-left transition-all duration-200 rounded-xl overflow-hidden ${
                selectedStyleId === style.id
                  ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                  : 'hover:ring-2 hover:ring-white/30'
              }`}
            >
              {/* Preview */}
              <div className="relative">
                {style.preview}
                {selectedStyleId === style.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Style Info */}
              <div className="p-3 bg-slate-800/80 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-sm">{style.name}</div>
                    <div className="text-xs text-gray-400">{style.category}</div>
                  </div>
                  {selectedStyleId === style.id && (
                    <span className="text-xs text-blue-400 font-medium">Selected</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
