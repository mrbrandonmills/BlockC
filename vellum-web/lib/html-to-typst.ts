/**
 * Convert HTML content to Typst format
 * This is a simplified converter for basic formatting
 */
export function htmlToTypst(html: string): string {
  let typst = html

  // Remove HTML comments
  typst = typst.replace(/<!--[\s\S]*?-->/g, '')

  // Convert headings
  typst = typst.replace(/<h1[^>]*>(.*?)<\/h1>/gi, (_, content) => {
    return `= ${cleanText(content)}\n\n`
  })

  typst = typst.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, content) => {
    return `== ${cleanText(content)}\n\n`
  })

  typst = typst.replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, content) => {
    return `=== ${cleanText(content)}\n\n`
  })

  // Convert paragraphs
  typst = typst.replace(/<p[^>]*>(.*?)<\/p>/gi, (_, content) => {
    const text = cleanText(content)
    if (text.trim()) {
      return `${text}\n\n`
    }
    return ''
  })

  // Convert line breaks
  typst = typst.replace(/<br\s*\/?>/gi, '\\\n')

  // Convert formatting
  typst = typst.replace(/<strong[^>]*>(.*?)<\/strong>/gi, (_, content) => `*${cleanText(content)}*`)
  typst = typst.replace(/<b[^>]*>(.*?)<\/b>/gi, (_, content) => `*${cleanText(content)}*`)
  typst = typst.replace(/<em[^>]*>(.*?)<\/em>/gi, (_, content) => `_${cleanText(content)}_`)
  typst = typst.replace(/<i[^>]*>(.*?)<\/i>/gi, (_, content) => `_${cleanText(content)}_`)
  typst = typst.replace(/<u[^>]*>(.*?)<\/u>/gi, (_, content) => `#underline[${cleanText(content)}]`)

  // Convert lists
  typst = typst.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return convertList(content, '-')
  })

  typst = typst.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    return convertList(content, '+')
  })

  // Remove remaining HTML tags
  typst = typst.replace(/<[^>]+>/g, '')

  // Decode HTML entities
  typst = decodeHtmlEntities(typst)

  // Clean up multiple blank lines
  typst = typst.replace(/\n{3,}/g, '\n\n')

  return typst.trim()
}

function convertList(listContent: string, marker: string): string {
  const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gi) || []
  return items
    .map(item => {
      const content = item.replace(/<\/?li[^>]*>/gi, '')
      return `${marker} ${cleanText(content)}`
    })
    .join('\n') + '\n\n'
}

function cleanText(text: string): string {
  // Remove HTML tags
  let clean = text.replace(/<[^>]+>/g, '')

  // Decode entities
  clean = decodeHtmlEntities(clean)

  // Trim whitespace
  clean = clean.trim()

  return clean
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  }

  let decoded = text
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }

  // Decode numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))

  return decoded
}

/**
 * Convert plain text to Typst format
 * Useful for TXT/MD files that don't have HTML markup
 */
export function textToTypst(text: string): string {
  let typst = text

  // Detect markdown-style headings
  typst = typst.replace(/^# (.+)$/gm, '= $1\n')
  typst = typst.replace(/^## (.+)$/gm, '== $1\n')
  typst = typst.replace(/^### (.+)$/gm, '=== $1\n')

  // Convert markdown bold/italic
  typst = typst.replace(/\*\*(.+?)\*\*/g, '*$1*')
  typst = typst.replace(/__(.+?)__/g, '*$1*')
  typst = typst.replace(/\*(.+?)\*/g, '_$1_')
  typst = typst.replace(/_(.+?)_/g, '_$1_')

  // Clean up multiple blank lines
  typst = typst.replace(/\n{3,}/g, '\n\n')

  return typst.trim()
}
