import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink, mkdir } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { htmlToTypst, textToTypst } from '@/lib/html-to-typst'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, title, authors, style, contentType } = body

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    // Convert content to Typst format
    const typstContent = contentType === 'html'
      ? htmlToTypst(content)
      : textToTypst(content)

    // Create temporary directory for compilation
    const tmpDir = join(process.cwd(), 'tmp')
    await mkdir(tmpDir, { recursive: true })

    const timestamp = Date.now()
    const bookFile = join(tmpDir, `book-${timestamp}.typ`)
    const pdfFile = join(tmpDir, `book-${timestamp}.pdf`)

    // Get the style template path
    const styleFile = join(process.cwd(), 'styles', `${style}.typ`)

    // Read the style template
    let styleTemplate = ''
    try {
      styleTemplate = await readFile(styleFile, 'utf-8')
    } catch (error) {
      console.error('Error reading style template:', error)
      return NextResponse.json(
        { error: `Style template '${style}' not found` },
        { status: 400 }
      )
    }

    // Create the complete Typst document
    const authorsFormatted = authors && authors.length > 0
      ? authors.join(' & ')
      : 'Unknown Author'

    const typstDocument = `${styleTemplate}

// ============================================================================
// TITLE PAGE
// ============================================================================
#pagebreak()

#align(center + horizon)[
  #v(1.5in)

  #text(size: 32pt, weight: "bold", fill: style.colors.text, tracking: 1.5pt)[
    ${title || 'Untitled Book'}
  ]

  #v(0.4in)

  #text(size: 16pt, weight: "regular", fill: style.colors.accent1)[
    by
  ]

  #v(0.25in)

  #text(size: 18pt, weight: "semibold", fill: style.colors.text)[
    ${authorsFormatted}
  ]
]

#pagebreak()

// ============================================================================
// CONTENT
// ============================================================================
${typstContent}
`

    // Write the Typst file
    await writeFile(bookFile, typstDocument, 'utf-8')

    // Compile with Typst
    try {
      await execAsync(`typst compile "${bookFile}" "${pdfFile}"`)
    } catch (error: any) {
      console.error('Typst compilation error:', error)

      // Clean up
      try {
        await unlink(bookFile)
      } catch {}

      return NextResponse.json(
        {
          error: 'PDF compilation failed',
          details: error.stderr || error.message,
        },
        { status: 500 }
      )
    }

    // Read the generated PDF
    const pdfBuffer = await readFile(pdfFile)

    // Clean up temporary files
    try {
      await unlink(bookFile)
      await unlink(pdfFile)
    } catch (error) {
      console.error('Error cleaning up temporary files:', error)
    }

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title?.replace(/[^a-z0-9]/gi, '-') || 'book'}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
