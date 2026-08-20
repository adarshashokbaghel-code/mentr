# Mentr

Mentr is a platform connecting students/parents with teachers and tutors — built with Next.js (App Router) on the frontend and a companion Express + MongoDB API for auth, profiles, matching, and admin operations.

Live site: [mentr.in](https://www.mentr.in)

## Features

**Authentication**
- Passwordless email OTP login/signup, with separate `faculty` (tutor) and `parent` (student) portals — a verified account is locked to its role.
- Rate-limited OTP sends (per-IP and per-email, resend cooldown, max attempts) backed by a TTL-purged Mongo session store.
- JWT session cookie issued on verification.

**Teacher/tutor profiles**
- Rich tutor listings: subjects, levels, languages, qualifications, experience, teaching modes (online / student's home / tutor's home), hourly rate, timezone-aware weekly availability, certifications, achievements, intro video, and social links.
- Separate lightweight parent/student profile.
- Per-slot availability toggling without resaving the full profile.

**Teacher discovery**
- Login-gated teacher directory and detail pages, enriched with the viewer's connection status.
- Programmatic SEO landing pages for search by subject, locality, exam prep, online tutoring, and city (including a dedicated UAE section).
- Interactive map-based search powered by Leaflet.
- Automatic profile-view tracking, surfaced to tutors as analytics.

**Student–teacher connections**
- Parent-initiated connection requests with a required intro message.
- Teacher-initiated outreach, gated to tutors who can prove the parent already viewed their profile.
- Shared inbox views for both sides (pending / accepted / declined), with contact info (WhatsApp number) revealed only after mutual acceptance.

**Requirements board (matching)**
- Parents post anonymous learning requirements (subject, level, location, budget, teaching mode, timeline) that auto-expire.
- Tutors browse an anonymized feed and pitch interest under a daily quota, keeping the board spam-resistant without a paid-credit system.
- Requirement owners see incoming tutor interest; tutors track their own sent pitches.

**Admin panel**
- Secret-key-gated dashboard (`ADMIN_SECRET_KEY`) with platform stats, user search/browse, and a templated bulk-email "messenger" for lifecycle/marketing emails.

**SEO & growth**
- Auto-generated sitemap index and `robots.txt`, covering core, subject, area, exam-prep, online, city, and per-teacher pages.
- Production-only Google Analytics integration.
- Persona- and city-specific landing pages (for parents, for teachers, comparison pages, pricing, how-it-works, FAQ, blog) for organic acquisition.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Express 5](https://expressjs.com) API server (`server/`)
- [MongoDB](https://www.mongodb.com) via Mongoose
- Tailwind CSS 4 + Radix UI
- JWT-based auth, Nodemailer for OTP/admin email

## Getting started

### Prerequisites

- Node.js 20+ (repo developed on Node 24)
- A MongoDB instance (local `mongod`, Docker, or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for sending OTP emails

### Setup

```bash
git clone https://github.com/adarshashokbaghel-code/mentr.git
cd mentr
npm install
cp .env.example .env
```

Fill in `.env` — at minimum `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, and `EMAIL_PASS`. See `.env.example` for the full list of variables and what each one does.

Then run both the Next.js frontend and the Express API together:

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API server: `http://localhost:5000` (or `BACKEND_PORT` if set)

### Other useful scripts

```bash
npm run build              # production build
npm run start               # run the production build
npm run lint                 # eslint
npm run seed:demo           # seed demo data into MongoDB
npm run seed:demo:reset    # wipe + reseed demo data
npm run db:wipe               # wipe the database (requires --confirm)
```

## Project structure

```
src/            Next.js App Router frontend (pages, components, hooks, lib)
server/         Express API — routes, models, middleware, services
scripts/        Seed data, DB maintenance, and SEO check scripts
public/         Static assets
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## Security

If you discover a security vulnerability, please see [SECURITY.md](./SECURITY.md) for how to report it responsibly — do not open a public issue.

## License

Licensed under the [MIT License](./LICENSE).
