# 📋 Requirements – 03 User, Authentication, and Security

This file details the requirements for user management, authentication methods, and overall application security.

---

## 🧑‍💼 User & Authentication

- Support email/password login and registration.
- Support Google OAuth sign-in.
- Hash passwords securely (bcrypt).
- Generate and return JWT tokens.
- Implement role-based access (donor, admin, cook, manager, volunteer).
- Allow profile update and role management by admin.

---

## 🔐 Security & Guards

- JWT-based route protection.
- Use custom `RolesGuard` for role-based access control.
- Allow certain endpoints to be public for anonymous use.
- Secure media access using signed tokens or public URLs.
