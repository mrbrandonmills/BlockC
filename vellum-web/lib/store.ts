import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SectionType =
  | 'title-page'
  | 'copyright'
  | 'dedication'
  | 'epigraph'
  | 'foreword'
  | 'preface'
  | 'prologue'
  | 'chapter'
  | 'epilogue'
  | 'afterword'
  | 'acknowledgments'
  | 'about-author'
  | 'also-by'
  | 'image'

export interface StyleTemplate {
  id: string
  name: string
  description: string
  preview: string
  typstTemplate?: string
  customColors?: {
    bg?: string
    text?: string
    accent1?: string
    accent2?: string
  }
  customFonts?: {
    body?: string
    heading?: string
  }
}

export interface Chapter {
  id: string
  title: string
  content: string
  order: number
  sectionType?: SectionType
  numbered?: boolean
  chapterNumber?: number
  subtitle?: string
  imageUrl?: string
}

export interface Project {
  id: string
  name: string
  title: string
  subtitle?: string
  author: string
  authors: string[]
  isbn?: string
  publisher?: string
  chapters: Chapter[]
  selectedStyle: string
  customColors?: {
    bg?: string
    text?: string
    accent1?: string
    accent2?: string
  }
  customFonts?: {
    body?: string
    heading?: string
  }
  createdAt: number
  updatedAt: number
  versions?: ProjectVersion[]
}

export interface ProjectVersion {
  id: string
  timestamp: number
  chapters: Chapter[]
  note?: string
}

interface BookState {
  // Current project
  currentProject: Project | null

  // All saved projects
  projects: Project[]

  // Active chapter
  activeChapterId: string | null

  // Manuscript (legacy - for backward compatibility)
  content: string
  filename: string

  // Metadata
  title: string
  authors: string[]

  // Style & customization
  selectedStyle: string
  customColors: {
    bg?: string
    text?: string
    accent1?: string
    accent2?: string
  }
  customFonts: {
    body?: string
    heading?: string
  }

  // View mode
  viewMode: 'edit' | 'preview'
  previewType: 'print' | 'ebook'

  // Project actions
  createProject: (name: string, chapters?: Partial<Chapter>[]) => void
  loadProject: (projectId: string) => void
  saveProject: () => void
  saveCurrentProject: () => void
  deleteProject: (projectId: string) => void
  updateProjectMetadata: (title: string, authors: string[]) => void
  updateProjectISBN: (isbn: string) => void
  createVersion: (note?: string) => void
  revertToVersion: (versionId: string) => void

  // Chapter actions
  addChapter: (data: Partial<Chapter> & { title: string }) => void
  updateChapter: (chapterId: string, content: string) => void
  updateChapterTitle: (chapterId: string, title: string) => void
  updateChapterMetadata: (chapterId: string, updates: Partial<Chapter>) => void
  convertChapterType: (chapterId: string, sectionType: SectionType) => void
  toggleChapterNumbering: (chapterId: string) => void
  deleteChapter: (chapterId: string) => void
  reorderChapter: (chapterId: string, newOrder: number) => void
  reorderChapters: (chapters: Chapter[]) => void
  setActiveChapter: (chapterId: string) => void

  // Legacy actions
  setContent: (content: string) => void
  setFilename: (filename: string) => void
  setTitle: (title: string) => void
  setAuthors: (authors: string[]) => void
  setSelectedStyle: (styleId: string) => void
  setViewMode: (mode: 'edit' | 'preview') => void
  setPreviewType: (type: 'print' | 'ebook') => void

  // Customization actions
  setCustomColors: (colors: { bg?: string; text?: string; accent1?: string; accent2?: string }) => void
  setCustomFonts: (fonts: { body?: string; heading?: string }) => void
}

export const styles: StyleTemplate[] = [
  {
    id: 'luxury-lab',
    name: 'Luxury Laboratory',
    description: 'Modern scientific aesthetic with geometric designs',
    preview: 'Cream background, slate headings, cyan accents',
  },
  {
    id: 'serif-classic',
    name: 'Serif Classic',
    description: 'Traditional book design with drop caps',
    preview: 'Elegant serif fonts, ornamental details',
  },
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    description: 'Clean contemporary design',
    preview: 'Sans-serif fonts, minimal styling',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Ultra-clean minimal design',
    preview: 'White background, black text, subtle accents',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Professional academic style',
    preview: 'Traditional margins, footnote support, citations',
  },
]

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProject: null,
      projects: [],
      activeChapterId: null,
      content: '',
      filename: '',
      title: 'Block C: The Laboratory of Living',
      authors: ['Brandon Mills', 'Claude'],
      selectedStyle: 'luxury-lab',
      customColors: {},
      customFonts: {},
      viewMode: 'edit',
      previewType: 'print',

      // Project actions
      createProject: (name: string, initialChapters?: Partial<Chapter>[]) => {
        const chapters: Chapter[] = initialChapters
          ? initialChapters.map((ch, idx) => ({
              id: generateId(),
              title: ch.title || 'Untitled',
              content: ch.content || '',
              order: ch.order ?? idx,
              sectionType: ch.sectionType || 'chapter',
              numbered: ch.numbered ?? true,
              chapterNumber: ch.chapterNumber,
              subtitle: ch.subtitle,
              imageUrl: ch.imageUrl,
            }))
          : [
              {
                id: generateId(),
                title: 'Title Page',
                content: '',
                order: 0,
                sectionType: 'title-page',
              },
              {
                id: generateId(),
                title: 'Chapter 1',
                content: '',
                order: 1,
                sectionType: 'chapter',
                numbered: true,
                chapterNumber: 1,
              },
            ]

        const project: Project = {
          id: generateId(),
          name,
          title: name,
          author: get().authors[0] || '',
          authors: get().authors,
          chapters,
          selectedStyle: get().selectedStyle,
          customColors: get().customColors,
          customFonts: get().customFonts,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          versions: [],
        }

        set((state) => ({
          projects: [...state.projects, project],
          currentProject: project,
          activeChapterId: project.chapters[0].id,
          title: project.title,
          authors: project.authors,
        }))
      },

      saveProject: () => {
        get().saveCurrentProject()
      },

      loadProject: (projectId: string) => {
        const project = get().projects.find((p) => p.id === projectId)
        if (project) {
          set({
            currentProject: project,
            activeChapterId: project.chapters[0]?.id || null,
            title: project.title,
            authors: project.authors,
            selectedStyle: project.selectedStyle,
            customColors: project.customColors || {},
            customFonts: project.customFonts || {},
          })
        }
      },

      saveCurrentProject: () => {
        const { currentProject } = get()
        if (currentProject) {
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === currentProject.id
                ? { ...currentProject, updatedAt: Date.now() }
                : p
            ),
            currentProject: { ...currentProject, updatedAt: Date.now() },
          }))
        }
      },

      deleteProject: (projectId: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProject:
            state.currentProject?.id === projectId ? null : state.currentProject,
        }))
      },

      updateProjectMetadata: (title: string, authors: string[]) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = { ...currentProject, title, authors }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            title,
            authors,
          }))
        } else {
          set({ title, authors })
        }
      },

      updateProjectISBN: (isbn: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = { ...currentProject, isbn }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
          }))
        }
      },

      createVersion: (note?: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const version: ProjectVersion = {
            id: generateId(),
            timestamp: Date.now(),
            chapters: currentProject.chapters,
            note,
          }
          const updated = {
            ...currentProject,
            versions: [...(currentProject.versions || []), version],
          }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
          }))
        }
      },

      revertToVersion: (versionId: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const version = currentProject.versions?.find((v) => v.id === versionId)
          if (version) {
            const updated = {
              ...currentProject,
              chapters: version.chapters,
            }
            set((state) => ({
              currentProject: updated,
              projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            }))
          }
        }
      },

      // Chapter actions
      addChapter: (data: Partial<Chapter> & { title: string }) => {
        const { currentProject } = get()
        if (currentProject) {
          const newChapter: Chapter = {
            id: generateId(),
            title: data.title,
            content: data.content || '',
            order: data.order ?? currentProject.chapters.length,
            sectionType: data.sectionType || 'chapter',
            numbered: data.numbered ?? (data.sectionType === 'chapter'),
            chapterNumber: data.chapterNumber,
            subtitle: data.subtitle,
            imageUrl: data.imageUrl,
          }

          const updated = {
            ...currentProject,
            chapters: [...currentProject.chapters, newChapter],
          }

          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            activeChapterId: newChapter.id,
          }))
        }
      },

      updateChapterTitle: (chapterId: string, title: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = {
            ...currentProject,
            chapters: currentProject.chapters.map((ch) =>
              ch.id === chapterId ? { ...ch, title } : ch
            ),
          }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
          }))
        }
      },

      updateChapterMetadata: (chapterId: string, updates: Partial<Chapter>) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = {
            ...currentProject,
            chapters: currentProject.chapters.map((ch) =>
              ch.id === chapterId ? { ...ch, ...updates } : ch
            ),
          }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
          }))
        }
      },

      convertChapterType: (chapterId: string, sectionType: SectionType) => {
        get().updateChapterMetadata(chapterId, { sectionType })
      },

      toggleChapterNumbering: (chapterId: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const chapter = currentProject.chapters.find((ch) => ch.id === chapterId)
          if (chapter) {
            get().updateChapterMetadata(chapterId, { numbered: !chapter.numbered })
          }
        }
      },

      reorderChapter: (chapterId: string, newOrder: number) => {
        const { currentProject } = get()
        if (currentProject) {
          const chapters = [...currentProject.chapters]
          const chapterIndex = chapters.findIndex((ch) => ch.id === chapterId)
          if (chapterIndex !== -1) {
            const [chapter] = chapters.splice(chapterIndex, 1)
            chapters.splice(newOrder, 0, chapter)
            chapters.forEach((ch, idx) => {
              ch.order = idx
            })
            get().reorderChapters(chapters)
          }
        }
      },

      updateChapter: (chapterId: string, content: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = {
            ...currentProject,
            chapters: currentProject.chapters.map((ch) =>
              ch.id === chapterId ? { ...ch, content } : ch
            ),
          }

          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
          }))
        } else {
          // Legacy mode - update content directly
          set({ content })
        }
      },

      deleteChapter: (chapterId: string) => {
        const { currentProject, activeChapterId } = get()
        if (currentProject) {
          const chapters = currentProject.chapters.filter((ch) => ch.id !== chapterId)
          const updated = { ...currentProject, chapters }

          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            activeChapterId:
              activeChapterId === chapterId
                ? chapters[0]?.id || null
                : activeChapterId,
          }))
        }
      },

      reorderChapters: (chapters: Chapter[]) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = { ...currentProject, chapters }

          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
          }))
        }
      },

      setActiveChapter: (chapterId: string) => {
        set({ activeChapterId: chapterId })
      },

      // Legacy actions
      setContent: (content) => {
        const { currentProject, activeChapterId } = get()
        if (currentProject && activeChapterId) {
          get().updateChapter(activeChapterId, content)
        } else {
          set({ content })
        }
      },

      setFilename: (filename) => set({ filename }),
      setTitle: (title) => {
        const { currentProject } = get()
        if (currentProject) {
          get().updateProjectMetadata(title, get().authors)
        } else {
          set({ title })
        }
      },
      setAuthors: (authors) => {
        const { currentProject } = get()
        if (currentProject) {
          get().updateProjectMetadata(get().title, authors)
        } else {
          set({ authors })
        }
      },
      setSelectedStyle: (styleId) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = { ...currentProject, selectedStyle: styleId }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            selectedStyle: styleId,
          }))
        } else {
          set({ selectedStyle: styleId })
        }
      },
      setViewMode: (mode) => set({ viewMode: mode }),
      setPreviewType: (type) => set({ previewType: type }),

      // Customization actions
      setCustomColors: (colors) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = {
            ...currentProject,
            customColors: { ...currentProject.customColors, ...colors },
          }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            customColors: { ...state.customColors, ...colors },
          }))
        } else {
          set((state) => ({
            customColors: { ...state.customColors, ...colors },
          }))
        }
      },

      setCustomFonts: (fonts) => {
        const { currentProject } = get()
        if (currentProject) {
          const updated = {
            ...currentProject,
            customFonts: { ...currentProject.customFonts, ...fonts },
          }
          set((state) => ({
            currentProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
            customFonts: { ...state.customFonts, ...fonts },
          }))
        } else {
          set((state) => ({
            customFonts: { ...state.customFonts, ...fonts },
          }))
        }
      },
    }),
    {
      name: 'vellum-storage',
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
)
