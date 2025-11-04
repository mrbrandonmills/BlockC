'use client'

import { styles, useBookStore } from '@/lib/store'
import { Check } from 'lucide-react'

export default function StyleSelector() {
  const { selectedStyle, setSelectedStyle } = useBookStore()

  return (
    <div className="space-y-3">
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => setSelectedStyle(style.id)}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all relative ${
            selectedStyle === style.id
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          {selectedStyle === style.id && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          <div className="font-medium text-gray-900 mb-1">{style.name}</div>
          <div className="text-sm text-gray-600 mb-2">{style.description}</div>
          <div className="text-xs text-gray-500 italic">{style.preview}</div>
        </button>
      ))}
    </div>
  )
}
