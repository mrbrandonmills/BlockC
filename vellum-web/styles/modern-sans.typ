// MODERN SANS STYLE - Clean, contemporary design
// Perfect for non-fiction, business, self-help

#let style = (
  name: "Modern Sans",

  colors: (
    bg: rgb("#FFFFFF"),        // Pure white
    text: rgb("#1A1A1A"),      // Near black
    accent1: rgb("#0066CC"),   // Bright blue
    accent2: rgb("#00CC99"),   // Teal
    accent3: rgb("#FF6B35"),   // Coral
    muted: rgb("#666666"),     // Dark gray
  ),

  fonts: (
    body: "Helvetica Neue",
    heading: "Helvetica Neue",
    accent: "Helvetica Neue",
  ),

  sizes: (
    body: 11pt,
    h1: 36pt,
    h2: 22pt,
    h3: 16pt,
  ),

  page: (
    width: 6.25in,
    height: 9.25in,
    bleed: 0.125in,
    margin: (top: 0.75in, bottom: 0.75in, inside: 0.85in, outside: 0.7in),
  ),
)

// Page setup with minimal design
#set page(
  width: style.page.width,
  height: style.page.height,
  margin: style.page.margin,
  fill: style.colors.bg,

  header: context {
    let page-num = counter(page).get().first()
    if page-num > 3 [
      #set text(8pt, fill: style.colors.muted, font: style.fonts.body)
      #grid(
        columns: (1fr, 1fr),
        align: (left, right),
        [Block C],
        [The Laboratory of Living]
      )
      #v(-4pt)
      #line(length: 100%, stroke: 0.3pt + style.colors.accent1)
    ]
  },

  footer: context {
    let page-num = counter(page).get().first()
    if page-num > 1 [
      #line(length: 100%, stroke: 0.3pt + style.colors.accent1)
      #v(-4pt)
      #set text(10pt, fill: style.colors.text, font: style.fonts.body, weight: "medium")
      #align(center)[#page-num]
    ]
  }
)

// Clean, readable typography
#set text(
  font: style.fonts.body,
  size: style.sizes.body,
  fill: style.colors.text,
  lang: "en",
  hyphenate: false
)

#set par(
  justify: true,
  leading: 0.9em,
  first-line-indent: 0em,  // No indent for modern style
  spacing: 0.75em
)

// Chapter headings - bold and minimal
#show heading.where(level: 1): it => {
  pagebreak()

  v(1in)

  block(width: 100%)[
    // Accent bar
    #box(
      width: 0.3in,
      height: 0.15in,
      fill: style.colors.accent1
    )

    #v(0.4in)

    #text(
      size: style.sizes.h1,
      weight: "bold",
      fill: style.colors.text,
      font: style.fonts.heading,
      tracking: -0.5pt,
      upper(it.body)
    )

    #v(0.2in)

    // Thin line
    #line(length: 2.5in, stroke: 2pt + style.colors.accent2)
  ]

  v(0.7in)
}

// Section headings - clean with color accent
#show heading.where(level: 2): it => {
  v(0.5in)

  block(width: 100%)[
    #text(
      size: style.sizes.h2,
      weight: "bold",
      fill: style.colors.accent1,
      font: style.fonts.heading,
      tracking: 0pt,
      it.body
    )

    #v(0.1in)
    #line(length: 1in, stroke: 1.5pt + style.colors.accent2)
  ]

  v(0.3in)
}

// Subsection headings
#show heading.where(level: 3): it => {
  v(0.4in)

  text(
    size: style.sizes.h3,
    weight: "semibold",
    fill: style.colors.text,
    tracking: 0.3pt,
    it.body
  )

  v(0.2in)
}

// Modern pull quote with colored sidebar
#let pull-quote(content) = {
  v(0.5in)
  block(
    width: 100%,
    inset: (left: 0.5in, right: 0.5in, top: 0.3in, bottom: 0.3in),
    stroke: (left: 4pt + style.colors.accent1),
    {
      set text(size: 12pt, fill: style.colors.text, weight: "medium")
      set par(first-line-indent: 0em, leading: 0.85em)
      content
    }
  )
  v(0.5in)
}

// Key point callout
#let key-point(content) = {
  v(0.3in)
  block(
    width: 100%,
    fill: style.colors.accent1.lighten(95%),
    inset: 0.4in,
    radius: 4pt,
    {
      set text(size: 11.5pt, fill: style.colors.text)
      set par(first-line-indent: 0em)
      grid(
        columns: (auto, 1fr),
        column-gutter: 0.3in,
        text(size: 24pt, fill: style.colors.accent1)[■],
        align(horizon)[#content]
      )
    }
  )
  v(0.3in)
}

#style
