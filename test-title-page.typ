#let cream-bg = rgb("#E8E4DC")
#let rich-black = rgb("#1A1A1A")
#let deep-slate = rgb("#2F4F4F")
#let bright-cyan = rgb("#00CED1")
#let warm-amber = rgb("#FFB347")
#let soft-gray = rgb("#8B8B8B")

#set page(
  width: 6in,
  height: 9in,
  fill: cream-bg,
  margin: 1in
)

// TITLE PAGE TEST
#page(margin: 1in, header: none, footer: none, fill: cream-bg)[
  #v(0.6in)

  #align(center)[
    // Top geometric design
    #box(width: 4in, height: 70pt)[
      #place(center + horizon, {
        line(start: (-85pt, -25pt), end: (-85pt, 25pt), stroke: 1.2pt + deep-slate)
        line(start: (-85pt, -25pt), end: (-73pt, -25pt), stroke: 1.2pt + deep-slate)
        line(start: (-85pt, 25pt), end: (-73pt, 25pt), stroke: 1.2pt + deep-slate)

        line(start: (85pt, -25pt), end: (85pt, 25pt), stroke: 1.2pt + deep-slate)
        line(start: (85pt, -25pt), end: (73pt, -25pt), stroke: 1.2pt + deep-slate)
        line(start: (85pt, 25pt), end: (73pt, 25pt), stroke: 1.2pt + deep-slate)

        circle(radius: 7pt, stroke: 1.2pt + bright-cyan)
        circle(radius: 11pt, stroke: 0.6pt + deep-slate.lighten(35%))
        circle(radius: 16pt, stroke: 0.4pt + bright-cyan.lighten(45%))

        for i in range(8) {
          let angle = i * 45deg
          let x = 20pt * calc.cos(angle)
          let y = 20pt * calc.sin(angle)
          place(dx: x, dy: y, circle(radius: 1.5pt, fill: warm-amber))
        }
      })
    ]

    #v(0.35in)

    // Series marker
    #text(
      size: 11pt,
      weight: "regular",
      fill: soft-gray,
      font: "Georgia",
      tracking: 2.5pt,
      smallcaps[Random Acts of Self-Actualization]
    )

    #v(0.3in)

    // BLOCK C - Main title
    #text(
      size: 48pt,
      weight: "bold",
      fill: rich-black,
      font: "Georgia",
      tracking: 2pt,
      [BLOCK C]
    )

    #v(0.2in)

    // Subtitle
    #text(
      size: 24pt,
      weight: "regular",
      fill: deep-slate,
      font: "Georgia",
      style: "italic",
      [The Laboratory of Living]
    )

    #v(0.35in)

    // Divider
    #box(width: 3in)[
      #place(center, {
        line(start: (-60pt, 0pt), end: (-15pt, 0pt), stroke: 1.2pt + deep-slate)
        circle(radius: 5pt, fill: bright-cyan, stroke: 0.8pt + deep-slate)
        line(start: (15pt, 0pt), end: (60pt, 0pt), stroke: 1.2pt + deep-slate)
      })
    ]

    #v(0.3in)

    // AUTHORS - PROMINENTLY DISPLAYED
    #text(
      size: 18pt,
      weight: "bold",
      fill: rich-black,
      font: "Georgia",
      tracking: 0pt,
      [Brandon~Mills~&~Jesse~Doherty]
    )

    #v(0.15in)

    // Small accent under authors
    #line(length: 2.3in, stroke: 1pt + bright-cyan.lighten(30%))
  ]
]

// Next page to confirm page break
#page(margin: 1in, header: none, footer: none, fill: cream-bg)[
  #align(center + horizon)[
    #text(size: 24pt, weight: "bold")[
      PAGE 2 - Copyright Page
    ]
  ]
]
