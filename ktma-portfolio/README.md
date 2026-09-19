# KTMA — Kandy Tourism Marketing Association

A full-stack portfolio website for the Kandy Tourism Marketing Association (KTMA):
a responsive site showcasing the association, its executive committee, member
businesses, events, and a photo gallery, backed by a real API and database.

**Stack:** React (Vite) + Tailwind CSS · Node.js / Express · MySQL

---

## Project structure

```
ktma-portfolio/
├── frontend/          React (Vite) + Tailwind CSS client
├── backend/            Node.js + Express REST API
├── database/
│   └── schema.sql       MySQL schema + seed data
└── README.md
```

## Features

- **Home** — hero, mission & vision, featured destinations, latest event highlight, gallery preview
- **About** — association profile, mission & vision, objectives
- **Members** — executive committee (2026–2028) and a directory of member businesses
- **Events** — event list with a detail page and a filterable photo gallery per event
- **Gallery** — full photo gallery with category filters and a lightbox viewer
- **Contact** — validated inquiry form that POSTs to the API and is stored in MySQL, plus a map and contact details
- Fully responsive (mobile / tablet / desktop), accessible focus states, and basic SEO meta tags
- If the API isn't running, the frontend gracefully falls back to bundled seed data so the UI is never empty

---

## 1. Database setup

1. Make sure MySQL is installed and running locally.
2. Import the schema and seed data:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   This creates a `ktma_db` database with tables for committee members,
   business members, destinations, events, gallery images, and contact
   messages — pre-populated with the association's real content.

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ktma_db
```

Start the API:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`
to confirm it's up.

### API endpoints

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| GET    | `/api/destinations`        | Featured destinations                |
| GET    | `/api/destinations/:id`    | Single destination                   |
| GET    | `/api/members/committee`   | Executive committee                  |
| GET    | `/api/members/business`    | Member businesses                    |
| GET    | `/api/events`               | All events                            |
| GET    | `/api/events/:id`          | Event detail + its gallery images    |
| GET    | `/api/gallery?category=`   | Gallery images (optional filter)     |
| POST   | `/api/contact`              | Submit a contact/inquiry message      |

---

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` (defaults already point at the local API):

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Build for production

```bash
npm run build      # outputs to frontend/dist
npm run preview    # preview the production build locally
```

---

## Notes

- All photos and the logo used in this project were supplied by the client and
  are included under `frontend/src/assets/`.
- Colors, typography, and layout were custom-designed around the KTMA logo's
  palette (deep teal, gold, terracotta, forest green) rather than a generic
  template — see `frontend/tailwind.config.js` for the design tokens.
- The contact form includes both client-side and server-side validation, plus
  basic rate limiting on the API to prevent spam submissions.
- For a production deployment, remember to set `CLIENT_URL` (backend) and
  `VITE_API_URL` (frontend) to your real domains, and configure your host to
  serve `frontend/dist` with SPA fallback (all routes → `index.html`) since
  this is a client-side-routed React app.
