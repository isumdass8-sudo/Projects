# SL-ATM Finder — Sri Lanka ATM & Banking Service Locator

A full-stack web app to search Sri Lankan banks, find the nearest ATM by
GPS location, view ATM details, and get map-based directions.

**Stack:** React (Vite) + Tailwind + Leaflet · Node.js/Express · MySQL

This is Phase 1 + Phase 2 of the full feature set described in the project
brief — the core locator, search, filters, favorites, feedback, and
reporting are all implemented. Phase 3 (admin dashboard UI, CSV import
UI, PWA, QR codes) is scaffolded on the backend but not yet built out on
the frontend — see "What's next" at the bottom.

## Project structure

```
sl-atm-finder/
├── backend/          Node.js/Express API
│   ├── src/
│   │   ├── config/       MySQL connection pool
│   │   ├── models/       DB query layer (Bank, ATM, User, Favorite, Feedback, Report...)
│   │   ├── controllers/  Request handlers
│   │   ├── routes/       Express routers
│   │   ├── middleware/   JWT auth
│   │   ├── scripts/      OSM data fetch/import scripts
│   │   └── server.js     App entry point
│   └── .env.example
├── database/
│   ├── schema.sql        Full table definitions + district/bank seed data
│   └── seed_sample.sql    ~18 hand-picked sample ATMs for quick testing
└── frontend/          React app (Vite)
    └── src/
        ├── api/           Axios client + endpoint helpers
        ├── components/    Navbar, SearchBar, MapView, ATMCard, NearestBoard, FilterPanel
        ├── context/       Auth context (JWT)
        ├── pages/         Home, Search, MapPage, ATMDetails, Login, Register, Favorites, Emergency
        └── utils/         useGeolocation hook
```

## 1. Database setup

You need MySQL 8+ running locally.

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_sample.sql   # optional but recommended for testing
```

This creates the `sl_atm_finder` database, all tables, the 25 Sri Lankan
districts, all 16 major banks, and (if you ran the seed file) ~18 sample
ATMs across Colombo, Negombo, Kandy, Galle, Kurunegala, and Jaffna so you
have something to search/test against immediately.

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MySQL password and a random `JWT_SECRET`:

```
DB_PASSWORD=your_mysql_password
JWT_SECRET=some_long_random_string
```

Then start it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

Visit `http://localhost:5000/api/health` — you should see `{"status":"ok"}`.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. It talks to the API at
`http://localhost:5000/api` by default — override with a `.env` file
containing `VITE_API_URL=http://your-backend-url/api` if needed.

## 4. Getting real ATM data from OpenStreetMap

The seed file only has ~18 test ATMs. To pull real, live ATM/branch
locations from OpenStreetMap for major banks:

```bash
cd backend
npm run fetch-osm     # queries the free Overpass API, saves to backend/data/osm-atms.json
npm run import-osm    # imports that JSON into your MySQL database
```

**Important:** OSM's ATM tagging in Sri Lanka is inconsistent — coverage
is much better in Colombo than in rural areas, and some entries will be
missing addresses or coordinates that are slightly off. Always open
`backend/data/osm-atms.json` and spot-check it before importing. Treat
this as a real (if imperfect) starting dataset, not ground truth — it's
still far faster than typing in thousands of ATMs by hand, and you can
supplement gaps with your own manual entries or a CSV bulk-import
(the `POST /api/atms/bulk` endpoint is ready for this — you'd build a CSV
upload UI in the admin panel to feed it).

## 5. Creating an admin user

There's no signup UI for admin accounts (by design). Register a normal
account through the app, then promote it manually:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Admin-only endpoints (create/update/delete banks & ATMs, bulk import,
dashboard stats, report management) are all protected by the
`requireAdmin` middleware and ready to use via the API — building the
admin dashboard UI is one of the "what's next" items below.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/banks` | List all banks |
| GET | `/api/banks/search?q=` | Search banks by name |
| GET | `/api/atms/search?bank=&city=&district=&is24Hours=...` | Filtered ATM search |
| GET | `/api/atms/nearest?lat=&lng=&radiusKm=&limit=` | Nearest ATMs (Haversine) |
| GET | `/api/atms/emergency?lat=&lng=` | 24hr ATMs within 2km |
| GET | `/api/atms/route?originLat=&originLng=&destLat=&destLng=&bank=` | ATMs along a travel route |
| GET | `/api/atms/:id` | ATM details |
| POST | `/api/atms/:id/feedback` | Submit a rating (auth required) |
| POST | `/api/atms/:id/report` | Report a problem |
| POST | `/api/auth/register` / `/api/auth/login` | Auth |
| GET/POST/DELETE | `/api/user/favorites` | Manage favorites (auth required) |
| GET | `/api/admin/stats` | Dashboard stats (admin only) |

## What's next (Phase 3 — not yet built)

- Admin dashboard UI (charts for most-searched bank, district ATM counts, etc. — the `/api/admin/stats` endpoint already returns this data)
- CSV bulk-import UI in the admin panel (backend endpoint `POST /api/atms/bulk` is ready)
- Route-planning UI (backend logic in `ATM.findAlongRoute` is ready — needs an origin/destination picker + map overlay)
- QR codes per ATM (linking to `/atm/:id`)
- PWA support (manifest + service worker) and dark mode
- Deploying: frontend to Vercel, backend to Render, as suggested in the original brief

## Notes on accuracy

The sample seed data uses approximate city-center coordinates, not
verified real ATM locations — good for testing search/nearest-ATM logic,
not for production use. The OSM import gives you real (if imperfect)
data. For a final year project demo, real OSM data + your own spot-fixes
will look far more credible to a lecturer than made-up coordinates.
