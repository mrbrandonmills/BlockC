'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import mammoth from 'mammoth'

interface FileUploadProps {
  onUpload: (content: string, filename: string) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      try {
        let content = ''

        if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          // Plain text or markdown
          content = await file.text()
        } else if (file.name.endsWith('.docx')) {
          // Convert DOCX to HTML using mammoth
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          content = result.value
        }

        onUpload(content, file.name)
      } catch (error) {
        console.error('Error reading file:', error)
        alert('Error reading file. Please try again.')
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-sm text-blue-600 font-medium">Drop your manuscript here...</p>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Drag & drop your manuscript, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports .txt, .md, and .docx files
          </p>
        </div>
      )}
    </div>
  )
}
