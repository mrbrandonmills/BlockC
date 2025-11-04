'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

const TEMPLATE_MOODS = [
  {
    mood: 'Ultra-Premium ✨',
    color: 'from-yellow-400 via-yellow-500 to-orange-500',
    templates: [
      { id: 'executive-lime', name: 'Executive Lime', colors: { bg: '#F6F6F6', text: '#000000', accent: '#9DFF20' } },
      { id: 'monochrome-luxury', name: 'Monochrome Luxury', colors: { bg: '#FFFFFF', text: '#000000', accent: '#E0E0E0' } },
      { id: 'asymmetric-bold', name: 'Asymmetric Bold', colors: { bg: '#0A0A0A', text: '#FFFFFF', accent: '#FFD700' } },
      { id: 'gradient-editorial', name: 'Gradient Editorial', colors: { bg: '#667eea', text: '#FFFFFF', accent: '#FFE5B4' } },
      { id: 'swiss-precision', name: 'Swiss Precision', colors: { bg: '#FAFAFA', text: '#1A1A1A', accent: '#FF3B30' } },
    ]
  },
  {
    mood: 'Elegant & Refined',
    color: 'from-purple-600 to-pink-600',
    templates: [
      { id: 'serif-classic', name: 'Serif Classic', colors: { bg: '#FFFEF7', text: '#2B2B2B', accent: '#8B7355' } },
      { id: 'elegant-gold', name: 'Golden Elegance', colors: { bg: '#FFF9F0', text: '#1A1A1A', accent: '#D4AF37' } },
      { id: 'champagne', name: 'Champagne Dreams', colors: { bg: '#F9F7F4', text: '#2C2C2C', accent: '#C9B896' } },
      { id: 'midnight-purple', name: 'Midnight Purple', colors: { bg: '#F5F3F7', text: '#1C1C28', accent: '#6B4E9A' } },
    ]
  },
  {
    mood: 'Bold & Modern',
    color: 'from-blue-600 to-cyan-600',
    templates: [
      { id: 'luxury-lab', name: 'Luxury Laboratory', colors: { bg: '#E8E4DC', text: '#1A1A1A', accent: '#00CED1' } },
      { id: 'modern-sans', name: 'Modern Sans', colors: { bg: '#FFFFFF', text: '#111111', accent: '#3B82F6' } },
      { id: 'electric-blue', name: 'Electric Blue', colors: { bg: '#F0F9FF', text: '#0C4A6E', accent: '#0EA5E9' } },
      { id: 'neon-edge', name: 'Neon Edge', colors: { bg: '#FAFAFA', text: '#1F1F1F', accent: '#10B981' } },
    ]
  },
  {
    mood: 'Classic & Timeless',
    color: 'from-amber-600 to-orange-600',
    templates: [
      { id: 'academic', name: 'Academic', colors: { bg: '#F9FAFB', text: '#1F2937', accent: '#92400E' } },
      { id: 'library-brown', name: 'Library Brown', colors: { bg: '#FEF7ED', text: '#292524', accent: '#78350F' } },
      { id: 'vintage-cream', name: 'Vintage Cream', colors: { bg: '#FFFBEB', text: '#1C1917', accent: '#B45309' } },
      { id: 'oxford-blue', name: 'Oxford Blue', colors: { bg: '#F8FAFC', text: '#0F172A', accent: '#1E40AF' } },
    ]
  },
  {
    mood: 'Minimal & Clean',
    color: 'from-gray-600 to-slate-600',
    templates: [
      { id: 'minimalist', name: 'Minimalist', colors: { bg: '#FFFFFF', text: '#1F1F1F', accent: '#6B7280' } },
      { id: 'zen-white', name: 'Zen White', colors: { bg: '#FAFAFA', text: '#171717', accent: '#A1A1AA' } },
      { id: 'nordic-gray', name: 'Nordic Gray', colors: { bg: '#F5F5F5', text: '#262626', accent: '#737373' } },
      { id: 'pure-mono', name: 'Pure Monochrome', colors: { bg: '#FCFCFC', text: '#0A0A0A', accent: '#525252' } },
    ]
  },
  {
    mood: 'Luxurious & Premium',
    color: 'from-rose-600 to-pink-600',
    templates: [
      { id: 'rose-gold', name: 'Rose Gold', colors: { bg: '#FFF5F7', text: '#1A1A1A', accent: '#E91E63' } },
      { id: 'velvet-burgundy', name: 'Velvet Burgundy', colors: { bg: '#FEF2F2', text: '#1C1917', accent: '#991B1B' } },
      { id: 'platinum', name: 'Platinum Shine', colors: { bg: '#F8F9FA', text: '#212529', accent: '#ADB5BD' } },
      { id: 'diamond-white', name: 'Diamond White', colors: { bg: '#FFFFFF', text: '#000000', accent: '#E5E7EB' } },
    ]
  },
  {
    mood: 'Artistic & Creative',
    color: 'from-indigo-600 to-purple-600',
    templates: [
      { id: 'creative-teal', name: 'Creative Teal', colors: { bg: '#F0FDFA', text: '#134E4A', accent: '#14B8A6' } },
      { id: 'sunset-orange', name: 'Sunset Orange', colors: { bg: '#FFF7ED', text: '#7C2D12', accent: '#F97316' } },
      { id: 'lavender-mist', name: 'Lavender Mist', colors: { bg: '#FAF5FF', text: '#581C87', accent: '#A855F7' } },
      { id: 'forest-green', name: 'Forest Green', colors: { bg: '#F0FDF4', text: '#14532D', accent: '#22C55E' } },
    ]
  },
  {
    mood: 'Warm & Inviting',
    color: 'from-yellow-600 to-amber-600',
    templates: [
      { id: 'honey-amber', name: 'Honey Amber', colors: { bg: '#FFFBEB', text: '#78350F', accent: '#F59E0B' } },
      { id: 'terracotta', name: 'Terracotta', colors: { bg: '#FFF1E6', text: '#7C2D12', accent: '#EA580C' } },
      { id: 'warm-beige', name: 'Warm Beige', colors: { bg: '#FAF8F3', text: '#44403C', accent: '#A8A29E' } },
      { id: 'caramel', name: 'Caramel Sweet', colors: { bg: '#FEF3C7', text: '#78350F', accent: '#D97706' } },
    ]
  },
  {
    mood: 'Cool & Professional',
    color: 'from-cyan-600 to-teal-600',
    templates: [
      { id: 'corporate-blue', name: 'Corporate Blue', colors: { bg: '#F0F9FF', text: '#0C4A6E', accent: '#0284C7' } },
      { id: 'slate-modern', name: 'Slate Modern', colors: { bg: '#F8FAFC', text: '#0F172A', accent: '#475569' } },
      { id: 'frost-blue', name: 'Frost Blue', colors: { bg: '#ECFEFF', text: '#164E63', accent: '#06B6D4' } },
      { id: 'mint-fresh', name: 'Mint Fresh', colors: { bg: '#F0FDF4', text: '#14532D', accent: '#10B981' } },
    ]
  },
]

interface TemplateCarouselProps {
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
}

export default function TemplateCarousel({ selectedTemplate, onSelectTemplate }: TemplateCarouselProps) {
  const [activeMood, setActiveMood] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('template-scroll')
    if (container) {
      const scrollAmount = 300
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount

      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  const currentMood = TEMPLATE_MOODS[activeMood]

  return (
    <div className="space-y-6">
      {/* Mood Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {TEMPLATE_MOODS.map((mood, index) => (
          <button
            key={mood.mood}
            onClick={() => {
              setActiveMood(index)
              setScrollPosition(0)
            }}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              activeMood === index
                ? `bg-gradient-to-r ${mood.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mood.mood}
          </button>
        ))}
      </div>

      {/* Template Carousel */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Template Cards */}
        <div
          id="template-scroll"
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth"
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          {currentMood.templates.map((template) => {
            const isSelected = selectedTemplate === template.id

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`flex-shrink-0 w-72 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <div
                  className={`rounded-xl overflow-hidden shadow-lg ${
                    isSelected ? 'ring-4 ring-blue-500 shadow-2xl' : ''
                  }`}
                >
                  {/* Preview Card */}
                  <div
                    className="h-96 p-8 flex items-center justify-center relative"
                    style={{ backgroundColor: template.colors.bg }}
                  >
                    {/* Mini Book Preview */}
                    <div className="space-y-4 text-center">
                      <div className="text-xs uppercase tracking-widest" style={{ color: template.colors.accent }}>
                        Chapter 1
                      </div>
                      <h3 className="text-2xl font-bold" style={{ color: template.colors.text }}>
                        The Beginning
                      </h3>
                      <div className="w-12 h-px mx-auto" style={{ backgroundColor: template.colors.accent }} />
                      <p className="text-xs leading-relaxed" style={{ color: template.colors.text }}>
                        It was a bright cold day in April, and the clocks were striking thirteen.
                      </p>
                    </div>

                    {/* Selection Badge */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="bg-white p-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900">{template.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{currentMood.mood}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
