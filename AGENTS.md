# Repository Guidelines

## Project Structure & Module Organization
BlockC bridges three production paths. The repository root stores the authoritative manuscript (`BLOCK_C_COMPLETE_MANUSCRIPT.md`), conversion helpers such as `convert-proper.py`, and the InDesign ExtendScript automation in `build-book.jsx`. `vellum-like/` holds the Typst/Pandoc toolchain that turns Markdown into print-ready PDFs, EPUBs, and optional MOBIs; styles live in `vellum-like/styles/`, while generated deliverables stay in `output/` (ignored by Git). `vellum-web/` is the Next.js 16 UI that mirrors Vellum’s desktop workflow with components in `components/`, App Router handlers in `app/api/export/*`, and test harnesses like `test-export.js`.

## Build, Test, and Development Commands
- `python convert-proper.py` — refresh `content-linebreaks.typ` before compiling Typst layouts.
- `cd vellum-like && ./build-book.sh` — one-command pipeline (Typst → Pandoc → optional Calibre) that populates `output/`; run `./select-style.sh` beforehand to swap template packs.
- `cd vellum-web && npm run dev` (or `npm run build && npm start`) — run the web formatter.
- `node test-export.js` / `node test-epub.js` — hit the `/api/export/*` routes and confirm Typst/Pandoc prerequisites.

## Coding Style & Naming Conventions
TypeScript and React files use 2-space indentation, kebab-case filenames (`components/style-selector.tsx`), PascalCase exports, and `'use client'` only when hooks or browser APIs are required. Group Tailwind classes layout → color → effects and push shared helpers into `vellum-web/lib/`. Typst templates rely on snake_case `let` bindings plus inline comments describing ornament math. ExtendScript automation should stay in vanilla JS with camelCase variables to keep InDesign happy.

## Testing Guidelines
Before shipping templates or export logic, run `node test-export.js` to generate `test-output.pdf` and confirm the `%PDF-` header; `node test-epub.js` validates Pandoc and epubcheck output. Spot-check typography with `typst compile verify-pages.typ`. Frontend changes must pass `npm run lint` and manual export smoke tests (upload sample manuscript, confirm both PDF and EPUB responses). Log regressions or new verifiers in `vellum-like/SUMMARY.md`.

## Commit & Pull Request Guidelines
Follow the existing imperative style (`Add interactive book preview`, `Fix: remove auto-load`). Scope tags such as `feat:`/`fix:` help when touching both Typst and Next code. Every PR must link the manuscript or UX issue it addresses, include screenshots of the updated preview pane, list the export/test commands you ran, and, when PDFs change, provide checksum notes rather than binaries. Never commit exports, fonts, or Adobe cache files—share them via Drive instead.

## Security & Asset Handling
Keep `.env.local`, API tokens for Vercel/Pandoc helpers, and licensed fonts outside the repo, and scrub any PII before pushing screenshots or logs.
