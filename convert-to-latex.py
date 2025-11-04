#!/usr/bin/env python3
"""Convert Typst content to LaTeX"""

import re

def convert_to_latex(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Typst headings with LaTeX
    content = re.sub(r'^== (.*?)$', r'\\chapter{\1}', content, flags=re.MULTILINE)
    content = re.sub(r'^=== (.*?)$', r'\\section{\1}', content, flags=re.MULTILINE)
    content = re.sub(r'^==== (.*?)$', r'\\subsection{\1}', content, flags=re.MULTILINE)

    # Replace bold
    content = re.sub(r'\*(.*?)\*', r'\\textbf{\1}', content)

    # Replace italic
    content = re.sub(r'_(.*?)_', r'\\textit{\1}', content)

    # Replace line breaks (backslash at end of line) - just remove them
    # In LaTeX, paragraphs are separated by blank lines
    content = re.sub(r' \\$', '', content, flags=re.MULTILINE)

    # Replace pagebreak
    content = re.sub(r'#pagebreak\(\)', r'\\cleardoublepage', content)

    # Escape LaTeX special characters (but not our commands)
    # Do this carefully to not break our LaTeX commands
    content = content.replace('%', '\\%')
    content = content.replace('&', '\\&')
    content = content.replace('#', '\\#')

    # Fix the commands we just broke
    content = content.replace('\\\\#pagebreak', '#pagebreak')
    content = content.replace('\\\\chapter', '\\chapter')
    content = content.replace('\\\\section', '\\section')
    content = content.replace('\\\\subsection', '\\subsection')

    # Unicode handling
    content = content.replace('♯', '\\sharp')

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Converted to {output_file}")

if __name__ == '__main__':
    convert_to_latex('content-linebreaks.typ', 'content-latex.tex')
