// MINIMALIST STYLE - Ultra-Clean Book Template
// Vellum-like automated book formatting system

// ============================================================================
// STYLE CONFIGURATION
// ============================================================================
#let style = (
  name: "Minimalist",

  // Color Palette
  colors: (
    bg: rgb("#FFFFFF"),        // Pure white
    text: rgb("#000000"),      // Pure black
    accent1: rgb("#333333"),   // Dark gray
    accent2: rgb("#666666"),   // Medium gray
    accent3: rgb("#999999"),   // Light gray
    muted: rgb("#CCCCCC"),     // Very light gray
  ),

  // Typography
  fonts: (
    body: "Helvetica",
    heading: "Helvetica",
    accent: "Helvetica",
  ),

  // Sizes
  sizes: (
    body: 11pt,
    h1: 24pt,
    h2: 16pt,
    h3: 13pt,
  ),

  // Page setup (6x9 standard)
  page: (
    width: 6in,
    height: 9in,
    margin: (
      top: 0.75in,
      bottom: 0.75in,
      inside: 0.75in,
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
      #set text(9pt, fill: style.colors.muted, font: style.fonts.body)
      #grid(
        columns: (1fr, 1fr),
        align: (left, right),
        [Block C], [The Laboratory of Living]
      )
      #v(-4pt)
      #line(length: 100%, stroke: 0.5pt + style.colors.muted)
    ]
  },

  footer: context {
    let page-num = counter(page).get().first()
    if page-num > 1 [
      #line(length: 100%, stroke: 0.5pt + style.colors.muted)
      #v(-3pt)
      #set text(9pt, fill: style.colors.text, font: style.fonts.body)
      #align(center)[#page-num]
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
  hyphenate: false
)

#set par(
  justify: true,
  leading: 0.7em,
  first-line-indent: 1.2em,
  spacing: 0.6em
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

  v(1.2in)

  block(width: 100%, {
    align(center)[
      #line(length: 2in, stroke: 1pt + style.colors.text)

      #v(0.4in)

      #text(
        size: style.sizes.h1,
        weight: "bold",
        fill: style.colors.text,
        font: style.fonts.heading,
        upper(it.body)
      )

      #v(0.4in)

      #line(length: 2in, stroke: 1pt + style.colors.text)
    ]
  })

  v(0.8in)
}

// Section headings
#show heading.where(level: 2): it => {
  v(0.5in)

  block(width: 100%, {
    text(
      size: style.sizes.h2,
      weight: "bold",
      fill: style.colors.text,
      font: style.fonts.heading,
      it.body
    )
  })

  v(0.3in)
  par(first-line-indent: 0em)[#box()]
}

// Subheadings
#show heading.where(level: 3): it => {
  v(0.4in)

  text(
    size: style.sizes.h3,
    weight: "bold",
    fill: style.colors.accent1,
    it.body
  )

  v(0.2in)
  par(first-line-indent: 0em)[#box()]
}

// Export style configuration
#style
