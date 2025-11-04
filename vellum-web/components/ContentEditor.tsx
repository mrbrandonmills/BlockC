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
          <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a section to start editing</p>
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
        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
          <Type className="w-4 h-4" />
          {chapter.sectionType === 'chapter' ? 'Chapter Title' : 'Section Title'}
        </label>
        <input
          type="text"
          value={chapter.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-3 text-2xl font-bold bg-slate-800/50 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-white placeholder-gray-500 backdrop-blur-sm"
          placeholder="Enter title..."
        />

        {chapter.numbered && chapter.sectionType === 'chapter' && (
          <p className="text-sm text-gray-400 mt-2">
            This will appear as: Chapter {chapter.chapterNumber || currentProject.chapters.filter(ch => ch.sectionType === 'chapter').findIndex(ch => ch.id === chapter.id) + 1}
          </p>
        )}
      </div>

      {/* Content Editor */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border-2 border-white/10 p-6 min-h-[600px]">
        <Editor
          content={chapter.content}
          onChange={handleContentChange}
        />
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-sm text-gray-400 flex items-center justify-between">
        <div>
          Section type: <span className="font-medium text-gray-300">{chapter.sectionType}</span>
        </div>
        <div>
          Order: <span className="font-medium text-gray-300">#{chapter.order + 1}</span>
        </div>
      </div>
    </div>
  )
}
