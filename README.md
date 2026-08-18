# Ledger — Lead CRM

A small CRM for managing leads from your website's contact form: list leads,
move them through a status pipeline, and log notes/follow-ups on each one.

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express, JWT auth for admins
- **Database:** MongoDB (Mongoose)

## Project layout

```
crm-app/
  backend/     Express API + MongoDB models
  frontend/    React admin dashboard
  website-snippet/   Example contact-form HTML that posts leads into the CRM
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

- `MONGO_URI` — your MongoDB connection string (local `mongodb://127.0.0.1:27017/crm`,
  or an Atlas URI).
- `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`).
- `LEAD_INTAKE_KEY` — a random string your public website uses to submit new
  leads without an admin login.
- `CLIENT_URL` — where the frontend runs (`http://localhost:5173` in dev).

Create your first admin user:

```bash
node scripts/createAdmin.js "Your Name" you@example.com "YourPassword123"
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API runs on `http://localhost:5000` by default.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. In dev, Vite proxies `/api` to
`http://localhost:5000` (see `vite.config.js`), so no CORS setup is needed
locally. Sign in with the admin account you created above.

For production, `npm run build` outputs static files in `frontend/dist/`
that you can serve from any static host — just make sure `CLIENT_URL` in the
backend `.env` matches wherever it's hosted, and update the API base URL if
you're not proxying through the same domain.

## 3. Connecting your website's contact form

Leads come in through a public, unauthenticated-by-JWT endpoint that's
protected by a shared intake key instead:

```
POST /api/leads/intake
Headers: x-intake-key: <LEAD_INTAKE_KEY>
Body: { "name", "email", "phone", "message", "source" }
```

See `website-snippet/contact-form-example.html` for a working example. Keep
the intake key on your server/build config, not committed to source control.

## How the pieces fit together

- **Auth:** `POST /api/auth/register` (public, rate-limited) lets anyone create
  a team account from the `/register` page — the very first account created
  becomes `admin`, every account after that defaults to the more limited
  `agent` role. `POST /api/auth/login` returns a JWT, stored in `localStorage`
  and sent as `Authorization: Bearer <token>` on every dashboard request.
  `middleware/authMiddleware.js` verifies it on every protected route.
  You can still create accounts from the command line with
  `node scripts/createAdmin.js` if you'd rather not leave signup open.
- **Leads API** (`routes/leadRoutes.js`):
  - `GET /api/leads` — list, with `status`, `search`, `page`, `limit` query params
  - `GET /api/leads/:id` — single lead
  - `POST /api/leads` — manual entry (admin dashboard)
  - `POST /api/leads/intake` — public website submissions (intake key)
  - `PATCH /api/leads/:id/status` — move through new → contacted → converted → lost
  - `POST /api/leads/:id/notes` — add a note, optionally with a follow-up date
  - `DELETE /api/leads/:id`
- **Data model** (`models/Lead.js`): name, email, phone, message, source,
  status, an embedded array of timestamped notes (each with an optional
  follow-up date and the admin who wrote it), and an optional `assignedTo`.

## Security notes for production

- Change `JWT_SECRET` and `LEAD_INTAKE_KEY` to long random values — the
  `.env.example` placeholders are not safe to use as-is.
- Put the API behind HTTPS.
- The login route and the public intake route both have basic rate limiting
  (`express-rate-limit`) to slow down brute-force and spam.
- Passwords are hashed with bcrypt (12 rounds); plaintext passwords are never
  stored.
- Consider adding a "forgot password" flow and per-admin roles before giving
  this to a larger team — the `Admin` model already has a `role` field
  (`admin` / `agent`) you can build permission checks on.
- Signup is open to anyone who reaches `/register` — fine for an internal
  tool behind a private URL/VPN, but if the CRM will be public-facing,
  either remove the `/register` page and rely on `scripts/createAdmin.js`,
  or add an invite-code / admin-approval step before granting access.
