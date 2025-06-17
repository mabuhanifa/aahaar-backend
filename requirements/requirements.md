# 📋 Requirements List – Donation Platform Backend (NestJS + Mongoose)

This file outlines the full scope of requirements for building a donation-based backend system that allows users — both authenticated and anonymous — to feed needy people in rural Bangladesh. The stack includes NestJS, Mongoose (MongoDB), and Docker.

---

## 🧱 General Setup

- Create a NestJS project with Docker support.
- Use MongoDB with Mongoose for data modeling.
- Organize code using feature-based modules.
- Use environment variables for configuration (via @nestjs/config).
- Include support for background tasks (later via BullMQ or equivalent).

---

## 📦 Modules to Scaffold

The following modules should be created:

1. **auth** – Authentication using JWT and Google OAuth.
2. **users** – Manage all user types and roles.
3. **donations** – Donation logic and anonymous support.
4. **tasks** – Operational tasks generated from donations.
5. **staff** – Manage staff members (cook, manager, volunteer).
6. **media** – Video/image proof uploads and links.
7. **inventory** – Track ingredients and ration stock.
8. **notifications** – Send emails, WhatsApp, or SMS.
9. **payments** – Integrate Stripe or PayPal (real/placeholder).
10. **location** – Store delivery regions or districts.
11. **admin** – Role-based control panel endpoints.
12. **common** – Shared enums, pipes, decorators, guards, etc.

---

## 🧑‍💼 User & Authentication

- Support email/password login and registration.
- Support Google OAuth sign-in.
- Hash passwords securely (bcrypt).
- Generate and return JWT tokens.
- Implement role-based access (donor, admin, cook, manager, volunteer).
- Allow profile update and role management by admin.

---

## 🎁 Donations

- Allow 3 types of donations: feeding people, giving ration, donating a random amount.
- Support donations with or without authentication.
- Anonymous donations must still be stored in the database.
- Optional email capture for anonymous donors.
- Generate a unique reference ID for anonymous donors to track proof later.
- Store donation status (pending, in-progress, fulfilled, verified).
- Allow filtering donations by type, status, and donor.

---

## ✅ Tasks

- Convert donation actions into backend tasks:
  - Prepare food
  - Deliver ration
  - Record media
- Assign tasks to available staff.
- Track task status: not started, in progress, completed.
- Allow admin to manually or automatically assign tasks.

---

## 🧑‍🍳 Staff

- Staff roles include cook, manager, volunteer.
- Staff are created by admin or manager users.
- Assign tasks to staff with scheduling options.
- Track performance and task history.

---

## 🎥 Media

- Upload videos and photos as proof for each donation or task.
- Media must be linked to donation ID or anonymous reference ID.
- Only managers and admins can upload proof.
- Media should be visible to donors (based on access rules).

---

## 🧂 Inventory

- Store ingredients and supplies required to fulfill donations.
- Track stock levels of rice, lentils, oil, etc.
- Deduct ingredients automatically when tasks are marked complete.
- Send low-stock alerts to managers or admins.

---

## 🔔 Notifications

- Send notifications via email or WhatsApp:
  - Donation received
  - Proof uploaded
  - Task completed
- Allow enabling/disabling notifications per user or global settings.
- Queue notifications for async sending (with later job queue integration).

---

## 💳 Payments

- Accept payments via Stripe or PayPal (or mocked gateway).
- Track payment success and associate it with donations.
- Store transaction reference, amount, and method.
- Allow anonymous payments as well.

---

## 🌍 Location

- Allow tagging delivery areas (district, village, upazila).
- Each donation or task can be assigned a location.
- Staff can be assigned to specific regions.

---

## ⚙️ Admin Panel Features

- Admin can manage users, staff, inventory, and donations.
- Admin can assign roles and change donation statuses.
- Admin can upload or review media proof.
- Admin can filter, search, and export reports.

---

## 🔐 Security & Guards

- JWT-based route protection.
- Use custom `RolesGuard` for role-based access control.
- Allow certain endpoints to be public for anonymous use.
- Secure media access using signed tokens or public URLs.

---

## 🐳 Docker Requirements

- Use Docker and Docker Compose.
- Services: NestJS app, MongoDB, Redis (optional).
- Use `.env` file for configuration (ports, DB credentials, JWT secrets).

---

## 🧩 Additional Requirements

- Use Swagger or Postman for API documentation.
- Add basic unit and e2e tests.
- Modularize services for clarity.
- Log errors and activity properly.
- Prepare for scaling features like background jobs or dashboards.

---

## 🧠 User Flow Summary

1. A user visits the app and donates anonymously or by logging in.
2. Donation is stored with or without donor info.
3. A task is created for the donation (cooking, delivery).
4. Staff completes the task and uploads video proof.
5. Proof is linked to the donation and visible to donor.

---

This `requirements_list.md` file can be used as a base reference for generating each module, schema, controller, and service using GitHub Copilot, AI coding assistants, or team collaboration.
