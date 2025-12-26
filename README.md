# Signature Injection Engine

A full-stack Next.js prototype to place fields on a PDF responsively, then burn-in a signature.

## Features

- Responsive PDF editor using React-PDF
- Drag & drop + resize: text, signature, image, date, radio fields
- Signature drawing modal (canvas)
- Burn-in endpoint with aspect-ratio preserving fit
- SHA-256 audit trail: before/after hashes stored in MongoDB

## Tech

- Next.js
- Tailwind CSS v4
- React-PDF / pdf.js
- pdf-lib (server-side overlay)
- MongoDB (Mongoose)

## Quick start (local)

1. Prerequisites: Node 18+, MongoDB.
2. Install deps:
   ```bash
   npm i
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```
4. Run the app:

   ```bash
   npm run dev
   ```

5. Open:
   - http://localhost:3000
   - Upload a PDF.
   - Drag fields, resize, save placements.
   - Click "Sign" to draw and burn-in. The signed PDF opens in a new tab.

## Security & Audit

- On upload: compute SHA-256 of the original PDF.
- On signing: compute hash of the final PDF.
- Store hashes and action metadata in MongoDB `Audit` collection.

## Coordinate mapping details

- Frontend positions are saved as percentages of the page width/height (top-left origin).
- Server converts to PDF points:
  - `x_pts = percentX * pageWidthPts`
  - `y_pts = pageHeightPts - (percentY * pageHeightPts) - (percentHeight * pageHeightPts)`
- Signature image is fitted inside the box:
  - `scale = min(boxW/imgW, boxH/imgH)`
  - centered with `drawX`, `drawY`.
