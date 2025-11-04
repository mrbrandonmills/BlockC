#!/usr/bin/env python3
"""Convert markdown to Typst with line breaks within paragraphs"""

import re

def convert_md_to_typst(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    result = []
    current_paragraph = []

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Handle headings
        if stripped.startswith('###'):
            # Flush current paragraph
            if current_paragraph:
                result.append(' \\\n'.join(current_paragraph))
                result.append('')
                current_paragraph = []
            result.append('=== ' + stripped[4:])
            result.append('')

        elif stripped.startswith('##'):
            if current_paragraph:
                result.append(' \\\n'.join(current_paragraph))
                result.append('')
                current_paragraph = []
            result.append('== ' + stripped[3:])
            result.append('')

        elif stripped.startswith('#'):
            if current_paragraph:
                result.append(' \\\n'.join(current_paragraph))
                result.append('')
                current_paragraph = []
            result.append('= ' + stripped[2:])
            result.append('')

        # Handle horizontal rules
        elif stripped in ['---', '***', '___']:
            if current_paragraph:
                result.append(' \\\n'.join(current_paragraph))
                result.append('')
                current_paragraph = []
            result.append('#pagebreak()')
            result.append('')

        # Handle blank lines
        elif not stripped:
            continue  # Skip blank lines, they become line breaks

        # Regular text line
        else:
            # Process the line
            processed = stripped
            # Convert bold
            processed = re.sub(r'\*\*(.*?)\*\*', r'*\1*', processed)
            # Escape special chars
            processed = processed.replace('C#', 'C♯')
            processed = processed.replace('$', r'\$')

            current_paragraph.append(processed)

    # Flush final paragraph
    if current_paragraph:
        result.append(' \\\n'.join(current_paragraph))

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result))

    print(f"Converted {input_file} to {output_file}")

if __name__ == '__main__':
    convert_md_to_typst('BLOCK_C_COMPLETE_MANUSCRIPT.md', 'content-linebreaks.typ')
