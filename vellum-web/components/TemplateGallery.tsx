'use client'

import { useState } from 'react'
import { useBookStore } from '@/lib/store'
import { Check, Eye, Sparkles, BookOpen } from 'lucide-react'

const TEMPLATE_DATABASE = [
  {
    id: 'luxury-lab',
    name: 'Luxury Laboratory',
    category: 'Modern Scientific',
    description: 'Geometric precision meets elegant typography',
    preview: '/previews/luxury-lab.png',
    features: ['Geometric ornaments', 'Cyan accents', 'Scientific aesthetic'],
    bestFor: 'Non-fiction, Technical, Modern literature',
  },
  {
    id: 'serif-classic',
    name: 'Serif Classic',
    category: 'Traditional',
    description: 'Timeless elegance with ornamental details',
    preview: '/previews/serif-classic.png',
    features: ['Drop caps', 'Ornamental flourishes', 'Classic serif'],
    bestFor: 'Literary fiction, Historical, Romance',
  },
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    category: 'Contemporary',
    description: 'Clean lines and bold minimalism',
    preview: '/previews/modern-sans.png',
    features: ['Sans-serif fonts', 'Bold accents', 'Contemporary'],
    bestFor: 'Business, Self-help, Modern fiction',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Ultra-Clean',
    description: 'Pure elegance through simplicity',
    preview: '/previews/minimalist.png',
    features: ['Maximum whitespace', 'Light typography', 'Zen aesthetic'],
    bestFor: 'Poetry, Photography books, Art',
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Professional',
    description: 'Scholarly precision and authority',
    preview: '/previews/academic.png',
    features: ['Traditional margins', 'Footnote support', 'Professional'],
    bestFor: 'Academic, Research, Educational',
  },
]

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void
  onPreviewTemplate: (templateId: string) => void
}

export default function TemplateGallery({ onSelectTemplate, onPreviewTemplate }: TemplateGalleryProps) {
  const { currentProject, setSelectedStyle } = useBookStore()
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const selectedStyle = currentProject?.selectedStyle || 'luxury-lab'

  const handleSelect = (templateId: string) => {
    setSelectedStyle(templateId)
    onSelectTemplate(templateId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Choose Your Book Template</h1>
              <p className="text-gray-600">Select a professional design that matches your vision</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">5 Professional Templates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {TEMPLATE_DATABASE.map((template) => {
            const isSelected = selectedStyle === template.id
            const isHovered = hoveredTemplate === template.id

            return (
              <div
                key={template.id}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                    : 'hover:shadow-xl hover:scale-102'
                }`}
              >
                {/* Preview Image Placeholder */}
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  {/* Simulated Book Preview */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="bg-white rounded-lg shadow-2xl p-8 w-full h-full border border-gray-200">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-gray-500">
                          <BookOpen className="w-3 h-3" />
                          <span>Preview</span>
                        </div>

                        {template.id === 'luxury-lab' && (
                          <div className="text-center space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-px w-8 bg-cyan-500" />
                              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Chapter 1</span>
                              <div className="h-px w-8 bg-cyan-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">The Beginning</h2>
                            <p className="text-xs leading-relaxed text-gray-700">
                              <span className="text-3xl float-left mr-1.5 text-cyan-600 font-serif leading-none">I</span>
                              t was a bright cold day in April, and the clocks were striking thirteen. The hallway smelled of boiled cabbage.
                            </p>
                          </div>
                        )}

                        {template.id === 'serif-classic' && (
                          <div className="text-center space-y-3">
                            <div className="text-amber-700">❦</div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-800">Chapter One</div>
                            <h2 className="text-xl font-serif font-bold text-amber-900">The Beginning</h2>
                            <div className="text-amber-700">❦</div>
                            <p className="text-xs leading-relaxed text-amber-900 font-serif">
                              <span className="text-4xl float-left mr-1.5 font-serif leading-none">I</span>
                              t was a bright cold day in April, and the clocks were striking thirteen.
                            </p>
                          </div>
                        )}

                        {template.id === 'modern-sans' && (
                          <div className="space-y-3">
                            <div className="text-[9px] uppercase tracking-widest text-blue-600 font-bold">Chapter 1</div>
                            <h2 className="text-xl font-sans font-bold text-gray-900">The Beginning</h2>
                            <div className="h-1 w-10 bg-blue-500 rounded" />
                            <p className="text-xs leading-relaxed text-gray-700">
                              It was a bright cold day in April, and the clocks were striking thirteen.
                            </p>
                          </div>
                        )}

                        {template.id === 'minimalist' && (
                          <div className="space-y-4">
                            <div className="text-[9px] text-gray-400">01</div>
                            <h2 className="text-lg font-light text-gray-900 tracking-tight">The Beginning</h2>
                            <p className="text-[10px] leading-relaxed text-gray-600 font-light">
                              It was a bright cold day in April, and the clocks were striking thirteen.
                            </p>
                          </div>
                        )}

                        {template.id === 'academic' && (
                          <div className="space-y-3">
                            <h2 className="text-lg font-serif font-bold text-gray-900">1. The Beginning</h2>
                            <div className="h-px w-full bg-gray-300" />
                            <p className="text-xs leading-relaxed text-gray-800 font-serif indent-4">
                              It was a bright cold day in April, and the clocks were striking thirteen.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  )}

                  {/* Hover Preview Button */}
                  {isHovered && !isSelected && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <button
                        onClick={() => onPreviewTemplate(template.id)}
                        className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-xl"
                      >
                        <Eye className="w-4 h-4" />
                        Preview Your Book
                      </button>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Best For */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Best for:</div>
                    <div className="text-sm text-gray-700 font-medium">{template.bestFor}</div>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelect(template.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Template'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
