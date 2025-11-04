#!/usr/bin/env python3
"""Convert Markdown to Typst format"""

import re
import sys

def convert_markdown_to_typst(text):
    """Convert markdown formatting to Typst"""

    # Replace C# with C♯ (musical sharp)
    text = text.replace('C#', 'C♯')

    # Escape dollar signs (math mode in Typst)
    text = text.replace('$', '\\$')

    # Convert bold: **text** → *text*
    # Use a regex that handles bold properly
    text = re.sub(r'\*\*([^\*]+?)\*\*', r'*\1*', text)

    # Convert headings
    text = re.sub(r'^### (.+)$', r'=== \1', text, flags=re.MULTILINE)
    text = re.sub(r'^## (.+)$', r'== \1', text, flags=re.MULTILINE)
    text = re.sub(r'^# (.+)$', r'= \1', text, flags=re.MULTILINE)

    return text

if __name__ == '__main__':
    with open('BLOCK_C_COMPLETE_MANUSCRIPT.md', 'r') as f:
        content = f.read()

    converted = convert_markdown_to_typst(content)

    with open('content.typ', 'w') as f:
        f.write(converted)

    print("Conversion complete!")
