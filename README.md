# Rent Desk

## Overview
Rent‑Desk is a full‑stack **room‑rental management system** designed for property owners, tenants, and administrators. It provides a web‑based interface for managing properties, handling leases, tracking payments, and processing maintenance requests.

## Features
- **Multi‑tenant management** – create, edit, and view tenant profiles.
- **Room inventory** – add rooms, set pricing, and monitor occupancy status.
- **Lease & contract handling** – generate lease agreements and track expiration dates.
- **Payment workflow** – QR‑code payment modal, receipt upload, and status tracking (Unpaid → Pending Verification → Settled).
- **Maintenance tickets** – tenants can submit repair requests; admins can approve, schedule, and resolve them.
- **Role‑based dashboard** – separate admin and tenant portals with intuitive navigation.
- **RESTful API** – backend services built with TypeScript, Prisma ORM, and Supabase for data persistence.
- **Responsive UI** – frontend built with Next.js (customized version), TypeScript, and modern CSS.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Node.js, TypeScript, Express, Prisma, Supabase |
| Database | PostgreSQL (via Supabase) |


## Getting Started
### Prerequisites
- **Node.js** (v20 or later)
- **npm**
- **Supabase** account with a PostgreSQL project
- **Git**

### Installation
```bash
# Clone the repository
git clone https://github.com/ittiphon17/rent-desk.git
cd rent-desk

# Install dependencies for both backend and frontend
npm install   # installs root workspace deps
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Configure Environment
Create a `.env` file in `backend` with your Supabase credentials:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>
SUPABASE_KEY=your-supabase-key
```
The frontend can use the same `.env` (or `NEXT_PUBLIC_` variables) for API base URLs.

### Running the Application
```bash
# Start backend (development mode)
cd backend
npm run dev
# Backend will be available at http://localhost:4000

# In a new terminal, start the frontend
cd ../frontend
npm run dev
# Frontend will be available at http://localhost:3000
```

### Building for Production
```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd ../frontend && npm run build && npm start
```