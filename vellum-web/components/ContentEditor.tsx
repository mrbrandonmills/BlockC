'use client'

import { useBookStore } from '@/lib/store'
import { Edit3, Type } from 'lucide-react'
import Editor from '@/components/Editor'

export default function ContentEditor() {
  const { currentProject, activeChapterId, updateChapter, updateChapterTitle } = useBookStore()

  if (!currentProject || !activeChapterId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <Edit3 className="w-16 h-16 mx-auto mb-4" />
          <p>Select a section to start editing</p>
        </div>
      </div>
    )
  }

  const chapter = currentProject.chapters.find((ch) => ch.id === activeChapterId)

  if (!chapter) return null

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateChapterTitle(activeChapterId, e.target.value)
  }

  const handleContentChange = (content: string) => {
    updateChapter(activeChapterId, content)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Chapter Title Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
          <Type className="w-4 h-4" />
          {chapter.sectionType === 'chapter' ? 'Chapter Title' : 'Section Title'}
        </label>
        <input
          type="text"
          value={chapter.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Enter title..."
        />

        {chapter.numbered && chapter.sectionType === 'chapter' && (
          <p className="text-sm text-gray-500 mt-2">
            This will appear as: Chapter {chapter.chapterNumber || currentProject.chapters.filter(ch => ch.sectionType === 'chapter').findIndex(ch => ch.id === chapter.id) + 1}
          </p>
        )}
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 min-h-[600px]">
        <Editor
          content={chapter.content}
          onChange={handleContentChange}
        />
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
        <div>
          Section type: <span className="font-medium">{chapter.sectionType}</span>
        </div>
        <div>
          Order: <span className="font-medium">#{chapter.order + 1}</span>
        </div>
      </div>
    </div>
  )
}
