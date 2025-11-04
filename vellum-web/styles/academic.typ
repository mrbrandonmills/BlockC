// ACADEMIC STYLE - Professional Academic Book Template
// Vellum-like automated book formatting system

// ============================================================================
// STYLE CONFIGURATION
// ============================================================================
#let style = (
  name: "Academic",

  // Color Palette
  colors: (
    bg: rgb("#FAFAFA"),        // Off-white
    text: rgb("#1A1A1A"),      // Near-black
    accent1: rgb("#003366"),   // Academic blue
    accent2: rgb("#666666"),   // Gray
    accent3: rgb("#CC0000"),   // Citation red
    muted: rgb("#999999"),     // Muted gray
  ),

  // Typography
  fonts: (
    body: "Times New Roman",
    heading: "Times New Roman",
    accent: "Georgia",
  ),

  // Sizes
  sizes: (
    body: 12pt,
    h1: 22pt,
    h2: 16pt,
    h3: 14pt,
  ),

  // Page setup (6x9 academic standard)
  page: (
    width: 6in,
    height: 9in,
    margin: (
      top: 1in,
      bottom: 1in,
      inside: 1in,
      outside: 0.75in,
    ),
  ),
)

// ============================================================================
// PAGE SETUP
// ============================================================================
#set page(
  width: style.page.width,
  height: style.page.height,
  margin: style.page.margin,
  fill: style.colors.bg,

  header: context {
    let page-num = counter(page).get().first()
    if page-num > 3 [
      #set text(9pt, fill: style.colors.muted, font: style.fonts.body, style: "italic")
      #if calc.rem(page-num, 2) == 0 [
        // Even pages (left side)
        #align(left)[Block C: The Laboratory of Living]
      ] else [
        // Odd pages (right side)
        #align(right)[Chapter Title]
      ]
      #v(-4pt)
      #line(length: 100%, stroke: 0.5pt + style.colors.muted)
    ]
  },

  footer: context {
    let page-num = counter(page).get().first()
    if page-num > 1 [
      #line(length: 100%, stroke: 0.5pt + style.colors.muted)
      #v(-3pt)
      #set text(10pt, fill: style.colors.text, font: style.fonts.body)
      #if calc.rem(page-num, 2) == 0 [
        // Even pages (left side)
        #align(left)[#page-num]
      ] else [
        // Odd pages (right side)
        #align(right)[#page-num]
      ]
    ]
  }
)

// ============================================================================
// TYPOGRAPHY
// ============================================================================
#set text(
  font: style.fonts.body,
  size: style.sizes.body,
  fill: style.colors.text,
  lang: "en",
  hyphenate: true
)

#set par(
  justify: true,
  leading: 0.65em,
  first-line-indent: 0.5in,
  spacing: 0.65em
)

#show heading: it => {
  it
  par(first-line-indent: 0em)[#box()]
}

// ============================================================================
// CHAPTER HEADING
// ============================================================================
#show heading.where(level: 1): it => {
  pagebreak()

  v(1.5in)

  block(width: 100%, {
    // Chapter number (if extractable)
    align(center)[
      #text(
        size: 14pt,
        weight: "regular",
        fill: style.colors.accent1,
        font: style.fonts.heading,
        smallcaps[Chapter]
      )

      #v(0.3in)

      #text(
        size: style.sizes.h1,
        weight: "bold",
        fill: style.colors.text,
        font: style.fonts.heading,
        it.body
      )
    ]
  })

  v(1in)
  par(first-line-indent: 0em)[#box()]
}

// Section headings
#show heading.where(level: 2): it => {
  v(0.5in)

  block(width: 100%, {
    text(
      size: style.sizes.h2,
      weight: "bold",
      fill: style.colors.accent1,
      font: style.fonts.heading,
      it.body
    )
  })

  v(0.25in)
  par(first-line-indent: 0em)[#box()]
}

// Subheadings
#show heading.where(level: 3): it => {
  v(0.35in)

  text(
    size: style.sizes.h3,
    weight: "bold",
    fill: style.colors.text,
    font: style.fonts.heading,
    style: "italic",
    it.body
  )

  v(0.2in)
  par(first-line-indent: 0em)[#box()]
}

// ============================================================================
// ACADEMIC ELEMENTS
// ============================================================================
// Block quotes
#show quote: it => {
  v(0.3in)
  block(
    width: 100%,
    inset: (left: 0.5in, right: 0.5in),
    {
      set text(size: 11pt, style: "italic")
      set par(first-line-indent: 0em, justify: true)
      it.body
    }
  )
  v(0.3in)
}

// Export style configuration
#style
