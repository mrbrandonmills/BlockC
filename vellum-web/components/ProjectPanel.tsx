'use client'

import { useBookStore } from '@/lib/store'
import { FolderOpen, Plus, Trash2, Save } from 'lucide-react'
import { useState } from 'react'

export default function ProjectPanel() {
  const {
    currentProject,
    projects,
    createProject,
    loadProject,
    deleteProject,
    saveCurrentProject,
  } = useBookStore()

  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName)
      setNewProjectName('')
      setShowNewProject(false)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Projects
        </h3>
        <div className="flex gap-2">
          {currentProject && (
            <button
              onClick={saveCurrentProject}
              className="p-1 hover:bg-green-100 rounded text-green-600"
              title="Save Project"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowNewProject(true)}
            className="p-1 hover:bg-gray-100 rounded"
            title="New Project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {currentProject && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-900">
            {currentProject.name}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {currentProject.chapters.length} chapters •{' '}
            {new Date(currentProject.updatedAt).toLocaleDateString()}
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {projects.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No saved projects yet
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`flex items-center gap-2 p-2 rounded transition-colors ${
                currentProject?.id === project.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
              onClick={() => loadProject(project.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {project.name}
                </div>
                <div className="text-xs text-gray-500">
                  {project.chapters.length} chapters •{' '}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteProject(project.id)
                }}
                className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600"
                title="Delete Project"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {showNewProject && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateProject()
              if (e.key === 'Escape') {
                setShowNewProject(false)
                setNewProjectName('')
              }
            }}
            placeholder="Project name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateProject}
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewProject(false)
                setNewProjectName('')
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
