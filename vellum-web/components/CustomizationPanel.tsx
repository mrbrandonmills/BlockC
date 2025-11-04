'use client'

import { useBookStore } from '@/lib/store'
import { Palette, Type } from 'lucide-react'
import { useState } from 'react'

const FONT_OPTIONS = [
  'Georgia',
  'Times New Roman',
  'Garamond',
  'Palatino',
  'Arial',
  'Helvetica',
  'Verdana',
  'Calibri',
  'Merriweather',
  'Lora',
  'Roboto',
  'Open Sans',
]

export default function CustomizationPanel() {
  const { customColors, customFonts, setCustomColors, setCustomFonts } = useBookStore()
  const [showColors, setShowColors] = useState(false)
  const [showFonts, setShowFonts] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Customization</h3>

      {/* Colors Section */}
      <div className="mb-4">
        <button
          onClick={() => setShowColors(!showColors)}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Palette className="w-4 h-4" />
            Colors
          </span>
          <span className="text-xs text-gray-500">
            {showColors ? '▼' : '▶'}
          </span>
        </button>

        {showColors && (
          <div className="mt-2 space-y-3 pl-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Background
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColors.bg || '#E8E4DC'}
                  onChange={(e) => setCustomColors({ bg: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.bg || '#E8E4DC'}
                  onChange={(e) => setCustomColors({ bg: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="#E8E4DC"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColors.text || '#1A1A1A'}
                  onChange={(e) => setCustomColors({ text: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.text || '#1A1A1A'}
                  onChange={(e) => setCustomColors({ text: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="#1A1A1A"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Accent 1
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColors.accent1 || '#2F4F4F'}
                  onChange={(e) => setCustomColors({ accent1: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.accent1 || '#2F4F4F'}
                  onChange={(e) => setCustomColors({ accent1: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="#2F4F4F"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Accent 2
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColors.accent2 || '#00CED1'}
                  onChange={(e) => setCustomColors({ accent2: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.accent2 || '#00CED1'}
                  onChange={(e) => setCustomColors({ accent2: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="#00CED1"
                />
              </div>
            </div>

            <button
              onClick={() =>
                setCustomColors({ bg: '', text: '', accent1: '', accent2: '' })
              }
              className="w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Reset to Template Defaults
            </button>
          </div>
        )}
      </div>

      {/* Fonts Section */}
      <div>
        <button
          onClick={() => setShowFonts(!showFonts)}
          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Type className="w-4 h-4" />
            Fonts
          </span>
          <span className="text-xs text-gray-500">
            {showFonts ? '▼' : '▶'}
          </span>
        </button>

        {showFonts && (
          <div className="mt-2 space-y-3 pl-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Body Font
              </label>
              <select
                value={customFonts.body || 'Georgia'}
                onChange={(e) => setCustomFonts({ body: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Heading Font
              </label>
              <select
                value={customFonts.heading || 'Georgia'}
                onChange={(e) => setCustomFonts({ heading: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setCustomFonts({ body: '', heading: '' })}
              className="w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Reset to Template Defaults
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
