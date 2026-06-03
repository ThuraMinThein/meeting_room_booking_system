# Meeting Room Booking System

A full-stack meeting room booking application with a **NestJS** REST API backend and a **React + Vite** frontend. The system supports role-based access control, conflict-safe booking creation, and administrative management.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [Time Handling](#time-handling)
- [Booking Rules & Overlap Detection](#booking-rules--overlap-detection)
- [API Reference](#api-reference)
- [Frontend Features](#frontend-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer    | Technology                                                   |
|----------|--------------------------------------------------------------|
| Backend  | NestJS 11, TypeORM, PostgreSQL, Passport JWT, Argon2, Helmet |
| Frontend | React 19, Vite, TypeScript, TailwindCSS v4, shadcn/ui, Zustand, TanStack Query, Axios |
| Tooling  | date-fns, class-validator, class-transformer                 |

---

## Project Structure

```
meeting_booking/
├── backend/          # NestJS API
│   └── src/
│       ├── auth/         # JWT auth, login, guards, decorators
│       ├── bookings/     # Booking CRUD, overlap detection, summary
│       ├── users/        # User management (admin-only)
│       ├── helpers/      # Pagination, pipes, exception filters
│       └── utils/        # Enums, serializer groups, constants
└── frontend/         # React + Vite SPA
    └── src/
        ├── api/          # Axios API clients
        ├── pages/        # Login, Bookings, Users pages
        ├── hooks/        # Custom React hooks (TanStack Query)
        ├── store/        # Zustand auth store
        ├── components/   # Reusable UI components
        └── layout/       # App shell / navigation
```

---

## Roles & Permissions

The system has three roles, enforced entirely on the **backend** via JWT claims and a `RoleGuard`.

| Role    | Description                                                              |
|---------|--------------------------------------------------------------------------|
| `Owner` | Highest privilege. Can view all bookings, user lists, and the summary.   |
| `Admin` | Can manage users (create, update role, delete) and view summaries.       |
| `User`  | Can create and delete **their own** bookings only.                       |

> **Note:** A regular `User` who attempts to delete another user's booking receives a `403 Forbidden` response. All permission checks are enforced server-side; the frontend reflects these rules in the UI.

---

## Time Handling

### Storage: `timestamptz` (UTC)

All booking times are stored as PostgreSQL `TIMESTAMP WITH TIME ZONE` (`timestamptz`). This means:

- The database always persists times **in UTC**.
- TypeORM maps these columns to JavaScript `Date` objects, which are natively UTC.
- No manual timezone conversion is performed on the backend.

### Transmission: ISO 8601 Strings

- The API accepts `startTime` and `endTime` as **ISO 8601 date-time strings** (validated by `@IsDateString()` from `class-validator`).
- Clients should send times in UTC or include a timezone offset (e.g., `2025-01-15T09:00:00.000Z` or `2025-01-15T15:30:00+06:30`). PostgreSQL normalises them to UTC automatically.
- The API returns times as ISO 8601 strings. The frontend is responsible for displaying them in the user's local timezone using `date-fns` or the browser's `Intl` API.

### Assumption

All overlap comparisons are done using the UTC timestamps as stored. There is no concept of a "local room timezone" — the single meeting room operates on the universal timeline. Whatever timezone the client sends, it is converted to UTC and compared uniformly.

---

## Booking Rules & Overlap Detection

### Rule 1 — `startTime` Must Be Before `endTime`

```
startTime >= endTime  →  400 Bad Request
```

Validated in `BookingsService.create()` before any database access.

### Rule 2 — `startTime` Must Be in the Future

```
startTime < now()  →  400 Bad Request
```

Past bookings are rejected immediately.

### Rule 3 — No Overlapping Bookings

The overlap check uses the **exclusive boundary** (half-open interval) algorithm:

```sql
booking.startTime < :endTime
AND
booking.endTime   > :startTime
```

This single condition correctly handles **all** overlap cases:

| Scenario                              | Example (new booking: 10:00–11:00)    | Detected? |
|---------------------------------------|---------------------------------------|-----------|
| Identical range                       | Existing: 10:00–11:00                 |   Yes     |
| Partial overlap (left)                | Existing: 09:30–10:30                 |   Yes     |
| Partial overlap (right)               | Existing: 10:30–11:30                 |   Yes     |
| New range fully inside existing       | Existing: 09:00–12:00                 |   Yes     |
| Existing range fully inside new       | Existing: 10:15–10:45                 |   Yes     |
| **Back-to-back (adjacent, no gap)**   | Existing: 09:00–**10:00** (ends exactly when new starts) |   No — allowed |
| **Back-to-back (adjacent, no gap)**   | Existing: **11:00**–12:00 (starts exactly when new ends) |   No — allowed |

### Back-to-Back Booking Logic

Two meetings are **not** considered overlapping if one ends at the exact moment the other begins. This is intentional: a meeting ending at `10:00` and a meeting starting at `10:00` occupy distinct, non-overlapping intervals.

- `existingEnd > newStart` is **strict greater-than** — equality (`existingEnd == newStart`) is `false`, so the check passes.
- `existingStart < newEnd` is **strict less-than** — equality (`existingStart == newEnd`) is `false`, so the check passes.

Both conditions must be `true` for an overlap to be detected. If the new booking starts exactly when another ends (or ends exactly when another starts), **neither condition is satisfied** and the booking is allowed.

### Concurrency Safety

The overlap check and booking insert are wrapped in a **`SERIALIZABLE` database transaction** to prevent race conditions. Two simultaneous requests for the same time slot cannot both pass the overlap check.

---

## API Reference

All routes are prefixed with `/api/v1/`.

### Auth

| Method | Route                 | Auth     | Description                          |
|--------|-----------------------|----------|--------------------------------------|
| `POST` | `/auth/login`         | Public   | Log in; returns JWT access token     |
| `GET`  | `/auth/me`            | JWT      | Returns the authenticated user       |
| `POST` | `/auth/seed/admin`    | Public   | Seeds the initial admin account      |

### Bookings

| Method   | Route                     | Auth            | Roles          | Description                                 |
|----------|---------------------------|-----------------|----------------|---------------------------------------------|
| `POST`   | `/bookings`               | JWT             | Any            | Create a booking                             |
| `GET`    | `/bookings`               | JWT             | Any            | List all bookings (paginated)               |
| `GET`    | `/bookings/date/:date`    | JWT             | Any            | List bookings for a specific date           |
| `GET`    | `/bookings/user/:userId`  | JWT             | Owner, Admin   | List bookings for a specific user           |
| `GET`    | `/bookings/summary`       | JWT             | Owner, Admin   | Monthly booking count per user              |
| `DELETE` | `/bookings/:id`           | JWT             | Any*           | Delete a booking (* owner check enforced)   |

> **Delete permission:** A `User` can only delete their own booking. `Admin` and `Owner` can delete any booking.

### Users

All `/users` routes require the `Admin` role.

| Method   | Route               | Description                    |
|----------|---------------------|--------------------------------|
| `POST`   | `/users`            | Create a new user              |
| `GET`    | `/users`            | List all users (paginated, filterable by role/search) |
| `GET`    | `/users/full`       | List all users without pagination (Owner, Admin) |
| `PATCH`  | `/users/:id/role`   | Update a user's role           |
| `DELETE` | `/users/:id`        | Delete a user (cascades bookings) |

### Pagination & Query Parameters

- `page` (default: `1`) — page number
- `limit` (default: `10`) — items per page
- `search` — partial name/username search (users endpoint)
- `roles` — comma-separated role filter (users endpoint)
- `date` — `YYYY-MM-DD` for date-scoped endpoints

### Error Responses

All validation and permission errors return structured JSON:

```json
{
  "statusCode": 400,
  "message": "startTime must be before endTime",
  "error": "Bad Request"
}
```

Common status codes: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`.

---

## Frontend Features

The React SPA communicates exclusively with the backend API via Axios.

| Feature                  | Available to          |
|--------------------------|-----------------------|
| Login as a user          | All                   |
| View current role        | All (displayed in UI) |
| Create a booking         | All authenticated     |
| View all bookings        | All authenticated     |
| Delete own booking       | User                  |
| Delete any booking       | Admin, Owner          |
| User management page     | Admin only            |
| Create / update / delete users | Admin only       |
| Monthly summary view     | Admin, Owner          |

- **Validation errors** (e.g., overlapping time, past start time) are surfaced directly from API responses as toast notifications.
- **Permission errors** (403) are shown inline with a clear message explaining the restriction.
- **Role indicator** is always visible in the navigation / header once logged in.
- Authentication state is managed with **Zustand** and persisted in `localStorage`. TanStack Query handles all server state caching and refetching.
