# 📋 Requirements – 10 Payments, Location, Admin, and User Flow

This file covers the requirements for payment processing, location tagging, administrative features, and summarizes the main user flow.

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

## 🧠 User Flow Summary

1. A user visits the app and donates anonymously or by logging in.
2. Donation is stored with or without donor info.
3. A task is created for the donation (cooking, delivery).
4. Staff completes the task and uploads video proof.
5. Proof is linked to the donation and visible to donor.
