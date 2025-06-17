# 01_general_setup.md

## ✅ Project Initialization

- A NestJS project has been successfully created.
- All required REST modules have been generated without `.spec.ts` files.
- Project structure is modular and organized.

---

## 🐳 Docker + MongoDB Setup

### Docker

- Set up `Dockerfile` to containerize the NestJS app.
- Create a `docker-compose.yml` file to:
  - Run the NestJS app container
  - Run a MongoDB service container
- Configure health checks and restart policies.
- Use multi-stage builds if needed for production.

### MongoDB

- Integrate MongoDB using **Mongoose** (`@nestjs/mongoose`).
- Use environment variables to define DB connection URI.
- Add a dedicated `database.module.ts` for connection logic.
- Ensure models and schemas are set up using Mongoose decorators.

---

## ⚙️ Environment Configuration

- Use `.env` and `@nestjs/config` to manage environment variables.
- Required environment variables:
  - `MONGO_URI`
  - `PORT`
  - `JWT_SECRET`
  - `FRONTEND_URL`, etc.
- Load config using a centralized `ConfigModule.forRoot()` setup.

---

## 🛡️ Global Application Configuration

- Enable CORS and configure it securely.
- Add `helmet` for security headers.
- Optionally add rate-limiting via `@nestjs/throttler`.
- Use `ValidationPipe` globally for DTO validation.
- Add global exception filters for consistent error handling.

---

## 🧩 Folder & Code Structure Guidelines

- Use feature-based folder organization (already done).
- Add common folders:
  - `/configs` – app, db, etc.
  - `/shared` – common decorators, pipes, guards, interfaces
  - `/utils` – utility functions or helpers
- Clean and minimal imports with aliases if necessary.

---

## 🧪 Dev & Deployment Ready Setup

- The app should be fully functional inside Docker (dev mode).
- All environment configs and DB connections should work.
- Docker should be the primary method of running in dev/staging.
- Test DB connection and Nest app with `docker-compose up`.

---

## ❌ Not Included in This Step

> The following will be handled in later task files:

- Auth, donation, payments, tasks logic
- Uploads and media processing
- Admin and user flows
