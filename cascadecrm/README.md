# Cascade CRM

A CRM built with Next.js (App Router), Prisma, and PostgreSQL. Manage accounts,
contacts, leads, opportunities, and tasks, with a sales pipeline kanban board,
activity timelines, and a dashboard.

## Features

- **Accounts & Contacts** — companies and people, with relationships between them.
- **Leads** — capture and qualify leads, then convert them into an Account,
  Contact, and (optionally) an Opportunity in one step.
- **Opportunities** — a drag-and-drop kanban board across pipeline stages
  (Qualification → Needs Analysis → Proposal → Negotiation → Closed Won/Lost).
- **Tasks** — assign and track to-dos against any record, or standalone.
- **Activity timelines** — log notes, calls, emails, and meetings on any record.
- **Dashboard** — pipeline value, win rate, stage/lead breakdowns, upcoming
  tasks, and recent activity.
- **Global search** — search across accounts, contacts, leads, and opportunities.
- **Auth** — email/password login and signup (NextAuth credentials provider).

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (a `docker-compose.yml` is included if you don't
  already have one running locally)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your database URL:

   ```bash
   cp .env.example .env
   ```

3. Start Postgres (skip if you already have one):

   ```bash
   docker compose up -d
   ```

4. Run migrations and seed demo data:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and sign in with the
   seeded demo account:

   - `admin@crm.dev` / `password123`
   - `rep@crm.dev` / `password123`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — run ESLint
- `npm run db:migrate` — run Prisma migrations
- `npm run db:seed` — seed demo data
- `npm run db:studio` — open Prisma Studio

## Tech stack

Next.js 15 (App Router, Server Actions) · TypeScript · Prisma · PostgreSQL ·
NextAuth v5 · Tailwind CSS · Recharts
