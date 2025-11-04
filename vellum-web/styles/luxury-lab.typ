// LUXURY LABORATORY STYLE - Full Professional Template
// Vellum-like automated book formatting system

// ============================================================================
// STYLE CONFIGURATION
// ============================================================================
#let style = (
  name: "Luxury Laboratory",

  // Color Palette
  colors: (
    bg: rgb("#E8E4DC"),        // Cream background
    text: rgb("#1A1A1A"),      // Rich black
    accent1: rgb("#2F4F4F"),   // Deep slate
    accent2: rgb("#00CED1"),   // Bright cyan
    accent3: rgb("#FFB347"),   // Warm amber
    muted: rgb("#8B8B8B"),     // Soft gray
  ),

  // Typography
  fonts: (
    body: "Georgia",
    heading: "Georgia",
    accent: "Georgia",
  ),

  // Sizes
  sizes: (
    body: 11.5pt,
    h1: 28pt,
    h2: 18pt,
    h3: 14pt,
  ),

  // Page setup (6x9 with bleed)
  page: (
    width: 6.25in,   // 6" + 0.125" bleed on each side
    height: 9.25in,  // 9" + 0.125" bleed on each side
    bleed: 0.125in,
    margin: (
      top: 0.85in,
      bottom: 0.85in,
      inside: 0.85in,
      outside: 0.7in,
    ),
  ),
)

// ============================================================================
// PAGE SETUP WITH FULL BLEED
// ============================================================================
#set page(
  width: style.page.width,
  height: style.page.height,
  margin: style.page.margin,
  fill: style.colors.bg,

  // Full-bleed background
  background: {
    // Subtle gradient background
    place(
      top + left,
      rect(
        width: 100%,
        height: 100%,
        fill: gradient.linear(
          (style.colors.bg, 0%),
          (style.colors.accent1.lighten(90%), 100%),
          angle: 45deg
        )
      )
    )
  },

  header: context {
    let page-num = counter(page).get().first()
    if page-num > 3 [
      #set text(8.5pt, fill: style.colors.muted, font: style.fonts.body, style: "italic")
      #grid(
        columns: (1fr, auto, 1fr),
        align: (left, center, right),
        [Block C], [•], [The Laboratory of Living]
      )
      #v(-6pt)
      #line(length: 100%, stroke: 0.3pt + style.colors.muted.lighten(30%))
    ]
  },

  footer: context {
    let page-num = counter(page).get().first()
    if page-num > 1 [
      #line(length: 100%, stroke: 0.3pt + style.colors.muted.lighten(30%))
      #v(-4pt)
      #set text(10pt, fill: style.colors.text, font: style.fonts.body)
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
  leading: 0.8em,
  first-line-indent: 1.5em,
  spacing: 0.65em
)

#show heading: it => {
  it
  par(first-line-indent: 0em)[#box()]
}

// ============================================================================
// GEOMETRIC HELPERS
// ============================================================================
#let corner-accent(size: 20pt, color: style.colors.accent1) = {
  place(top + left, dx: -10pt, dy: -10pt, {
    line(start: (0pt, 0pt), end: (size, 0pt), stroke: 0.5pt + color)
    line(start: (0pt, 0pt), end: (0pt, size), stroke: 0.5pt + color)
    place(dx: size - 2pt, dy: -2pt, circle(radius: 1pt, fill: color))
    place(dx: -2pt, dy: size - 2pt, circle(radius: 1pt, fill: color))
  })
}

// ============================================================================
// CHAPTER HEADING WITH FULL-PAGE BACKGROUND
// ============================================================================
#show heading.where(level: 1): it => {
  pagebreak()

  // Full-page chapter opening with background
  place(
    top + left,
    dx: -style.page.margin.inside,
    dy: -style.page.margin.top,
    rect(
      width: style.page.width,
      height: 2.5in,
      fill: gradient.linear(
        style.colors.accent2.lighten(95%),
        style.colors.bg,
        angle: 90deg
      )
    )
  )

  v(0.8in)

  block(width: 100%, {
    align(center)[
      // Top geometric design
      #box(width: 3.5in, height: 50pt)[
        #place(center + horizon, {
          line(start: (-70pt, -20pt), end: (-70pt, 20pt), stroke: 1.2pt + style.colors.accent1)
          line(start: (-70pt, -20pt), end: (-60pt, -20pt), stroke: 1.2pt + style.colors.accent1)
          line(start: (-70pt, 20pt), end: (-60pt, 20pt), stroke: 1.2pt + style.colors.accent1)

          line(start: (70pt, -20pt), end: (70pt, 20pt), stroke: 1.2pt + style.colors.accent1)
          line(start: (70pt, -20pt), end: (60pt, -20pt), stroke: 1.2pt + style.colors.accent1)
          line(start: (70pt, 20pt), end: (60pt, 20pt), stroke: 1.2pt + style.colors.accent1)

          polygon(
            fill: style.colors.accent2,
            stroke: 0.8pt + style.colors.accent1,
            (0pt, -10pt), (10pt, 0pt), (0pt, 10pt), (-10pt, 0pt)
          )

          for i in range(8) {
            let angle = i * 45deg
            let x = 22pt * calc.cos(angle)
            let y = 22pt * calc.sin(angle)
            place(dx: x, dy: y, circle(radius: 1.5pt, fill: style.colors.accent3))
          }
        })
      ]

      #v(0.4in)

      #text(
        size: style.sizes.h1,
        weight: "bold",
        fill: style.colors.text,
        font: style.fonts.heading,
        tracking: 1pt,
        upper(it.body)
      )

      #v(0.3in)

      #box(width: 2.2in)[
        #place(center,
          line(length: 2.2in, stroke: 2pt + gradient.linear(
            style.colors.accent2,
            style.colors.accent1,
            style.colors.accent2
          ))
        )
      ]
    ]
  })

  v(0.6in)
}

// Section headings
#show heading.where(level: 2): it => {
  v(0.45in)

  block(width: 100%, {
    grid(
      columns: (auto, 1fr),
      column-gutter: 18pt,

      box(width: 10pt, height: 50pt)[
        #place(top + left, {
          line(start: (5pt, 0pt), end: (5pt, 45pt), stroke: 2.5pt + style.colors.accent1)
          line(start: (5pt, 0pt), end: (0pt, 0pt), stroke: 1pt + style.colors.accent2)
          line(start: (5pt, 45pt), end: (0pt, 45pt), stroke: 1pt + style.colors.accent2)
        })
      ],

      align(left + horizon)[
        #text(
          size: style.sizes.h2,
          weight: "bold",
          fill: style.colors.accent1,
          font: style.fonts.heading,
          tracking: 0.5pt,
          it.body
        )
      ]
    )
  })

  v(0.28in)
  par(first-line-indent: 0em)[#box()]
}

// Subheadings
#show heading.where(level: 3): it => {
  v(0.35in)

  stack(
    dir: ttb,
    spacing: 10pt,
    text(
      size: style.sizes.h3,
      weight: "bold",
      fill: style.colors.text,
      tracking: 0.3pt,
      it.body
    ),
    line(length: 1.3in, stroke: 1.2pt + style.colors.accent2.lighten(15%))
  )

  v(0.22in)
  par(first-line-indent: 0em)[#box()]
}

// ============================================================================
// SPECIAL ELEMENTS
// ============================================================================
#let pull-quote(content) = {
  v(0.4in)
  block(
    width: 100%,
    inset: (left: 0.65in, right: 0.65in, top: 0.3in, bottom: 0.3in),
    fill: style.colors.accent2.lighten(92%),
    stroke: (
      left: 4pt + style.colors.accent2,
      top: 0.8pt + style.colors.accent2.lighten(40%),
      bottom: 0.8pt + style.colors.accent2.lighten(40%)
    ),
    {
      corner-accent(size: 18pt, color: style.colors.accent2)
      set text(size: 13.5pt, style: "italic", fill: style.colors.accent1, weight: "semibold")
      set par(first-line-indent: 0em, leading: 0.75em, hyphenate: false)
      content
    }
  )
  v(0.4in)
}

// Export style configuration
#style
