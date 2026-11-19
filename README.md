# אהבות קטנות — coffee truck website

Next.js 16 site with a built-in content management system (CMS), event bookings and a newsletter.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Admin dashboard: **http://localhost:3000/admin**. The password is `ADMIN_PASSWORD` in `.env.local`.
See `.env.example` for every setting.

## What the backend does

| Feature | Where |
|---|---|
| Edit every text, list and block on the site (hero, menu, prices, weekly stops, story, gallery, events, footer, SEO) | `/admin` → *Website content* |
| Event booking requests from the website form, with status (new / contacted / confirmed / declined) and private notes | `/admin` → *Event bookings* |
| Newsletter signups from the footer, CSV export | `/admin` → *Newsletter* |
| Email alert for each booking / signup (Resend) | set `RESEND_API_KEY`, `NOTIFY_EMAIL`, `EMAIL_FROM` |

Saving in the admin updates the public site immediately (cache tag `content` is refreshed).

### Text conventions in the editor
- `*word*` → italic accent word
- New line in a headline → a separate animated line
- In the manifesto, `{cup}`, `{croissant}`, `{cookie}` insert an image pill

## Code map

- `src/lib/content/` — content types, defaults (the original copy) and the editor schema that also validates saves
- `src/server/` — database (`node:sqlite`, file at `data/app.db`), auth, email, rate limiting
- `src/app/api/bookings`, `src/app/api/subscribe` — public endpoints (validated, rate-limited, honeypot)
- `src/app/api/admin/export` — CSV downloads (admin only)
- `src/app/admin/` — dashboard page and server actions
- `scripts/logo/generate.cjs` — regenerates the logotype outlines

## Deploying

SQLite needs a persistent disk (e.g. a VPS, Railway or Fly.io volume). On serverless hosts like Vercel,
switch to Postgres by re-implementing the small functions in `src/server/content.ts` and `src/server/records.ts`.
The app needs **Node 24+** (pinned in `package.json` `engines`, `.node-version` and `.nvmrc`).

### Railway (recommended)

1. Push this folder to a GitHub repository.
2. railway.app → **New Project → Deploy from GitHub repo** → pick the repo.
   Railway builds with `npm run build` and starts with `npm start` (which listens on `$PORT`).
3. **Settings → Volumes → Add Volume**, mount path `/data`.
4. **Variables**:

   | Variable | Value |
   |---|---|
   | `DATABASE_PATH` | `/data/app.db` |
   | `ADMIN_PASSWORD` | a long, new password |
   | `SESSION_SECRET` | 32+ random characters (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `RESEND_API_KEY`, `NOTIFY_EMAIL`, `EMAIL_FROM` | optional, for real email alerts |

5. **Settings → Networking** → generate a domain, or add your own and set the DNS record it shows.

Run a single instance: login rate limiting is kept in memory, and SQLite expects one server process.
The local `data/app.db` is not uploaded, so the live site starts from the original content.

### Any VPS

```bash
npm ci && npm run build
DATABASE_PATH=/var/lib/coffee-truck/app.db ADMIN_PASSWORD=… SESSION_SECRET=… PORT=3000 npm start
```

Keep it running with a process manager (systemd or pm2) behind a reverse proxy with HTTPS (Caddy or nginx),
and back up the database file regularly.
