# ARFAD Content Admin

A full editing backend for arfad.com.sa's content: services, projects (with photo
galleries), site-wide text (hero copy, stats, contact info), and a media library —
built with Next.js 14, shadcn/ui-style components, Tremor (dashboard overview),
NextAuth (login) and Drizzle ORM on SQLite.

The current arfad.com.sa site is a static export (via `build.py`) published as a
Claude Artifact. This app is a **separate, self-hosted** project: a real backend
with a database, authentication and file uploads, which a static Artifact can't
provide. Point it at your domain (or a subdomain like `admin.arfad.com.sa`) once
deployed, and have `build.py` (or a future rewrite of the public site) read from
its API/database instead of hardcoded Python strings — or use the built-in public
pages (`/`, `/services`, `/projects`) as a starting point for the real site.

## What you can edit

- **Services** — the 9 service cards: title, summary, image, feature list, published/draft.
- **Projects** — every project: client, location, scope, description, vendor number,
  a full photo gallery (drag-order via arrows, add/remove), "Highlighted Projects" toggle,
  published/draft.
- **Site Settings** — hero headline/copy, homepage stats, contact details, about text.
- **Media Library** — every uploaded image in one place, with copy-URL and delete.
- **Team** — add/remove teammates who can log in and edit (Admin / Editor roles).

## Stack

- **Next.js 14** (App Router, TypeScript)
- **shadcn/ui**-style components (Button, Input, Table, Dialog, Tabs, Switch, etc. — hand-written, same API as shadcn's CLI output, so `npx shadcn add <component>` still works if you want more)
- **Tremor** for the dashboard Overview page (stat cards, lists)
- **NextAuth** (credentials login, JWT sessions)
- **Drizzle ORM + SQLite** (via `better-sqlite3`) — zero external services to run locally

## Local setup

```bash
npm install
cp .env.example .env        # edit NEXTAUTH_SECRET at minimum
npm run db:push             # creates the SQLite tables
npm run seed                # creates an admin user + seeds real ARFAD content
npm run dev
```

Then open `http://localhost:3000/admin/login` and sign in with the email/password
printed by `npm run seed` (defaults to `admin@arfad.com.sa` / `changeme123` —
**change this password immediately** by adding yourself a new user and deleting
the seed account, since there's no self-service password reset yet).

The public site is at `http://localhost:3000/`.

## Deploying

### Option A — a normal Node host (recommended: Railway, Render, Fly.io, a VPS, Docker)

These keep a persistent filesystem, so both the SQLite file and uploaded images
(`public/uploads/`) survive between requests/deploys as long as you mount a
persistent volume for them (don't let them live only in the container's ephemeral
layer). Steps:

1. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` env vars.
2. `npm run build && npm run db:push && npm run seed && npm start`.
3. Mount a persistent volume over `./dev.db*` and `./public/uploads`.

### Option B — Vercel (serverless)

Vercel's filesystem is read-only/ephemeral outside `/tmp`, so **two things need to
change** before deploying there:

1. **Database**: swap SQLite for Postgres. In `db/schema.ts`, change the imports
   from `drizzle-orm/sqlite-core` to `drizzle-orm/pg-core` (and `sqliteTable` →
   `pgTable`), adjust the boolean/timestamp column helpers as noted in the comment
   at the top of that file, and change `db/client.ts` to use
   `drizzle-orm/node-postgres` with a `pg.Pool` pointed at `DATABASE_URL` (Vercel
   Postgres, Neon and Supabase all work). Nothing else in the app needs to change —
   every query goes through `db.select()/.insert()/.update()/.delete()` the same way.
2. **File uploads**: swap `lib/storage.ts`'s local-disk `saveUpload()` for an
   object-storage provider (Vercel Blob, S3, Cloudinary, UploadThing). Keep the
   same function signature (`(file, folder) => { url, filename }`) and nothing
   else in the app needs to change either.

## Extending it

- **Add a new editable field**: add a column in `db/schema.ts`, run
  `npm run db:push`, add it to the relevant form component and API route.
- **Add a new content type** (e.g. Certificates — the schema already has a
  `certificates` table ready to wire up): copy the `services` list/form/API
  pattern.
- **More shadcn components**: this project's `components/ui/*` files follow
  shadcn's own file shape, so `npx shadcn@latest add <component>` will drop new
  ones straight in.
- **Wire the real static site to this backend**: either (a) have `build.py` fetch
  from `/api/services`, `/api/projects` and `/api/settings` at build time instead
  of using hardcoded Python lists, or (b) replace the static site entirely with
  this app's public pages, styled to match the current design.

## Security notes before going live

- Change the seeded admin password immediately (add a new admin user via the
  Team page, then delete the seed account — there's no in-app password change
  yet, only account creation/removal).
- Set a strong, random `NEXTAUTH_SECRET` (`openssl rand -base64 32`).
- The upload endpoint restricts to image MIME types and 10MB per file, but add
  virus/content scanning before accepting public uploads if this is ever opened
  beyond your own team.

## Website enquiry form

The static site posts enquiries to `POST /api/enquiry` (JSON:
`name, email, phone, subject, enquiryType, message, page, website, t`).
Each enquiry is saved to the `enquiries` table first (visible under
**Enquiries** in the admin), then emailed to `MAIL_TO` with `Reply-To` set to
the visitor. If sending fails the enquiry is still kept and the visitor still
sees success; the admin list shows the email status (sent / failed / not
configured). `website` is a honeypot and `t` the form render time in ms
(submits under 3 seconds are ignored); a single IP is limited to 5 enquiries
per 10 minutes.

Set these environment variables on the server to enable email:

| Variable | Default | Notes |
| --- | --- | --- |
| `SMTP_HOST` | - | required |
| `SMTP_PORT` | `465` | |
| `SMTP_SECURE` | `true` if port is 465 | `false` for STARTTLS (587) |
| `SMTP_USER` | - | required |
| `SMTP_PASS` | - | required |
| `MAIL_FROM` | `SMTP_USER` | |
| `MAIL_TO` | `info@arfad.com.sa` | |

Without `SMTP_HOST`, `SMTP_USER` and `SMTP_PASS`, enquiries are stored with
status `not_configured` and no email is attempted.

## Clients

**Clients** in the admin manages the client logos shown on the public site
(add, rename, reorder with the arrow buttons, hide with the Active switch,
delete, and upload/replace a logo; uploads go through `/api/media` into
`public/uploads/clients/`). The static site reads `GET /api/clients` (no auth,
cached 60s) which returns `{ clients: [{ name, slug, logo, website }] }` for
active clients in order, so changes show up without a rebuild. Admin writes:
`POST /api/clients` (`{name, logoUrl?, website?, active?}`),
`PATCH|DELETE /api/clients/[id]` (`name, logoUrl, website, active, order`) and
`POST /api/clients/reorder` (`{ids: [...]}` in the desired order).

The 42 seeded clients are inserted by slug only if missing, so admin edits
survive redeploys (slugs stay fixed on rename, so the seed never re-adds a renamed client; unlike services/projects, which are upserted).
