'use client'

import { useState } from 'react'
import { Search, Grid3x3, LayoutGrid, Sparkles, Star, TrendingUp } from 'lucide-react'
import Image from 'next/image'

interface TemplateData {
  id: string
  name: string
  category: string
  thumbnail: string
  isPremium: boolean
  isTrending: boolean
  elements: any[] // Template elements to load into editor
  description: string
}

// Sample visual templates
const VISUAL_TEMPLATES: TemplateData[] = [
  {
    id: 'classic-chapter',
    name: 'Classic Chapter Opening',
    category: 'Chapter Pages',
    thumbnail: 'data:image/svg+xml,%3Csvg width="400" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="600" fill="%23fffef7"/%3E%3Ctext x="200" y="200" text-anchor="middle" font-family="Georgia" font-size="12" fill="%238B7355"%3ECHAPTER ONE%3C/text%3E%3Ctext x="200" y="250" text-anchor="middle" font-family="Georgia" font-size="32" font-weight="bold" fill="%232B2B2B"%3EThe Beginning%3C/text%3E%3Cline x1="150" y1="280" x2="250" y2="280" stroke="%238B7355" stroke-width="1"/%3E%3Ctext x="50" y="350" font-family="Georgia" font-size="16" fill="%232B2B2B"%3EIt was a bright cold day in April...%3C/text%3E%3C/svg%3E',
    isPremium: false,
    isTrending: true,
    description: 'Elegant chapter opening with centered title and ornamental line',
    elements: [
      { id: '1', type: 'text', content: 'CHAPTER ONE', x: 150, y: 100, width: 300, height: 40, fontSize: 12, align: 'center', color: '#8B7355' },
      { id: '2', type: 'text', content: 'The Beginning', x: 100, y: 150, width: 400, height: 60, fontSize: 32, align: 'center', bold: true },
      { id: '3', type: 'line', content: '', x: 200, y: 220, width: 200, height: 2, color: '#8B7355' },
      { id: '4', type: 'text', content: 'It was a bright cold day in April...', x: 50, y: 280, width: 500, height: 400, fontSize: 16 },
    ]
  },
  {
    id: 'executive-modern',
    name: 'Executive Modern',
    category: 'Chapter Pages',
    thumbnail: 'data:image/svg+xml,%3Csvg width="400" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="600" fill="%23F6F6F6"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="72" font-weight="900" fill="%239DFF20"%3E01%3C/text%3E%3Ctext x="50" y="220" font-family="Arial" font-size="36" font-weight="bold" fill="%23000"%3EChapter Title%3C/text%3E%3Crect x="50" y="240" width="100" height="4" fill="%239DFF20"/%3E%3Ctext x="50" y="300" font-family="Arial" font-size="14" fill="%23000"%3EContent begins here...%3C/text%3E%3C/svg%3E',
    isPremium: true,
    isTrending: true,
    description: 'Ultra-modern design with lime accent and bold typography',
    elements: [
      { id: '1', type: 'text', content: '01', x: 50, y: 80, width: 200, height: 100, fontSize: 72, bold: true, color: '#9DFF20', fontFamily: 'Arial' },
      { id: '2', type: 'text', content: 'Chapter Title', x: 50, y: 180, width: 500, height: 60, fontSize: 36, bold: true, fontFamily: 'Arial' },
      { id: '3', type: 'shape', content: 'rectangle', x: 50, y: 250, width: 100, height: 4, backgroundColor: '#9DFF20' },
      { id: '4', type: 'text', content: 'Content begins here...', x: 50, y: 300, width: 500, height: 500, fontSize: 14, fontFamily: 'Arial' },
    ]
  },
  {
    id: 'ornamental-vintage',
    name: 'Ornamental Vintage',
    category: 'Chapter Pages',
    thumbnail: 'data:image/svg+xml,%3Csvg width="400" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="600" fill="%23FFFBEB"/%3E%3Ctext x="200" y="150" text-anchor="middle" font-size="24"%3E❦%3C/text%3E%3Ctext x="200" y="200" text-anchor="middle" font-family="Georgia" font-size="14" fill="%23B45309"%3ECHAPTER I%3C/text%3E%3Ctext x="200" y="250" text-anchor="middle" font-family="Georgia" font-size="28" font-weight="bold"%3EThe Story Begins%3C/text%3E%3Ctext x="200" y="280" text-anchor="middle" font-size="24"%3E❦%3C/text%3E%3C/svg%3E',
    isPremium: false,
    isTrending: false,
    description: 'Classic vintage style with ornamental flourishes',
    elements: [
      { id: '1', type: 'ornament', content: '❦', x: 250, y: 100, width: 100, height: 40 },
      { id: '2', type: 'text', content: 'CHAPTER I', x: 150, y: 150, width: 300, height: 30, fontSize: 14, align: 'center', color: '#B45309' },
      { id: '3', type: 'text', content: 'The Story Begins', x: 100, y: 190, width: 400, height: 50, fontSize: 28, align: 'center', bold: true, fontFamily: 'Georgia' },
      { id: '4', type: 'ornament', content: '❦', x: 250, y: 250, width: 100, height: 40 },
    ]
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    category: 'Chapter Pages',
    thumbnail: 'data:image/svg+xml,%3Csvg width="400" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="600" fill="%23FFFFFF"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="10" fill="%23999"%3E01%3C/text%3E%3Ctext x="50" y="200" font-family="Arial" font-size="28" font-weight="300"%3EChapter Title%3C/text%3E%3Ctext x="50" y="280" font-family="Arial" font-size="12" fill="%23666"%3EText content here...%3C/text%3E%3C/svg%3E',
    isPremium: false,
    isTrending: false,
    description: 'Clean, minimal design with generous whitespace',
    elements: [
      { id: '1', type: 'text', content: '01', x: 50, y: 120, width: 100, height: 30, fontSize: 10, color: '#999999', fontFamily: 'Arial' },
      { id: '2', type: 'text', content: 'Chapter Title', x: 50, y: 150, width: 500, height: 50, fontSize: 28, fontFamily: 'Arial' },
      { id: '3', type: 'text', content: 'Text content here...', x: 50, y: 240, width: 500, height: 500, fontSize: 12, color: '#666666', fontFamily: 'Arial' },
    ]
  },
  {
    id: 'gradient-editorial',
    name: 'Gradient Editorial',
    category: 'Chapter Pages',
    thumbnail: 'data:image/svg+xml,%3Csvg width="400" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="600" fill="url(%23grad)"/%3E%3Ctext x="200" y="200" text-anchor="middle" font-size="64" font-weight="900" fill="%23FFF" opacity="0.2"%3E1%3C/text%3E%3Ctext x="200" y="280" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="%23FFF"%3EChapter One%3C/text%3E%3Crect x="150" y="300" width="100" height="2" fill="%23FFE5B4" opacity="0.6"/%3E%3C/svg%3E',
    isPremium: true,
    isTrending: true,
    description: 'Rich gradient background with editorial typography',
    elements: [
      { id: '1', type: 'text', content: '1', x: 220, y: 120, width: 160, height: 100, fontSize: 64, bold: true, color: '#FFFFFF', fontFamily: 'Arial' },
      { id: '2', type: 'text', content: 'Chapter One', x: 100, y: 240, width: 400, height: 60, fontSize: 32, align: 'center', bold: true, color: '#FFFFFF', fontFamily: 'Arial' },
      { id: '3', type: 'line', content: '', x: 250, y: 320, width: 100, height: 2, color: '#FFE5B4' },
    ]
  },
  {
    id: 'swiss-grid',
    name: 'Swiss Grid System',
    category: 'Chapter Pages',
    thumbnail: 'data:image/svg+xml,%3Csvg width="400" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="600" fill="%23FAFAFA"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="48" font-weight="bold" fill="%23FF3B30"%3E01%3C/text%3E%3Crect x="50" y="500" width="8" height="80" fill="%23000"/%3E%3Ctext x="150" y="250" font-family="Arial" font-size="32" font-weight="600"%3EChapter Title%3C/text%3E%3Ctext x="150" y="320" font-family="Arial" font-size="14"%3EContent starts here...%3C/text%3E%3C/svg%3E',
    isPremium: true,
    isTrending: false,
    description: 'Swiss-style grid system with mathematical precision',
    elements: [
      { id: '1', type: 'text', content: '01', x: 50, y: 140, width: 100, height: 80, fontSize: 48, bold: true, color: '#FF3B30', fontFamily: 'Arial' },
      { id: '2', type: 'shape', content: 'rectangle', x: 50, y: 500, width: 8, height: 80, backgroundColor: '#000000' },
      { id: '3', type: 'text', content: 'Chapter Title', x: 150, y: 200, width: 400, height: 60, fontSize: 32, bold: true, fontFamily: 'Arial' },
      { id: '4', type: 'text', content: 'Content starts here...', x: 150, y: 280, width: 400, height: 500, fontSize: 14, fontFamily: 'Arial' },
    ]
  },
]

const CATEGORIES = ['All', 'Chapter Pages', 'Title Pages', 'Ornamental', 'Modern', 'Classic']

interface VisualTemplateGalleryProps {
  onSelectTemplate: (template: TemplateData) => void
}

export default function VisualTemplateGallery({ onSelectTemplate }: VisualTemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredTemplates = VISUAL_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
            <p className="text-sm text-gray-600">{VISUAL_TEMPLATES.length} professional templates</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {template.isPremium && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      PRO
                    </div>
                  )}
                  {template.isTrending && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      TRENDING
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button className="w-full py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    Use This Template
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{template.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
