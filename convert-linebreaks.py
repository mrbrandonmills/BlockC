#!/usr/bin/env python3
"""
Convert markdown to Typst with proper line breaks vs paragraph breaks.
Single blank lines = line breaks within paragraph (\)
Double blank lines or headings = true paragraph breaks
"""

import re

def convert_markdown_to_typst_with_linebreaks(md_file, output_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by double newlines to get blocks
    blocks = re.split(r'\n\n\n+', content)

    typst_blocks = []

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        # Check if this is a heading
        if block.startswith('#'):
            # Convert markdown headings to Typst
            if block.startswith('### '):
                typst_blocks.append('=== ' + block[4:])
            elif block.startswith('## '):
                typst_blocks.append('== ' + block[3:])
            elif block.startswith('# '):
                typst_blocks.append('= ' + block[2:])
            else:
                typst_blocks.append(block)

        # Check if this is a horizontal rule
        elif block.strip() in ['---', '***', '___']:
            typst_blocks.append('#pagebreak()')

        # Regular paragraph block - convert single newlines to line breaks
        else:
            # Split by single newline
            lines = block.split('\n')

            # Process each line
            processed_lines = []
            for line in lines:
                line = line.strip()
                if not line:
                    continue

                # Convert markdown bold to Typst bold
                line = re.sub(r'\*\*(.*?)\*\*', r'*\1*', line)

                # Escape special characters
                line = line.replace('C#', 'C♯')
                line = line.replace('$', r'\$')

                processed_lines.append(line)

            # Join with line break markers
            if processed_lines:
                typst_blocks.append(' \\\n'.join(processed_lines))

    # Join all blocks with double newlines (paragraph breaks)
    typst_content = '\n\n'.join(typst_blocks)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(typst_content)

    print(f"Converted {md_file} to {output_file}")

if __name__ == '__main__':
    convert_markdown_to_typst_with_linebreaks(
        'BLOCK_C_COMPLETE_MANUSCRIPT.md',
        'content-proper-linebreaks.typ'
    )
