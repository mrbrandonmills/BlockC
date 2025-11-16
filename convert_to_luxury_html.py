#!/usr/bin/env python3
import re

# Read the corrected markdown
with open('BLOCK_C_COMPLETE_MANUSCRIPT.md', 'r') as f:
    content = f.read()

# HTML template with luxury design
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random Acts of Self-Actualization: Block C - The Laboratory of Living</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Cinzel:wght@400;600;700&display=swap');

        /* ========== PDF PRINT SETTINGS ========== */
        @page {
            size: 6in 9in;
            margin: 0.625in 0.5in 1in 0.875in;
            prince-bleed: 0.125in;
        }

        * {
            prince-background-image-resolution: 300dpi;
            -prince-pdf-page-colorspace: auto;
        }

        @media print {
            body {
                width: 100% !important;
                margin: 0;
                background: var(--parchment) !important;
            }

            .page, .title-page, .chapter {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                background: var(--parchment) !important;
            }

            .page::before, .page::after,
            .title-page::before, .title-page::after,
            .geometry-overlay,
            .chapter::before, .chapter::after {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
                display: block !important;
            }

            .title-page {
                page-break-after: always;
            }

            .chapter {
                page-break-before: always;
            }

            .chapter-title, .section-title, h1, h2 {
                page-break-after: avoid;
            }

            .first-paragraph {
                page-break-before: avoid;
            }

            p {
                orphans: 3;
                widows: 3;
            }

            nav {
                display: none !important;
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --parchment: #F4EFE0;
            --deep-charcoal: #2D2D2D;
            --bronze: #8B7355;
            --gold: #D4AF37;
            --dark-bronze: #5C4A3A;
        }

        body {
            font-family: 'Cormorant Garamond', serif;
            background: var(--parchment);
            color: var(--deep-charcoal);
            line-height: 1.8;
            font-size: 18px;
            font-weight: 500;
        }

        .page {
            position: relative;
            max-width: 900px;
            margin: 0 auto;
            padding: 80px 60px;
            background:
                linear-gradient(rgba(244, 239, 224, 0.92), rgba(244, 239, 224, 0.92)),
                repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(139, 115, 85, 0.08) 49px, rgba(139, 115, 85, 0.08) 50px),
                repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(139, 115, 85, 0.08) 49px, rgba(139, 115, 85, 0.08) 50px);
            box-shadow: 0 0 100px rgba(0,0,0,0.2);
        }

        .page::before,
        .page::after {
            content: '';
            position: absolute;
            width: 100px;
            height: 100px;
            border: 3px solid var(--bronze);
            opacity: 0.4;
            z-index: 10;
        }

        .page::before {
            top: 30px;
            left: 30px;
            border-right: none;
            border-bottom: none;
        }

        .page::after {
            bottom: 30px;
            right: 30px;
            border-left: none;
            border-top: none;
        }

        .title-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .title-page::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            border: 2px solid var(--bronze);
            opacity: 0.2;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
        }

        .title-page::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            border: 1px solid var(--gold);
            opacity: 0.15;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            z-index: 1;
        }

        .main-title {
            font-family: 'Cinzel', serif;
            font-size: 64px;
            font-weight: 700;
            color: var(--deep-charcoal);
            letter-spacing: 4px;
            margin-bottom: 20px;
            text-transform: uppercase;
            position: relative;
            z-index: 10;
        }

        .subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-size: 36px;
            font-weight: 400;
            color: var(--bronze);
            font-style: italic;
            margin-bottom: 60px;
            position: relative;
            z-index: 10;
        }

        .author-names {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--deep-charcoal);
            letter-spacing: 2px;
            margin-top: 40px;
            position: relative;
            z-index: 10;
        }

        .chapter {
            margin: 60px 0;
        }

        .chapter-title {
            font-family: 'Cinzel', serif;
            font-size: 48px;
            font-weight: 600;
            color: var(--bronze);
            letter-spacing: 3px;
            margin-bottom: 10px;
            text-transform: uppercase;
            border-bottom: 3px solid var(--gold);
            padding-bottom: 15px;
        }

        .chapter-subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            font-weight: 400;
            color: var(--deep-charcoal);
            font-style: italic;
            margin-bottom: 40px;
        }

        .section-title {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            font-weight: 600;
            color: var(--dark-bronze);
            margin: 40px 0 20px 0;
            letter-spacing: 1px;
        }

        h3.section-title {
            font-size: 24px;
            margin: 30px 0 15px 0;
        }

        p {
            margin: 20px 0;
            text-align: justify;
            text-justify: inter-word;
        }

        .first-paragraph::first-letter {
            font-size: 72px;
            float: left;
            line-height: 60px;
            padding-right: 8px;
            margin-top: 3px;
            font-family: 'Cinzel', serif;
            color: var(--bronze);
        }

        blockquote {
            margin: 30px 40px;
            padding: 20px 30px;
            border-left: 4px solid var(--bronze);
            background: rgba(139, 115, 85, 0.05);
            font-style: italic;
        }

        ul, ol {
            margin: 20px 0 20px 40px;
        }

        li {
            margin: 10px 0;
        }

        .section-break {
            border: none;
            border-top: 2px solid var(--bronze);
            margin: 40px auto;
            width: 200px;
            opacity: 0.3;
        }

        strong, b {
            font-weight: 700;
            color: var(--dark-bronze);
        }

        em, i {
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="title-page">
            <h1 class="main-title">BLOCK C</h1>
            <h2 class="subtitle">The Laboratory of Living</h2>
            <p class="subtitle" style="font-size: 28px; margin-top: -40px;">Random Acts of Self-Actualization</p>
            <p class="author-names">By Brandon Mills & Jesse Doherty</p>
        </div>

        <div class="content">
{CONTENT}
        </div>
    </div>
</body>
</html>'''

def convert_markdown_to_html(md_text):
    """Convert markdown to HTML"""
    lines = md_text.split('\n')
    html = []
    i = 0
    in_chapter = False
    first_p_in_section = True

    while i < len(lines):
        line = lines[i].strip()

        # Skip title page content (already in HTML)
        if i < 20:
            i += 1
            continue

        # Close previous chapter div if needed
        if line.startswith('## CHAPTER') and in_chapter:
            html.append('</div>')
            in_chapter = False

        # Chapter headings
        if line.startswith('## CHAPTER'):
            match = re.match(r'## CHAPTER (\w+): (.+)', line)
            if match:
                num, title = match.groups()
                html.append(f'\n<div class="chapter" id="chapter-{num.lower()}">')
                html.append(f'<h1 class="chapter-title">CHAPTER {num}</h1>')
                html.append(f'<h2 class="chapter-subtitle">{title}</h2>')
                in_chapter = True
                first_p_in_section = True

        # Section headings
        elif line.startswith('###'):
            title = line.replace('###', '').strip()
            html.append(f'<h3 class="section-title">{title}</h3>')
            first_p_in_section = True

        elif line.startswith('##') and not line.startswith('## CHAPTER'):
            title = line.replace('##', '').strip()
            html.append(f'<h2 class="section-title">{title}</h2>')
            first_p_in_section = True

        # Horizontal rules
        elif line == '---':
            html.append('<hr class="section-break">')

        # Blockquotes
        elif line.startswith('>'):
            quote = line[1:].strip()
            if not html or not html[-1].startswith('<blockquote>'):
                html.append('<blockquote>')
            html.append(f'<p>{quote}</p>')
            # Check if next line is also a quote
            if i + 1 < len(lines) and not lines[i + 1].strip().startswith('>'):
                html.append('</blockquote>')

        # List items
        elif line.startswith('- '):
            item = line[2:]
            if not html or not html[-1].startswith('<ul>'):
                html.append('<ul>')
            html.append(f'<li>{item}</li>')
            # Check if next line is also a list item
            if i + 1 < len(lines) and not lines[i + 1].strip().startswith('- '):
                html.append('</ul>')

        # Empty lines
        elif not line:
            pass

        # Regular paragraphs
        else:
            # Handle bold **text**
            line = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', line)
            # Handle italic *text*
            line = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', line)

            if first_p_in_section:
                html.append(f'<p class="first-paragraph">{line}</p>')
                first_p_in_section = False
            else:
                html.append(f'<p>{line}</p>')

        i += 1

    if in_chapter:
        html.append('</div>')

    return '\n'.join(html)

# Convert content
html_content = convert_markdown_to_html(content)

# Insert into template
final_html = HTML_TEMPLATE.replace('{CONTENT}', html_content)

# Save to file
output_path = '/Users/brandon/Downloads/Block-C-FINAL-CORRECTED.html'
with open(output_path, 'w') as f:
    f.write(final_html)

print(f"✅ Generated: {output_path}")
print(f"📄 Total lines: {len(final_html.splitlines())}")
print(f"📦 File size: {len(final_html) / 1024:.1f} KB")
