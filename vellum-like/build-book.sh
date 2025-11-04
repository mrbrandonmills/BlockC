#!/bin/bash
# VELLUM-LIKE AUTOMATED BOOK BUILDER
# One command to build PDF + EPUB + MOBI

set -e

echo "🔨 Building Block C: The Laboratory of Living..."
echo ""

# Configuration
MANUSCRIPT="../BLOCK_C_COMPLETE_MANUSCRIPT.md"
STYLE="luxury-lab"  # Can be changed to other styles
OUTPUT_DIR="../output"
BOOK_TITLE="Block C: The Laboratory of Living"
AUTHORS="Brandon Mills & Jesse Doherty"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "📖 Step 1: Converting manuscript to Typst..."
cd .. && python3 convert-proper.py && cd vellum-like

echo "📄 Step 2: Building print PDF (6x9 with bleed)..."
cat > ../book-print.typ << 'EOF'
#import "vellum-like/styles/luxury-lab.typ": *

// Title Page
#page(margin: 1in, header: none, footer: none, fill: style.colors.bg)[
  #v(0.6in)
  #align(center)[
    // Geometric design
    #box(width: 4in, height: 70pt)[
      #place(center + horizon, {
        line(start: (-85pt, -25pt), end: (-85pt, 25pt), stroke: 1.2pt + style.colors.accent1)
        line(start: (-85pt, -25pt), end: (-73pt, -25pt), stroke: 1.2pt + style.colors.accent1)
        line(start: (-85pt, 25pt), end: (-73pt, 25pt), stroke: 1.2pt + style.colors.accent1)

        line(start: (85pt, -25pt), end: (85pt, 25pt), stroke: 1.2pt + style.colors.accent1)
        line(start: (85pt, -25pt), end: (73pt, -25pt), stroke: 1.2pt + style.colors.accent1)
        line(start: (85pt, 25pt), end: (73pt, 25pt), stroke: 1.2pt + style.colors.accent1)

        circle(radius: 7pt, stroke: 1.2pt + style.colors.accent2)
        circle(radius: 11pt, stroke: 0.6pt + style.colors.accent1.lighten(35%))
        circle(radius: 16pt, stroke: 0.4pt + style.colors.accent2.lighten(45%))

        for i in range(8) {
          let angle = i * 45deg
          let x = 20pt * calc.cos(angle)
          let y = 20pt * calc.sin(angle)
          place(dx: x, dy: y, circle(radius: 1.5pt, fill: style.colors.accent3))
        }
      })
    ]

    #v(0.35in)
    #text(size: 11pt, weight: "regular", fill: style.colors.muted, font: "Georgia", tracking: 2.5pt, smallcaps[Random Acts of Self-Actualization])

    #v(0.3in)
    #text(size: 48pt, weight: "bold", fill: style.colors.text, font: "Georgia", tracking: 2pt, [BLOCK C])

    #v(0.2in)
    #text(size: 24pt, weight: "regular", fill: style.colors.accent1, font: "Georgia", style: "italic", [The Laboratory of Living])

    #v(0.35in)
    #box(width: 3in)[
      #place(center, {
        line(start: (-60pt, 0pt), end: (-15pt, 0pt), stroke: 1.2pt + style.colors.accent1)
        circle(radius: 5pt, fill: style.colors.accent2, stroke: 0.8pt + style.colors.accent1)
        line(start: (15pt, 0pt), end: (60pt, 0pt), stroke: 1.2pt + style.colors.accent1)
      })
    ]

    #v(0.3in)
    #text(size: 18pt, weight: "bold", fill: style.colors.text, font: "Georgia", tracking: 0pt, [Brandon~Mills~&~Jesse~Doherty])

    #v(0.15in)
    #line(length: 2.3in, stroke: 1pt + style.colors.accent2.lighten(30%))
  ]
]

// Copyright Page
#page(margin: 1in, header: none, footer: none, fill: style.colors.bg)[
  #v(3in)
  #set par(first-line-indent: 0em, leading: 0.65em)
  #set text(size: 9.5pt, fill: style.colors.text)

  #align(center)[
    Copyright © 2025 Brandon Mills & Jesse Doherty\
    All rights reserved.
  ]

  #v(0.4in)

  #text(size: 9pt)[
    No part of this book may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the authors, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.
  ]

  #v(0.4in)

  #align(center)[
    Published by Self-Actualize Life\
    #link("https://www.selfactualize.life")[www.selfactualize.life]\
    #link("https://www.brandonmills.com")[www.brandonmills.com]

    #v(0.28in)

    First Edition: 2025\
    ISBN: \[To be assigned\]
  ]
]

// Table of Contents
#page(margin: (top: 1.2in, bottom: 1in, left: 1in, right: 1in), fill: style.colors.bg)[
  #v(0.8in)
  #align(center)[
    #text(size: 26pt, weight: "bold", fill: style.colors.text, font: "Georgia", tracking: 1pt, [TABLE OF CONTENTS])
    #v(0.2in)
    #line(length: 2.8in, stroke: 1.2pt + style.colors.accent1)
  ]
  #v(0.7in)

  #set par(first-line-indent: 0em, leading: 0.9em)
  #set text(size: 11.5pt, fill: style.colors.text)

  #grid(
    columns: (1fr, auto),
    row-gutter: 0.22in,
    [Introduction: The Laboratory of Living], [5],
    [Chapter I: Moments of Permission], [16],
    [Chapter II: Technology as Mirror], [36],
    [Chapter III: The Awakening Crisis], [61],
    [Chapter IV: Conscious Transformation], [86],
    [Chapter V: Bridging the Gaps], [126],
    [Chapter VI: The Integration], [161],
    [Conclusion: The Invitation Forward], [196],
  )
]
EOF

# Append content starting from line 35 (skipping the duplicate front matter)
tail -n +35 ../content-linebreaks.typ >> ../book-print.typ

typst compile ../book-print.typ "$OUTPUT_DIR/block-c-print.pdf"
echo "✅ Print PDF created: output/block-c-print.pdf"

echo "📱 Step 3: Building EPUB (for ereaders)..."
pandoc "$MANUSCRIPT" \
  --from=markdown \
  --to=epub3 \
  --metadata title="$BOOK_TITLE" \
  --metadata author="$AUTHORS" \
  --css=styles/ebook.css \
  -o "$OUTPUT_DIR/block-c.epub"
echo "✅ EPUB created: output/block-c.epub"

echo "📲 Step 4: Building MOBI (for Kindle)..."
if command -v ebook-convert &> /dev/null; then
    ebook-convert "$OUTPUT_DIR/block-c.epub" "$OUTPUT_DIR/block-c.mobi"
    echo "✅ MOBI created: output/block-c.mobi"
else
    echo "⚠️  Calibre not installed. Skipping MOBI generation."
    echo "   Install with: brew install --cask calibre"
fi

echo ""
echo "🎉 BUILD COMPLETE!"
echo ""
echo "📦 Your files:"
echo "   Print PDF:  output/block-c-print.pdf (6x9\" with 0.125\" bleed)"
echo "   EPUB:       output/block-c.epub (for Apple Books, Kobo, etc.)"
echo "   MOBI:       output/block-c.mobi (for Kindle)"
echo ""
echo "✨ Ready for Amazon KDP, IngramSpark, and all ebook platforms!"
