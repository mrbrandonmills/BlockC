import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink, mkdir } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, title, authors, contentType } = body

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    // Create temporary directory
    const tmpDir = join(process.cwd(), 'tmp')
    await mkdir(tmpDir, { recursive: true })

    const timestamp = Date.now()
    const htmlFile = join(tmpDir, `book-${timestamp}.html`)
    const epubFile = join(tmpDir, `book-${timestamp}.epub`)

    // Create HTML document
    const authorsFormatted = authors && authors.length > 0
      ? authors.join(', ')
      : 'Unknown Author'

    const htmlContent = contentType === 'html'
      ? content
      : `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Untitled Book'}</title>
  <meta name="author" content="${authorsFormatted}">
  <style>
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      max-width: 40em;
      margin: 0 auto;
      padding: 2em;
    }
    h1, h2, h3 {
      font-family: Georgia, serif;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.2em; }
    p {
      margin-bottom: 1em;
      text-align: justify;
    }
  </style>
</head>
<body>
  <h1>${title || 'Untitled Book'}</h1>
  <p><em>by ${authorsFormatted}</em></p>
  <hr>
  ${htmlContent}
</body>
</html>`

    // Write HTML file
    await writeFile(htmlFile, htmlDocument, 'utf-8')

    // Convert to EPUB using Pandoc
    try {
      const pandocCmd = `pandoc "${htmlFile}" -o "${epubFile}" --metadata title="${title || 'Untitled Book'}" --metadata author="${authorsFormatted}"`
      await execAsync(pandocCmd)
    } catch (error: any) {
      console.error('Pandoc conversion error:', error)

      // Clean up
      try {
        await unlink(htmlFile)
      } catch {}

      return NextResponse.json(
        {
          error: 'EPUB conversion failed. Make sure Pandoc is installed.',
          details: error.stderr || error.message,
        },
        { status: 500 }
      )
    }

    // Read the generated EPUB
    const epubBuffer = await readFile(epubFile)

    // Clean up temporary files
    try {
      await unlink(htmlFile)
      await unlink(epubFile)
    } catch (error) {
      console.error('Error cleaning up temporary files:', error)
    }

    // Return the EPUB
    return new NextResponse(epubBuffer, {
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': `attachment; filename="${title?.replace(/[^a-z0-9]/gi, '-') || 'book'}.epub"`,
      },
    })
  } catch (error: any) {
    console.error('Error generating EPUB:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
