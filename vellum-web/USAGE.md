# Vellum Alternative - Usage Guide

## Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: http://localhost:3000

3. **Upload your manuscript**:
   - Drag & drop or click to upload
   - Supports .txt, .md, and .docx files

4. **Edit your content**:
   - Click "Edit" mode to use the WYSIWYG editor
   - Format text with bold, italic, underline
   - Add headings, lists, and text alignment
   - Click "Preview" mode to see formatted output

5. **Choose a style**:
   - Luxury Laboratory (modern geometric design)
   - Serif Classic (traditional book design)
   - Modern Sans (clean contemporary)

6. **Export**:
   - Click "Export Print PDF" for a print-ready PDF
   - Click "Export EPUB" for an ebook format
   - Click "Export All Formats" for both

## Features

### Upload Formats
- **TXT**: Plain text files
- **MD**: Markdown files (headings, bold, italic auto-detected)
- **DOCX**: Microsoft Word documents (converted to HTML)

### Editor Capabilities
The WYSIWYG editor supports:
- **Text Formatting**: Bold, italic, underline
- **Headings**: H1, H2, H3 (for chapters and sections)
- **Lists**: Bullet points and numbered lists
- **Alignment**: Left, center, right
- **Real-time Preview**: See changes as you type

### Style Templates

#### 1. Luxury Laboratory
- Modern scientific aesthetic
- Cream (#E8E4DC) background
- Deep slate (#2F4F4F) and cyan (#00CED1) accents
- Full-bleed geometric designs
- Perfect for: Modern non-fiction, science, philosophy

#### 2. Serif Classic
- Traditional book design
- Drop caps on chapter openings
- Ornamental decorations
- Elegant serif typography
- Perfect for: Classic literature, memoirs, historical works

#### 3. Modern Sans
- Clean contemporary design
- Sans-serif fonts
- Minimal styling
- Professional appearance
- Perfect for: Business books, guides, technical manuals

### Export Options

#### PDF Export
- Print-ready format (6x9 inches with bleed)
- Professional typography
- Automatic page numbers and headers
- Chapter page breaks
- Title page with authors

#### EPUB Export
- Standard ebook format
- Responsive for all screen sizes
- Proper metadata (title, authors)
- Compatible with Kindle, Apple Books, etc.

## System Requirements

### Required Software
- **Node.js** (v18 or higher)
- **Typst** (for PDF generation)
  ```bash
  brew install typst  # macOS
  ```
- **Pandoc** (for EPUB generation)
  ```bash
  brew install pandoc  # macOS
  ```

### Optional
- **Vercel CLI** (for deployment)
  ```bash
  npm install -g vercel
  ```

## Project Structure

```
vellum-web/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind styles
│   └── api/
│       └── export/
│           ├── pdf/route.ts  # PDF export endpoint
│           └── epub/route.ts # EPUB export endpoint
├── components/
│   ├── Editor.tsx            # TipTap WYSIWYG editor
│   ├── FileUpload.tsx        # Drag-and-drop upload
│   └── StyleSelector.tsx     # Template chooser
├── lib/
│   ├── store.ts              # Zustand state management
│   └── html-to-typst.ts      # Content conversion
├── styles/
│   ├── luxury-lab.typ        # Luxury Laboratory template
│   ├── serif-classic.typ     # Serif Classic template
│   └── modern-sans.typ       # Modern Sans template
└── package.json
```

## API Endpoints

### POST /api/export/pdf
Export manuscript as PDF.

**Request Body**:
```json
{
  "content": "HTML or plain text content",
  "title": "Book Title",
  "authors": ["Author 1", "Author 2"],
  "style": "luxury-lab",
  "contentType": "html"
}
```

**Response**: PDF file (application/pdf)

### POST /api/export/epub
Export manuscript as EPUB.

**Request Body**:
```json
{
  "content": "HTML or plain text content",
  "title": "Book Title",
  "authors": ["Author 1", "Author 2"],
  "contentType": "html"
}
```

**Response**: EPUB file (application/epub+zip)

## Troubleshooting

### PDF Export Fails
- **Error**: "Typst command not found"
- **Solution**: Install Typst with `brew install typst`

### EPUB Export Fails
- **Error**: "Pandoc command not found"
- **Solution**: Install Pandoc with `brew install pandoc`

### Upload Doesn't Work
- **Check**: File format is .txt, .md, or .docx
- **Check**: File size is under 10MB

### Styling Looks Wrong
- **Try**: Different style templates
- **Check**: Content has proper heading markers (# for H1, ## for H2)

## Tips & Best Practices

1. **Use Headings Properly**:
   - H1 for chapter titles
   - H2 for major sections
   - H3 for subsections

2. **Format Before Export**:
   - Use the editor to format text before exporting
   - Preview both eBook and Print views

3. **Test Multiple Styles**:
   - Try different templates to find the best fit
   - Different books suit different styles

4. **Keep Backups**:
   - Save your manuscript file separately
   - The web app doesn't save projects yet (coming soon)

## Next Steps

- [ ] Add chapter management
- [ ] Implement project saving
- [ ] Add image upload support
- [ ] Create more style templates
- [ ] Deploy to Vercel for online access

## Support

For issues or questions:
1. Check the README.md
2. Review this USAGE.md guide
3. Test with the included test-sample.md file

---

Built as a free alternative to Vellum ($249.99)
