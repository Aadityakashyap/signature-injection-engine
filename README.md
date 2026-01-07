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
- Supabase Storage

## Quick start (local)

1. Prerequisites: Node 18+, MongoDB.
2. Install deps:
   ```bash
   npm i
   ```
3. Configure environment:
   ```bash
   cp .env.local .env
   ```

### Environment Variables

```env
MONGODB_URI="your monbodb url"
BASE_URL=http://localhost:3000
DATA_DIR=./data
SUPABASE_URL="your supabase url"
SUPABASE_ANON_KEY="your supabase anon key"
SUPABASE_SERVICE_ROLE_KEY="your supabase service role key"
NODE_ENV=development
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

---

## Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. In the Supabase dashboard:
   - Go to Storage → Create bucket:
     - `pdfs` (for original uploads)
     - `signed` (for signed PDFs)
   - Set bucket to public if you want direct file URLs.
3. Copy your project settings:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Service role key)

---

## Deploy to Vercel

1. Push your repo to GitHub.
2. Go to [Vercel](https://vercel.com) → Import Project.
3. Select your repo, configure environment variables.
4. Deploy.
