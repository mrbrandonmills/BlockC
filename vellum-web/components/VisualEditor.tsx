'use client'

import { useState, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Sparkles,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react'

interface PageElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'line' | 'ornament'
  content: string
  x: number
  y: number
  width: number
  height: number
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
  align?: 'left' | 'center' | 'right'
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

interface VisualEditorProps {
  pageWidth: number
  pageHeight: number
  onElementsChange?: (elements: PageElement[]) => void
}

function DraggableElement({ element, onUpdate, onDelete, isSelected, onSelect }: {
  element: PageElement
  onUpdate: (id: string, updates: Partial<PageElement>) => void
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: () => void
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'page-element',
    item: element,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onUpdate(element.id, { content: e.target.value })
  }

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <textarea
            value={element.content}
            onChange={handleContentChange}
            className="w-full h-full bg-transparent border-none outline-none resize-none p-2"
            style={{
              fontSize: element.fontSize || 16,
              fontFamily: element.fontFamily || 'Georgia',
              color: element.color || '#000000',
              textAlign: element.align || 'left',
              fontWeight: element.bold ? 'bold' : 'normal',
              fontStyle: element.italic ? 'italic' : 'normal',
              textDecoration: element.underline ? 'underline' : 'none',
            }}
          />
        )

      case 'shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.backgroundColor || '#3B82F6',
              borderRadius: element.content === 'circle' ? '50%' : '0',
            }}
          />
        )

      case 'line':
        return (
          <div
            className="w-full"
            style={{
              height: '2px',
              backgroundColor: element.color || '#000000',
            }}
          />
        )

      case 'ornament':
        return (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {element.content}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={drag}
      onClick={onSelect}
      className={`absolute cursor-move ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
    >
      {renderElement()}

      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(element.id)
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

function AssetLibrary({ onAddElement }: {
  onAddElement: (type: PageElement['type'], content: string) => void
}) {
  const assets = [
    { type: 'text' as const, icon: Type, label: 'Text', content: 'Double click to edit' },
    { type: 'shape' as const, icon: Square, label: 'Rectangle', content: 'rectangle' },
    { type: 'shape' as const, icon: Circle, label: 'Circle', content: 'circle' },
    { type: 'line' as const, icon: Minus, label: 'Line', content: '' },
    { type: 'ornament' as const, icon: Sparkles, label: 'Ornament', content: '❦' },
  ]

  return (
    <div className="bg-white border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
      <h3 className="font-bold text-gray-900 mb-4">Design Assets</h3>

      <div className="grid grid-cols-2 gap-2">
        {assets.map((asset, index) => (
          <button
            key={index}
            onClick={() => onAddElement(asset.type, asset.content)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2"
          >
            <asset.icon className="w-6 h-6 text-gray-700" />
            <span className="text-xs font-medium text-gray-700">{asset.label}</span>
          </button>
        ))}
      </div>

      {/* Ornament Library */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 mb-2">Ornaments</h4>
        <div className="grid grid-cols-3 gap-2">
          {['❦', '✦', '❧', '✤', '⚜', '❈', '✺', '❖', '✿'].map((ornament) => (
            <button
              key={ornament}
              onClick={() => onAddElement('ornament', ornament)}
              className="p-2 border border-gray-200 rounded hover:bg-blue-50 text-2xl"
            >
              {ornament}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PropertiesPanel({ selectedElement, onUpdate }: {
  selectedElement: PageElement | null
  onUpdate: (id: string, updates: Partial<PageElement>) => void
}) {
  if (!selectedElement) {
    return (
      <div className="bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-500">Select an element to edit properties</p>
      </div>
    )
  }

  return (
    <div className="bg-white border-l border-gray-200 p-4 space-y-4 overflow-y-auto">
      <h3 className="font-bold text-gray-900">Properties</h3>

      {selectedElement.type === 'text' && (
        <>
          <div>
            <label className="text-xs font-medium text-gray-700">Font Size</label>
            <input
              type="number"
              value={selectedElement.fontSize || 16}
              onChange={(e) => onUpdate(selectedElement.id, { fontSize: parseInt(e.target.value) })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Font Family</label>
            <select
              value={selectedElement.fontFamily || 'Georgia'}
              onChange={(e) => onUpdate(selectedElement.id, { fontFamily: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="Georgia">Georgia (Serif)</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Garamond">Garamond</option>
              <option value="Arial">Arial (Sans)</option>
              <option value="Helvetica">Helvetica</option>
              <option value="DM Sans">DM Sans</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={(e) => onUpdate(selectedElement.id, { color: e.target.value })}
              className="w-full mt-1 h-10 rounded"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Text Style</label>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(selectedElement.id, { bold: !selectedElement.bold })}
                className={`p-2 border rounded ${selectedElement.bold ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdate(selectedElement.id, { italic: !selectedElement.italic })}
                className={`p-2 border rounded ${selectedElement.italic ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdate(selectedElement.id, { underline: !selectedElement.underline })}
                className={`p-2 border rounded ${selectedElement.underline ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Alignment</label>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(selectedElement.id, { align: 'left' })}
                className={`p-2 border rounded ${selectedElement.align === 'left' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdate(selectedElement.id, { align: 'center' })}
                className={`p-2 border rounded ${selectedElement.align === 'center' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdate(selectedElement.id, { align: 'right' })}
                className={`p-2 border rounded ${selectedElement.align === 'right' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedElement.type === 'shape' && (
        <div>
          <label className="text-xs font-medium text-gray-700">Background Color</label>
          <input
            type="color"
            value={selectedElement.backgroundColor || '#3B82F6'}
            onChange={(e) => onUpdate(selectedElement.id, { backgroundColor: e.target.value })}
            className="w-full mt-1 h-10 rounded"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-700">Width</label>
        <input
          type="number"
          value={selectedElement.width}
          onChange={(e) => onUpdate(selectedElement.id, { width: parseInt(e.target.value) })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Height</label>
        <input
          type="number"
          value={selectedElement.height}
          onChange={(e) => onUpdate(selectedElement.id, { height: parseInt(e.target.value) })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  )
}

export default function VisualEditor({ pageWidth = 600, pageHeight = 900, onElementsChange }: VisualEditorProps) {
  const [elements, setElements] = useState<PageElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'page-element',
    drop: (item: PageElement, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset) {
        const canvasRect = document.getElementById('canvas')?.getBoundingClientRect()
        if (canvasRect) {
          updateElement(item.id, {
            x: offset.x - canvasRect.left,
            y: offset.y - canvasRect.top,
          })
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const addElement = useCallback((type: PageElement['type'], content: string) => {
    const newElement: PageElement = {
      id: Date.now().toString(),
      type,
      content,
      x: 50,
      y: 50,
      width: type === 'text' ? 400 : type === 'line' ? 200 : 100,
      height: type === 'text' ? 100 : type === 'line' ? 2 : 100,
      fontSize: 16,
      fontFamily: 'Georgia',
      color: '#000000',
      align: 'left',
    }
    setElements([...elements, newElement])
    setSelectedElementId(newElement.id)
  }, [elements])

  const updateElement = useCallback((id: string, updates: Partial<PageElement>) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ))
  }, [elements])

  const deleteElement = useCallback((id: string) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(null)
    }
  }, [elements, selectedElementId])

  const selectedElement = elements.find(el => el.id === selectedElementId) || null

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        {/* Left Panel - Asset Library */}
        <div className="w-64 flex-shrink-0">
          <AssetLibrary onAddElement={addElement} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto flex items-center justify-center">
          <div
            id="canvas"
            ref={drop}
            className="bg-white shadow-2xl relative"
            style={{
              width: pageWidth,
              height: pageHeight,
              minHeight: pageHeight,
            }}
            onClick={() => setSelectedElementId(null)}
          >
            {/* Page Guides */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-12 left-0 right-0 h-px bg-blue-200 opacity-30" />
              <div className="absolute bottom-12 left-0 right-0 h-px bg-blue-200 opacity-30" />
              <div className="absolute top-0 bottom-0 left-12 w-px bg-blue-200 opacity-30" />
              <div className="absolute top-0 bottom-0 right-12 w-px bg-blue-200 opacity-30" />
            </div>

            {/* Elements */}
            {elements.map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                onUpdate={updateElement}
                onDelete={deleteElement}
                isSelected={selectedElementId === element.id}
                onSelect={() => setSelectedElementId(element.id)}
              />
            ))}

            {isOver && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 flex-shrink-0">
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdate={updateElement}
          />
        </div>
      </div>
    </DndProvider>
  )
}
