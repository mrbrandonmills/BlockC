// SERIF CLASSIC STYLE - Traditional book layout with drop caps
// Inspired by Vellum's Serif templates

#let style = (
  name: "Serif Classic",

  colors: (
    bg: rgb("#FFFEF7"),        // Warm white
    text: rgb("#2B2B2B"),      // Charcoal
    accent1: rgb("#8B7355"),   // Warm brown
    accent2: rgb("#D4AF37"),   // Gold
    accent3: rgb("#6B4423"),   // Dark brown
    muted: rgb("#999999"),     // Gray
  ),

  fonts: (
    body: "Crimson Text",
    heading: "Crimson Text",
    accent: "Crimson Text",
  ),

  sizes: (
    body: 12pt,
    h1: 32pt,
    h2: 20pt,
    h3: 16pt,
  ),

  page: (
    width: 6.25in,
    height: 9.25in,
    bleed: 0.125in,
    margin: (top: 0.85in, bottom: 0.85in, inside: 0.85in, outside: 0.7in),
  ),
)

// Page setup
#set page(
  width: style.page.width,
  height: style.page.height,
  margin: style.page.margin,
  fill: style.colors.bg,

  header: context {
    let page-num = counter(page).get().first()
    if page-num > 3 [
      #set text(9pt, fill: style.colors.muted, font: style.fonts.body, style: "italic")
      #align(if calc.even(page-num) { left } else { right })[
        Block C: The Laboratory of Living
      ]
      #v(-6pt)
      #line(length: 100%, stroke: 0.5pt + style.colors.muted.lighten(40%))
    ]
  },

  footer: context {
    let page-num = counter(page).get().first()
    if page-num > 1 [
      #line(length: 100%, stroke: 0.5pt + style.colors.muted.lighten(40%))
      #v(-4pt)
      #set text(11pt, fill: style.colors.text, font: style.fonts.body)
      #align(center)[#page-num]
    ]
  }
)

// Typography
#set text(
  font: style.fonts.body,
  size: style.sizes.body,
  fill: style.colors.text,
  lang: "en",
  hyphenate: false
)

#set par(
  justify: true,
  leading: 0.85em,
  first-line-indent: 1.5em,
  spacing: 0.65em
)

#show heading: it => {
  it
  par(first-line-indent: 0em)[#box()]
}

// DROP CAP - First paragraph after chapter heading
#let drop-cap(content) = {
  show par: it => {
    let first-letter = it.body.text.at(0)
    let rest = it.body.text.slice(1)

    grid(
      columns: (auto, 1fr),
      column-gutter: 0.15em,

      // Large decorative first letter
      text(
        size: 52pt,
        weight: "bold",
        fill: style.colors.accent2,
        font: style.fonts.heading,
        first-letter
      ),

      // Rest of paragraph
      align(horizon)[#rest]
    )
  }

  content
}

// ORNAMENT - Decorative separator
#let ornament() = {
  align(center)[
    #v(0.3in)
    #text(size: 18pt, fill: style.colors.accent2)[❧]
    #v(0.3in)
  ]
}

// Chapter headings
#show heading.where(level: 1): it => {
  pagebreak()

  v(1.2in)

  align(center)[
    // Ornamental top border
    #box(width: 3in)[
      #line(length: 1.3in, stroke: 1pt + style.colors.accent1)
      #h(0.4in)
      #text(size: 14pt, fill: style.colors.accent2)[✦]
      #h(0.4in)
      #line(length: 1.3in, stroke: 1pt + style.colors.accent1)
    ]

    #v(0.5in)

    #text(
      size: style.sizes.h1,
      weight: "bold",
      fill: style.colors.text,
      font: style.fonts.heading,
      tracking: 1.5pt,
      smallcaps(it.body)
    )

    #v(0.4in)

    // Ornamental bottom border
    #box(width: 2.5in)[
      #line(length: 2.5in, stroke: 0.5pt + style.colors.accent1)
    ]
  ]

  v(0.8in)
}

// Section headings
#show heading.where(level: 2): it => {
  v(0.5in)

  align(left)[
    #text(
      size: style.sizes.h2,
      weight: "bold",
      fill: style.colors.accent1,
      font: style.fonts.heading,
      tracking: 0.8pt,
      it.body
    )
  ]

  v(0.25in)
  par(first-line-indent: 0em)[#box()]
}

// Subsection headings
#show heading.where(level: 3): it => {
  v(0.4in)

  text(
    size: style.sizes.h3,
    weight: "semibold",
    fill: style.colors.text,
    style: "italic",
    it.body
  )

  v(0.2in)
  par(first-line-indent: 0em)[#box()]
}

// Pull quote with ornaments
#let pull-quote(content) = {
  v(0.5in)
  align(center)[
    #text(size: 16pt, fill: style.colors.accent2)[❝]
    #v(0.2in)
    #block(
      width: 80%,
      {
        set text(size: 13pt, style: "italic", fill: style.colors.accent1, weight: "medium")
        set par(first-line-indent: 0em, leading: 0.8em)
        align(center)[#content]
      }
    )
    #v(0.2in)
    #text(size: 16pt, fill: style.colors.accent2)[❞]
  ]
  v(0.5in)
}

#style
