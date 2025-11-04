'use client'

import { useState } from 'react'
import { useBookStore } from '@/lib/store'
import WelcomeScreen from '@/components/WelcomeScreen'
import BookDesigner from '@/components/BookDesigner'

export default function Home() {
  const { currentProject } = useBookStore()
  const [hasImported, setHasImported] = useState(false)

  // Show welcome screen if no project and haven't imported
  if (!currentProject && !hasImported) {
    return <WelcomeScreen onImport={() => setHasImported(true)} />
  }

  // Show new book designer with live previews
  return <BookDesigner />
}
