# Vellum Alternative - Web App Architecture (Vercel)

## Overview

Transform our CLI tool into a **professional web-based book formatter** - a direct Vellum competitor that runs entirely in the browser + serverless functions.

## Tech Stack

### Frontend (Next.js 14+)
```
- Framework: Next.js 14 (App Router)
- UI: TailwindCSS + shadcn/ui components
- Editor: TipTap (ProseMirror-based WYSIWYG)
- Preview: React PDF renderer + EPUB.js
- State: Zustand or Context API
- File Upload: react-dropzone
```

### Backend (Vercel Serverless)
```
- Runtime: Node.js 20
- PDF Generation: Puppeteer (via @vercel/og or custom layer)
- EPUB Generation: epub-gen
- DOCX Import: mammoth.js
- Typst Compilation: WASM build of Typst or Docker container
```

### Storage
```
- User Projects: Vercel Postgres or Supabase
- File Storage: Vercel Blob Storage
- Fonts/Assets: Vercel Edge CDN
```

## Features (MVP)

### 1. Import Manuscript
- Drag & drop .docx, .txt, or .md files
- Auto-detect chapters (H1 → chapter breaks)
- Parse formatting (bold, italic, lists, images)

### 2. Choose Style
Gallery of book templates:
- Luxury Laboratory (current)
- Serif Classic
- Modern Sans
- Script Elegant
- Minimalist
- Academic

Each style includes:
- Preview thumbnail
- Font samples
- Color palette display

### 3. Live Editor & Preview
Split-pane interface:
- **Left**: Rich text editor (TipTap)
  - Chapter list sidebar
  - Drag to reorder chapters
  - Add/delete chapters
  - Insert images, quotes, ornaments

- **Right**: Live preview
  - Toggle: eBook view | Print view
  - Device selector (Kindle, iPad, iPhone, Print)
  - Real-time style updates

### 4. Customize
- Change fonts (from 50+ options)
- Adjust colors (color picker)
- Toggle drop caps
- Add ornaments/flourishes
- Set trim size (5x8", 6x9", etc.)
- Configure margins

### 5. Export
One-click generation of:
- ✅ Print PDF (PDF/X-1a ready for KDP)
- ✅ EPUB 3 (Apple Books, Kobo, Nook)
- ✅ MOBI (Kindle - via Calibre conversion)
- ✅ Generic EPUB (all platforms)

Download all as ZIP file.

### 6. Accessibility
- Alt-text editor for images
- DAISY ACE validation
- WCAG AA compliance
- Screen reader tested

## API Routes

```typescript
/api/import
  POST: Upload DOCX/MD → Parse to JSON chapters

/api/preview/pdf
  POST: Generate PDF preview (single chapter or full book)

/api/preview/epub
  POST: Generate EPUB preview

/api/export/print
  POST: Generate final print PDF (PDF/X-1a)

/api/export/epub
  POST: Generate final EPUB files (store variants)

/api/export/mobi
  POST: Convert EPUB → MOBI

/api/validate/accessibility
  POST: Run DAISY ACE checker on EPUB

/api/projects
  GET: List user's book projects
  POST: Save/update book project

/api/fonts
  GET: List available fonts with metadata
```

## Database Schema (Postgres)

```sql
-- Users table
users (
  id: uuid PRIMARY KEY,
  email: text,
  name: text,
  created_at: timestamp
)

-- Book projects
books (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  title: text,
  subtitle: text,
  author: text,
  style: text,  -- 'luxury-lab', 'serif-classic', etc.
  trim_size: text,  -- '6x9', '5x8', etc.
  settings: jsonb,  -- Custom fonts, colors, margins
  created_at: timestamp,
  updated_at: timestamp
)

-- Chapters
chapters (
  id: uuid PRIMARY KEY,
  book_id: uuid REFERENCES books(id),
  order: integer,
  title: text,
  content: text,  -- HTML or Markdown
  created_at: timestamp
)

-- Assets (images, ornaments)
assets (
  id: uuid PRIMARY KEY,
  book_id: uuid REFERENCES books(id),
  file_url: text,  -- Vercel Blob URL
  file_type: text,
  alt_text: text,
  created_at: timestamp
)
```

## File Structure

```
vellum-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── books/
│   │   └── new/
│   ├── editor/
│   │   └── [bookId]/
│   │       ├── page.tsx          # Main editor
│   │       ├── components/
│   │       │   ├── EditorPane.tsx
│   │       │   ├── PreviewPane.tsx
│   │       │   ├── StyleGallery.tsx
│   │       │   ├── ChapterList.tsx
│   │       │   └── ExportDialog.tsx
│   │       └── hooks/
│   │           ├── useBook.ts
│   │           ├── useEditor.ts
│   │           └── usePreview.ts
│   ├── api/
│   │   ├── import/route.ts
│   │   ├── preview/
│   │   ├── export/
│   │   └── validate/
│   └── layout.tsx
├── lib/
│   ├── typst/                    # Typst templates
│   ├── epub/                     # EPUB generation
│   ├── pdf/                      # PDF generation
│   ├── styles/                   # Book style definitions
│   └── utils/
├── public/
│   ├── fonts/
│   ├── ornaments/
│   └── templates/
└── package.json
```

## Deployment Strategy

### Phase 1: MVP (2-3 weeks)
- Basic import (DOCX → JSON)
- TipTap editor
- 3 book styles
- PDF export via Puppeteer
- EPUB export via epub-gen

### Phase 2: Polish (2 weeks)
- Live preview (both eBook and print)
- Style customization
- Image upload & management
- Download all formats

### Phase 3: Pro Features (ongoing)
- User accounts & project saving
- Collaboration (share book with beta readers)
- Payment integration (Stripe)
- ARC generation (beta reader copies)
- Box set creation
- Analytics (track downloads)

## Monetization

### Free Tier
- 1 active project
- 3 exports per month
- Watermarked PDFs
- Basic styles only

### Pro ($10/month or $60/year)
- Unlimited projects
- Unlimited exports
- No watermarks
- All styles
- Custom fonts
- Priority support

### Pay-Per-Book ($15/book)
- One-time payment
- Export all formats
- No watermark
- Keep forever

## Competitive Advantage vs Vellum

| Feature | Vellum | Our Web App |
|---------|--------|-------------|
| Platform | Mac only | Any device (browser) |
| Price | $249.99 one-time | $10/month or pay-per-book |
| Collaboration | No | Yes (share projects) |
| Live Preview | Yes | Yes |
| Styles | 50+ | Growing library |
| Customization | Limited | Full CSS control |
| Accessibility | ACE validated | ACE validated + WCAG |
| Export Speed | Fast | Fast (serverless) |
| Learning Curve | Low | Very low (web interface) |

## Technical Challenges & Solutions

### 1. Typst Compilation on Vercel
**Challenge**: Typst is a Rust binary, Vercel has size limits

**Solutions**:
- Use Typst WASM build in Edge Function
- OR use Docker container on Vercel (with buildpack)
- OR pre-compile to PDF locally, upload to Blob, serve

### 2. PDF/X-1a Compliance
**Challenge**: Puppeteer doesn't output PDF/X-1a

**Solutions**:
- Use Ghostscript in serverless function
- OR use commercial API (pdf-tools.com)
- OR accept RGB PDFs (most printers now accept)

### 3. Large File Uploads
**Challenge**: DOCX files can be big

**Solutions**:
- Stream uploads to Vercel Blob
- Client-side chunking
- Progress indicators

### 4. EPUB Validation
**Challenge**: DAISY ACE is heavy

**Solutions**:
- Run ACE in background job
- Cache results
- Optional validation (not required)

## Next Steps to Build

1. **Setup Next.js project**
   ```bash
   npx create-next-app@latest vellum-web --typescript --tailwind --app
   ```

2. **Install dependencies**
   ```bash
   npm install tiptap epub-gen mammoth puppeteer-core @vercel/blob
   ```

3. **Create basic editor UI**
   - TipTap integration
   - Split pane layout
   - Style selector

4. **Implement export APIs**
   - PDF generation endpoint
   - EPUB generation endpoint

5. **Deploy to Vercel**
   ```bash
   vercel deploy
   ```

## Estimated Timeline

- **Week 1-2**: Frontend editor + preview
- **Week 3**: Export functionality (PDF + EPUB)
- **Week 4**: Polish + user testing
- **Week 5**: Deploy & launch beta

**Total: 5 weeks to MVP**

Then iterate based on user feedback.

---

## Want to start building the web app?

I can scaffold the entire Next.js project structure right now and we'll have a working prototype within a few hours!
