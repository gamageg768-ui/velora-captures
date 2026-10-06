# OBSCURA — Setup

A dark, cinematic **graphic-design + photography portfolio**, built as a full-stack
Next.js 14 **PWA** with **React Three Fiber** 3D (a floating-photograph hero and a
draggable 3D gallery ring), plus a real backend: the contact form writes inquiries to
a database via Prisma.

---

## 1. Prerequisites

- **Node.js 18.18+** (Node 20 LTS recommended) and **npm**.
- That's it for local dev — the default database is **SQLite** (a file, no server to run).

## 2. Install

```bash
npm install
```

This also runs `prisma generate` automatically (via the `postinstall` script) to build
the typed database client.

> If you ever see *"@prisma/client did not initialize yet"*, just run:
> ```bash
> npx prisma generate
> ```

## 3. Environment

A ready-to-go `.env.local` is included:

```env
DATABASE_URL="file:./dev.db"
```

(`.env.example` is the template if you need to recreate it.)

## 4. Create the database

```bash
npx prisma db push
```

This creates `prisma/dev.db` and the `Inquiry` table the contact form writes to.

## 5. Run it

```bash
npm run dev
```

Open **http://localhost:3000**.

- `/` — 3D hero + studio + selected work + services
- `/work` — the draggable 3D gallery (drag to spin, hover a frame) + full index
- `/contact` — contact form → saves to the database

## 6. Production build

```bash
npm run build
npm start
```

The **service worker / PWA** is only generated in the production build (it's disabled in
dev on purpose). Once built and served over HTTPS (or localhost), the site is
installable to a home screen / desktop.

---

## Inspecting saved inquiries

- Every contact submission is stored in the `Inquiry` table.
- A quick way to browse them:
  ```bash
  npx prisma studio
  ```
- `GET /api/contact` returns the current inquiry count (handy if you later add a dashboard).

---

## Making it yours

| What | Where |
| --- | --- |
| **Your photos** | Drop images into `public/photos/` (keep names `p1.jpg`…`p8.jpg`, or update paths). |
| **Project titles / clients / text** | `lib/projects.ts` |
| **Studio name, nav, footer, email** | `components/Nav.tsx`, `components/Footer.tsx`, page copy in `app/**/page.tsx` |
| **Colors / accent** | CSS variables at the top of `app/globals.css` (`--bg`, `--ink`, `--accent`, …) |
| **Fonts** | `app/layout.tsx` (currently Fraunces / Hanken Grotesk / JetBrains Mono via `next/font`) |
| **App name / icons / theme color** | `public/manifest.json`, `public/icons/`, `app/icon.png` |
| **Regenerate placeholder art** | `python3 scripts/gen_assets.py` (needs `pip install pillow`) |

### Switching to PostgreSQL for production

1. In `prisma/schema.prisma`, change `provider = "sqlite"` → `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Postgres connection string.
3. Run `npx prisma migrate deploy` (or `prisma db push`).

---

## Notes

- The 3D scenes are loaded with `next/dynamic` (`ssr: false`), so Three.js never runs on
  the server and stays out of the initial JS payload — it streams in as a separate chunk
  when a canvas mounts.
- Motion respects `prefers-reduced-motion`, and the custom cursor / smooth scroll disable
  themselves on touch / reduced-motion.
- PWA is powered by `@ducanh2912/next-pwa` (the actively maintained, App-Router-friendly
  fork of `next-pwa`).
