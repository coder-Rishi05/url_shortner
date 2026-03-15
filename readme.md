# URL Shortener Backend (Auth-first Architecture)

## 📌 Project Overview

This project is a **backend-first URL Shortener** built with a clean, scalable architecture. The focus is not just on making it work, but on understanding **why each design decision exists**, so the project can scale and also be defended confidently in interviews.

This repository is being developed **iteratively**:

- **V1**: Core auth + DB foundation (current)
- **V2**: URL shortener core logic
- **V3**: Analytics, rate limiting, expiry, scaling concepts

---

## 🎯 Current Stage (What exists right now)

- Environment configuration using `dotenv`
- MongoDB connection via Mongoose
- Auth-first data modeling
- User schema designed with security & scalability in mind
- Clear separation of concerns (models, routes, controllers)

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

├── 📁 src
│ ├── 📁 controllers
│ │ └── 📄 auth.controller.js
│ ├── 📁 db
│ │ └── 📄 db.js
│ ├── 📁 middlewares
│ ├── 📁 models
│ │ └── 📄 userModel.js
│ ├── 📁 routes
│ │ ├── 📄 auth.routes.js
│ │ └── 📄 url.routes.js
│ ├── 📁 utils
│ │ ├── 📄 constant.js
│ │ ├── 📄 env.js
│ │ └── 📄 validator.js
│ ├── 📁 validators
│ │ └── 📄 auth.validator.js
│ └── 📄 server.js
├── ⚙️ .gitignore
├── 📄 app.js
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── 📝 readme.md



```

---

## 🔐 Authentication Strategy (Planned)

- **Signup** → create user with hashed password
- **Login** → verify credentials + issue JWT
- **Protected Routes** → JWT-based middleware
- **Authorization** → role-based (`user`, `admin`)

JWT is **stateless**, so no tokens are stored in the database.

---

### rate limiting and helmet

it help to protect from brute force attack.

setting limit on user request
   1 minutes / 15 request

### Features

- User registration and login with JWT stored in httpOnly cookies
- Credit-based system — each user gets a set number of credits to create short URLs
- Short URL generation with redirect support
- Deactivate URLs without deleting them
- Admin role with full control over users and credit requests
- Credit request and approval flow — users can request more credits, admins approve or reject
- Protected routes using middleware (authentication + role check)

### Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Auth: JSON Web Tokens (JWT) via httpOnly cookies
- Deployment: Render

