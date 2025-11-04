'use client'

import { Check } from 'lucide-react'

// Ultra-premium templates inspired by baergroup.com design philosophy
export const PREMIUM_TEMPLATES = [
  {
    id: 'executive-lime',
    name: 'Executive Lime',
    mood: 'Bold & Modern',
    colors: {
      bg: '#F6F6F6',
      text: '#000000',
      accent: '#9DFF20',
      secondary: '#345C00',
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans',
      weights: { light: 300, regular: 400, medium: 500, bold: 700, black: 900 }
    },
    description: 'Ultra-modern executive style with lime accent and generous whitespace',
    preview: (content: string, title: string) => (
      <div className="h-full flex items-center justify-center p-16" style={{ backgroundColor: '#F6F6F6' }}>
        <div className="max-w-2xl space-y-12">
          {/* Chapter number with oversized typography */}
          <div className="space-y-4">
            <div
              className="text-9xl font-black tracking-tighter leading-none"
              style={{ color: '#9DFF20', fontFamily: 'DM Sans' }}
            >
              01
            </div>
            <h1
              className="text-5xl font-bold tracking-tight leading-tight"
              style={{ color: '#000000', fontFamily: 'DM Sans' }}
            >
              {title}
            </h1>
          </div>

          {/* Content with generous leading */}
          <div
            className="text-lg font-light leading-relaxed"
            style={{ color: '#000000', fontFamily: 'DM Sans', lineHeight: '2.2' }}
          >
            <p className="first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:leading-none" style={{ color: '#345C00' }}>
              {content.slice(0, 300)}...
            </p>
          </div>

          {/* Subtle shadow accent */}
          <div className="w-24 h-1" style={{ backgroundColor: '#9DFF20', boxShadow: '6px 6px 9px rgba(157, 255, 32, 0.3)' }} />
        </div>
      </div>
    ),
  },
  {
    id: 'monochrome-luxury',
    name: 'Monochrome Luxury',
    mood: 'Minimal & Clean',
    colors: {
      bg: '#FFFFFF',
      text: '#000000',
      accent: '#E0E0E0',
      secondary: '#666666',
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans',
      weights: { light: 100, regular: 300, medium: 500, bold: 700, black: 900 }
    },
    description: 'Pure monochrome with extreme whitespace and ultra-light typography',
    preview: (content: string, title: string) => (
      <div className="h-full flex items-center justify-center p-20 bg-white">
        <div className="max-w-xl space-y-16">
          {/* Minimal chapter indicator */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-px bg-black" />
            <span className="text-xs font-light tracking-[0.3em] uppercase" style={{ fontFamily: 'DM Sans', color: '#666666' }}>
              Chapter One
            </span>
          </div>

          {/* Title with variable weights */}
          <h1
            className="text-6xl font-thin tracking-tight leading-none"
            style={{ fontFamily: 'DM Sans', fontWeight: 100, color: '#000000' }}
          >
            {title}
          </h1>

          {/* Ultra-light body text */}
          <p
            className="text-base font-light leading-loose"
            style={{ fontFamily: 'DM Sans', fontWeight: 300, color: '#000000', lineHeight: '2.5' }}
          >
            {content.slice(0, 250)}...
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'asymmetric-bold',
    name: 'Asymmetric Bold',
    mood: 'Bold & Modern',
    colors: {
      bg: '#0A0A0A',
      text: '#FFFFFF',
      accent: '#FFD700',
      secondary: '#FFA500',
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans',
      weights: { light: 300, regular: 400, medium: 600, bold: 800, black: 900 }
    },
    description: 'Dark asymmetrical layout with golden accents and dramatic typography',
    preview: (content: string, title: string) => (
      <div className="h-full flex items-end p-16" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="w-full grid grid-cols-12 gap-8">
          {/* Asymmetric layout */}
          <div className="col-span-7 space-y-10">
            <div>
              <div
                className="text-sm font-bold tracking-widest uppercase mb-6"
                style={{ color: '#FFD700', fontFamily: 'DM Sans' }}
              >
                Chapter 01
              </div>
              <h1
                className="text-7xl font-black leading-none"
                style={{ color: '#FFFFFF', fontFamily: 'DM Sans' }}
              >
                {title.split(' ').map((word, i) => (
                  <div key={i} className={i % 2 === 0 ? '' : 'ml-16'}>
                    {word}
                  </div>
                ))}
              </h1>
            </div>
          </div>

          <div className="col-span-5 flex items-end">
            <p
              className="text-sm font-light leading-relaxed"
              style={{ color: '#FFFFFF', fontFamily: 'DM Sans', opacity: 0.8, lineHeight: '2' }}
            >
              {content.slice(0, 200)}...
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'gradient-editorial',
    name: 'Gradient Editorial',
    mood: 'Luxurious & Premium',
    colors: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF',
      accent: '#FFE5B4',
      secondary: '#DDA0DD',
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans',
      weights: { light: 300, regular: 400, medium: 500, bold: 700, black: 900 }
    },
    description: 'Rich gradient backgrounds with editorial-style typography',
    preview: (content: string, title: string) => (
      <div
        className="h-full flex items-center justify-center p-16"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="max-w-2xl space-y-12 text-center">
          {/* Oversized serif number */}
          <div
            className="text-9xl font-black opacity-20"
            style={{ fontFamily: 'DM Sans', color: '#FFFFFF' }}
          >
            1
          </div>

          {/* Title with generous spacing */}
          <h1
            className="text-6xl font-bold tracking-tight leading-tight -mt-20"
            style={{ fontFamily: 'DM Sans', color: '#FFFFFF' }}
          >
            {title}
          </h1>

          {/* Accent line */}
          <div className="flex justify-center">
            <div className="w-32 h-1" style={{ backgroundColor: '#FFE5B4', opacity: 0.6 }} />
          </div>

          {/* Body text */}
          <p
            className="text-lg font-light leading-loose"
            style={{ fontFamily: 'DM Sans', color: '#FFFFFF', opacity: 0.9, lineHeight: '2.2' }}
          >
            {content.slice(0, 250)}...
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'swiss-precision',
    name: 'Swiss Precision',
    mood: 'Cool & Professional',
    colors: {
      bg: '#FAFAFA',
      text: '#1A1A1A',
      accent: '#FF3B30',
      secondary: '#8E8E93',
    },
    fonts: {
      heading: 'DM Sans',
      body: 'DM Sans',
      weights: { light: 300, regular: 400, medium: 500, bold: 600, black: 700 }
    },
    description: 'Swiss-style grid system with mathematical precision and red accent',
    preview: (content: string, title: string) => (
      <div className="h-full p-16" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="h-full grid grid-cols-24 gap-4">
          {/* Left column with chapter number */}
          <div className="col-span-4 flex flex-col justify-between">
            <div
              className="text-7xl font-bold"
              style={{ fontFamily: 'DM Sans', color: '#FF3B30' }}
            >
              01
            </div>
            <div className="w-2 h-32 bg-black" />
          </div>

          {/* Main content area */}
          <div className="col-span-16 flex flex-col justify-center space-y-8">
            <h1
              className="text-5xl font-semibold tracking-tight leading-tight"
              style={{ fontFamily: 'DM Sans', color: '#1A1A1A' }}
            >
              {title}
            </h1>

            <p
              className="text-base font-normal leading-relaxed"
              style={{ fontFamily: 'DM Sans', color: '#1A1A1A', lineHeight: '2' }}
            >
              {content.slice(0, 300)}...
            </p>
          </div>

          {/* Right gutter */}
          <div className="col-span-4" />
        </div>
      </div>
    ),
  },
]

interface PremiumTemplateCardProps {
  template: typeof PREMIUM_TEMPLATES[0]
  isSelected: boolean
  onSelect: () => void
  content: string
  title: string
}

export function PremiumTemplateCard({ template, isSelected, onSelect, content, title }: PremiumTemplateCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-105' : 'hover:scale-102'
      }`}
    >
      <div
        className={`rounded-2xl overflow-hidden shadow-xl ${
          isSelected ? 'ring-4 ring-blue-500 shadow-2xl' : 'shadow-lg'
        }`}
        style={{
          boxShadow: isSelected
            ? '0 20px 60px rgba(0, 0, 0, 0.3)'
            : '6px 6px 18px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Preview */}
        <div className="h-96 relative">
          {template.preview(content, title)}

          {isSelected && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="bg-white p-5 border-t border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{template.name}</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{template.mood}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
        </div>
      </div>
    </div>
  )
}
