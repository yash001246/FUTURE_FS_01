# Portfolio Website — HTML/CSS/JS + Node.js + MongoDB

A full-stack personal portfolio built with plain HTML, CSS, and JavaScript on the
frontend (no framework, no build step) and a Node.js/Express/MongoDB backend that
handles the contact form, a blog, and project updates.

## What's inside

```
portfolio-vanilla/
├── public/          Static frontend — open directly or serve with any static server
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── data.js      ← edit this to change your name, bio, skills, etc.
│       ├── config.js     ← API base URL
│       └── main.js       ← renders content, handles nav/animation/forms/API calls
└── server/           Express + MongoDB backend
    ├── models/        Message, Project, BlogPost (Mongoose schemas)
    ├── routes/        /api/contact, /api/projects, /api/blog
    ├── scripts/seed.js   sample data loader
    └── server.js
```

**Sections on the site:** Home / Hero · About & background · Skills & tech stack ·
Projects (including a Future Interns task log) · Blog · Contact form.

## Quick start

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI
npm run seed                # optional: loads sample projects & blog posts
npm run dev                 # http://localhost:5000
```

You need a MongoDB instance:
- **Local:** install MongoDB Community Edition, then use `MONGO_URI=mongodb://localhost:27017/portfolio`
- **Free cloud:** create a free cluster on MongoDB Atlas and paste its connection string into `MONGO_URI`

Without `MONGO_URI` set, the server still starts (so you can preview the static
pages), but the contact form, project list, and blog will show connection errors
until a database is attached.

### 2. Frontend

The frontend is plain static files — no build step. Two ways to run it:

**Option A — one server for everything (simplest):**
The Express server already serves `public/` as static files. Once `npm run dev`
is running in `server/`, just open `http://localhost:5000` in your browser.

**Option B — separate dev server (useful with live-reload tools):**
Serve `public/` with any static file server, e.g.:
```bash
cd public
npx serve .        # or: python3 -m http.server 5173
```
Then open the printed URL. Make sure `CLIENT_URL` in `server/.env` matches it
(for CORS) and `API_URL` in `public/js/config.js` points at `http://localhost:5000`.

### 3. Try it end-to-end

Fill out the contact form on the site. On success, the message is saved to your
MongoDB `messages` collection. Inspect it with:

```bash
curl http://localhost:5000/api/contact
```

## Customizing content

- **Name, bio, skills, Future Interns tasks, experience, contact links:** all in
  `public/js/data.js`. Edit and refresh — no build step.
- **Projects & blog posts:** stored in MongoDB, fetched live by the frontend. Use
  the API directly (see below) or extend `scripts/seed.js` to add your own.

## API reference

| Method | Route              | Description                            |
|--------|--------------------|------------------------------------------|
| GET    | `/api/contact`     | List all submitted messages             |
| POST   | `/api/contact`     | Submit a new contact message            |
| GET    | `/api/projects`    | List all projects                       |
| GET    | `/api/projects/:id`| Get a single project                    |
| POST   | `/api/projects`    | Add a project                           |
| PUT    | `/api/projects/:id`| Update a project                        |
| DELETE | `/api/projects/:id`| Delete a project                        |
| GET    | `/api/blog`        | List published blog posts               |
| GET    | `/api/blog/:slug`  | Get a single post by slug               |
| POST   | `/api/blog`        | Create a post (slug auto-generated)     |
| PUT    | `/api/blog/:id`    | Update a post                           |
| DELETE | `/api/blog/:id`    | Delete a post                           |

The contact route is rate-limited (5 submissions per 15 minutes per IP) to prevent spam.

Example — adding a blog post with `curl`:
```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{"title":"My first post","content":"Hello world.","tags":["intro"]}'
```

## Deployment notes

- **Simplest path:** deploy the `server/` folder (which also serves `public/`) as
  a single app to Render, Railway, or Fly.io. Set `MONGO_URI` as an environment
  variable. One process, one URL.
- **Split deployment:** host `public/` as a static site (Netlify, Vercel, GitHub
  Pages) and the `server/` API separately. Update `API_URL` in
  `public/js/config.js` to point at the deployed backend, and set `CLIENT_URL`
  in the backend's env to the deployed frontend's URL (for CORS).
- **Database:** MongoDB Atlas free tier works well for a project like this.

## Tech stack

**Frontend:** HTML5, CSS3 (hand-written, no framework), vanilla JavaScript (ES6+)
**Backend:** Node.js, Express, Mongoose
**Database:** MongoDB
