'use client'

import { useBookStore } from '@/lib/store'
import { Plus, GripVertical, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'

export default function ChapterPanel() {
  const {
    currentProject,
    activeChapterId,
    addChapter,
    deleteChapter,
    setActiveChapter,
  } = useBookStore()

  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [showNewChapter, setShowNewChapter] = useState(false)

  if (!currentProject) {
    return null
  }

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      addChapter({ title: newChapterTitle })
      setNewChapterTitle('')
      setShowNewChapter(false)
    }
  }

  const handleDeleteChapter = (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      deleteChapter(chapterId)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Chapters</h3>
        <button
          onClick={() => setShowNewChapter(true)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Add Chapter"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {currentProject.chapters
          .sort((a, b) => a.order - b.order)
          .map((chapter, index) => (
            <div
              key={chapter.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                activeChapterId === chapter.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveChapter(chapter.id)}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {index + 1}. {chapter.title}
                </div>
                <div className="text-xs text-gray-500">
                  {chapter.content.length > 0
                    ? `${chapter.content.length} characters`
                    : 'Empty'}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChapter(chapter.id)
                }}
                className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600"
                title="Delete Chapter"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
      </div>

      {showNewChapter && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChapter()
              if (e.key === 'Escape') {
                setShowNewChapter(false)
                setNewChapterTitle('')
              }
            }}
            placeholder="Chapter title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddChapter}
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowNewChapter(false)
                setNewChapterTitle('')
              }}
              className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
