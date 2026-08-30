# Store Rating App

A full-stack store rating platform featuring Role-Based Access Control (RBAC), interactive store ratings with average calculation, admin statistics, and dedicated store owner dashboards.

<p align="center">
  <img src="https://private-user-images.githubusercontent.com/175956361/643198513-b170676b-92a1-4f40-9eb3-f051871d7dfd.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgwNzg3ODgsIm5iZiI6MTc4ODA3ODQ4OCwicGF0aCI6Ii8xNzU5NTYzNjEvNjQzMTk4NTEzLWIxNzA2NzZiLTkyYTEtNGY0MC05ZWIzLWYwNTE4NzFkN2RmZC5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMFQwODI4MDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yODQ2NWViY2U0YzhhNTIzZjEzMjZkYTk2NDI5OWY2ODlkN2MwNTRhZmQzZGE3ODBlMzMzYTIzYWZiMzI1Y2JiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZnaWYifQ.tEZ1uxvIiL9aBd0sbkhCRy-fQrYSgNLdACzjYjWFOOU" alt="Store Rating App Demo" width="100%" />
</p>

## Features

- **Role-Based Access Control (RBAC)**: Unified authentication system supporting System Administrator, Store Owner, and Normal User roles.
- **Store Rating Engine**: 1-to-5 star rating system with instant submission, modification, and removal.
- **Admin Dashboard**: Comprehensive platform overview displaying total user count, store count, total ratings, and user management.
- **Store Owner Dashboard**: Dedicated portal for store owners to view submitted customer ratings, reviews, and store performance.
- **Search & Multi-Column Sorting**: Full-text store search by name and address, with column-based sorting on all table listings of stores and user (ADMIN Feature).
- **Strict Data Validation**: Backend Zod schema validation and frontend form checks with typescript type safety.
- **Secure Authentication**: JWT-based session management stored in HttpOnly cookies with bcrypt password hashing.

## Tech Stack

- **Backend**: ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- **Frontend**: ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
- **Database & ORM**: ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
- **Containers (PostgreSQL) & API Testing**: ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
- **Security & Validation**: JWT, bcrypt, Zod, cookie-parser
- **UI Components**: Radix UI, Lucide Icons, React Hot Toast, ShadCN UI


## Project Structure

```text
store-rating-app/
├── backend/
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── index.ts
│       ├── constants/
│       ├── controllers/
│       ├── lib/
│       ├── middlewares/
│       ├── routes/
│       ├── utils/
│       └── validators/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── api/               # Axios API clients & endpoints
│       ├── components/        # Reusable UI components & ShadCN UI Components
│       ├── constants/
│       ├── hooks/             # TanStack Query hooks (queries & mutations)
│       └── pages/
└── Store-Rating-App.postman_collection.json
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended package manager)
- PostgreSQL database (or Docker for running PostgreSQL container)

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_rating
JWT_SECRET=your_strong_jwt_secret_key
JWT_EXPIRES_IN=7d

POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=store_rating
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1/
```

## Setup & Installation

### 1. Database Setup

Using the provided Docker Compose in `backend/`:

```bash
cd backend
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
pnpm install

# Run database migrations
npx prisma migrate dev

# Start development server (auto-seeds initial admin)
pnpm dev
```

The backend API will run at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd ../frontend
pnpm install

# Start frontend development server
pnpm dev
```

The application will be accessible at `http://localhost:5173`.

### Initial Administrator Account

On backend startup, an initial admin user is automatically seeded:

- **Email**: `vasudev@gmail.com`
- **Password**: `Vasudev@123`
- **Role**: `ADMIN`

## Test with Postman

![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)

Import the included `Store-Rating-App.postman_collection.json` file into your Postman workspace to test all authentication, store, rating, and dashboard endpoints.

## Role-Based Access Control

| Feature | Normal User | Store Owner | System Administrator |
|---|:---:|:---:|:---:|
| Browse & Search Stores | ✔ | ✔ | ✔ |
| Submit / Modify / Delete Rating | ✔ | ✔ | ✔ |
| Update Personal Password | ✔ | ✔ | ✔ |
| Store Owner Dashboard (Reviews & Average) | ❌ | ✔ | ❌ |
| Admin Analytics Dashboard | ❌ | ❌ | ✔ |
| Add & Manage Stores | ❌ | ❌ | ✔ |
| Add & Manage Platform Users | ❌ | ❌ | ✔ |
| Change User Roles | ❌ | ❌ | ✔ |

## API Routes Documentation

Base URL: `/api/v1`

### Authentication (`/auth`)

- `POST /auth/register` — Register a new normal user (Public)
- `POST /auth/login` — Log in user and set HttpOnly JWT cookie (Public)
- `POST /auth/logout` — Clear auth session cookie
- `GET /auth/me` — Fetch current logged-in user profile

### Stores (`/store`)

- `GET /store` — List stores with search (`name`, `address`), sorting, and pagination
- `GET /store/:id` — Get store details with user's existing rating
- `POST /store` — Add a new store (Admin only)
- `PUT /store/:storeId` — Update store details (Admin only)
- `DELETE /store/:storeId` — Delete a store (Admin only)

### Ratings (`/rating`)

- `GET /rating/:storeId` — Get paginated customer ratings for a store
- `POST /rating/:storeId` — Submit or update rating (1-5 stars)
- `DELETE /rating/:storeId` — Remove user's rating for a store

### User Management (`/user`)

- `POST /user/add-user` — Create user with a specific role (Admin only)
- `PATCH /user/update-role` — Update user role (Admin only)
- `POST /user/update-password` — Change password for logged-in user

### Dashboard (`/dashboard`)

- `GET /dashboard/admin` — Total counts for users, stores, and ratings (Admin only)
- `GET /dashboard/admin/users` — Filtered and sorted platform users list (Admin only)
- `GET /dashboard/owner/ratings` — Store owner's ratings, reviews, and average score (Store Owner only)
