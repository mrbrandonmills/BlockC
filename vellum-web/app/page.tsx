'use client'

import { useState } from 'react'
import { useBookStore } from '@/lib/store'
import WelcomeScreen from '@/components/WelcomeScreen'
import BookEditor from '@/components/BookEditor'

export default function Home() {
  const { currentProject } = useBookStore()
  const [hasImported, setHasImported] = useState(false)

  // Show welcome screen if no project and haven't imported
  if (!currentProject && !hasImported) {
    return <WelcomeScreen onImport={() => setHasImported(true)} />
  }

  // Show book editor once project exists or file imported
  return <BookEditor />
}
