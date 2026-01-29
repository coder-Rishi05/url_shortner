# URL Shortener Backend (Auth-first Architecture)

## 📌 Project Overview

This project is a **backend-first URL Shortener** built with a clean, scalable architecture. The focus is not just on making it work, but on understanding **why each design decision exists**, so the project can scale and also be defended confidently in interviews.

This repository is being developed **iteratively**:

* **V1**: Core auth + DB foundation (current)
* **V2**: URL shortener core logic
* **V3**: Analytics, rate limiting, expiry, scaling concepts

---

## 🎯 Current Stage (What exists right now)

* Environment configuration using `dotenv`
* MongoDB connection via Mongoose
* Auth-first data modeling
* User schema designed with security & scalability in mind
* Clear separation of concerns (models, routes, controllers)

---

## 🧠 High-Level Project Flow (Current)

```text
Client Request
   ↓
Express Server (server.js)
   ↓
Environment Variables Loaded (.env)
   ↓
MongoDB Connection
   ↓
Auth Layer (User model + routes)
   ↓
Business Logic (URL logic – upcoming)
```

---

## 🗂️ Folder Structure (Current)

```text
src/
│
├─ models/
│   └─ user.model.js
│
├─ routes/
│   ├─ auth.routes.js   (planned)
│   └─ url.routes.js    (planned)
│
├─ controllers/
│   ├─ auth.controller.js (planned)
│   └─ url.controller.js  (planned)
│
├─ middleware/
│   └─ auth.middleware.js (planned)
│
├─ app.js
└─ server.js
```

---

## 🔐 Authentication Strategy (Planned)

* **Signup** → create user with hashed password
* **Login** → verify credentials + issue JWT
* **Protected Routes** → JWT-based middleware
* **Authorization** → role-based (`user`, `admin`)

JWT is **stateless**, so no tokens are stored in the database.

---

## 📦 Database Models (Current)

### User Model (Implemented)

Purpose:

* Authentication
* Authorization
* Ownership reference for URLs

A separate `ShortUrl` model will be introduced later to handle business logic.

---

## 🚀 Development Philosophy

* **Design before code**
* **Minimal but extensible schemas**
* **Security by default**
* **V1 stability > feature overload**

---

## 📍 Next Milestones

1. Signup & Login route implementation
2. Auth middleware (JWT verification)
3. Short URL schema & redirect flow
4. Error handling & validation standardization

---

> This README describes *what the project does* and *how the flow works*.
> For **deep explanations, interview notes, and design reasoning**, see `NOTES.md`.
