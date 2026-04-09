# URL Shortener — Features File
> **Purpose:** Give this file to any AI assistant along with your current resume to generate strong, accurate resume bullet points for the URL Shortener project.
> **Developer:** Rishabh Singh | rawatrishi3@gmail.com | github.com/coder-Rishi05

---

## RESUME ENTRY HEADER (copy-paste ready)

**URL Shortener** — Full Stack | React.js, Node.js, Express.js, MongoDB, JWT | [Live Demo](https://url-frontend-fhzz.onrender.com)

---

## TECH STACK

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js (ES Modules) | REST API server |
| MongoDB + Mongoose | Database — users, URLs, credit requests |
| JWT (jsonwebtoken) | Stateless auth — token stored in httpOnly cookie |
| bcrypt | Password hashing (10 salt rounds) |
| cookie-parser | Cookie extraction in middleware |
| validator.js | Email, URL, and password strength validation |
| express-rate-limit | Rate limiting middleware (implemented, currently commented out) |
| cors | Multi-origin whitelist (localhost + Render frontend) |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | SPA frontend |
| React Router v6 | Client-side routing with protected routes |
| Axios | API calls with `withCredentials: true` for cookie auth |
| Tailwind CSS + DaisyUI | Styling |
| Context API | Global auth state management |

---

## BACKEND FILE STRUCTURE

```
url-shortener/
├── app.js                          ← Express setup, CORS, cookie-parser, route registration
├── src/
│   ├── server.js                   ← DB connection + server startup
│   ├── controllers/
│   │   ├── auth.controller.js      ← signup, login, logout, getCurrentUser
│   │   ├── url.controller.js       ← createUrl, redirectUrl, getUserUrls, deactivateUrl, requestCredits
│   │   └── admin.controller.js     ← user management, URL management, credit request approval
│   ├── middlewares/
│   │   ├── auth.middleware.js      ← JWT verify → attach req.user
│   │   └── isAdmin.middleware.js   ← role check → req.user.role === "admin"
│   ├── models/
│   │   ├── userModel.js            ← User schema with embedded credits object
│   │   ├── urlModel.js             ← URL schema with shortCode, clickCount, isActive, expiresAt
│   │   └── creditRequestModel.js  ← Credit request schema with status enum
│   ├── routes/
│   │   ├── auth.routes.js          ← /api/auth/*
│   │   ├── url.routes.js           ← /api/urls/*
│   │   └── admin.routes.js         ← /api/admin/* (all protected + isAdmin)
│   └── utils/
│       ├── validator.js            ← validation functions for signup, login, credits, alias
│       ├── env.js                  ← destructured process.env exports
│       └── constant.js             ← DB name, fallback PORT
```

---

## FEATURE LIST (for AI to generate bullets from)

### Authentication System
- JWT-based stateless authentication — token signed with secret, stored in `httpOnly` + `secure: true` + `sameSite: none` cookie (production-safe)
- `protect` middleware: extracts token from `req.cookies`, verifies with `jwt.verify`, fetches user from DB (excludes password with `select: false`), attaches to `req.user`
- `isAdmin` middleware: checks `req.user.role === "admin"` — layered after `protect` on all admin routes
- Password hashed with bcrypt (10 salt rounds) on signup; compared with `bcrypt.compare` on login
- `getCurrentUser` endpoint: returns authenticated user's full profile including credit balance
- `select: false` on password field in schema — never returned unless explicitly selected
- Logout clears cookie with matching options (`httpOnly`, `secure`, `sameSite: none`)

### URL Creation & Management
- Atomic credit check + increment using MongoDB `$expr` operator: `{ $lt: ["$credits.used", "$credits.total"] }` + `$inc` in a single `findOneAndUpdate` — prevents race conditions when multiple requests hit simultaneously
- Custom alias support: validated with regex `/^[a-z0-9-]{3,30}$/` (3–30 chars, lowercase, alphanumeric + hyphens only), uniqueness checked against DB
- Random short code generation: `Math.random().toString(36).substring(2, 8)` (6-char alphanumeric)
- 24-hour URL expiry: `expiresAt` set to `new Date() + 1 day` on creation
- Click tracking: `clickCount` incremented + `lastClickedAt` updated on every redirect
- Redirect endpoint `GET /:shortCode` at root level in `app.js` — checks URL exists, `isActive`, and `expiresAt` before redirecting
- Ownership check on deactivate: `url.createdBy.toString() !== req.user.id` — prevents users from deactivating others' URLs
- Only deactivated URLs can be deleted by admin (active URL deletion blocked with 403)

### Credit System
- Embedded credit object in User schema: `{ total: Number (default: 20), used: Number (default: 0) }`
- Each URL creation atomically uses 1 credit — enforced at DB level, not application level
- Users can request additional credits via `POST /api/urls/credits/request` — stored as `CreditRequest` document with `pending` status
- Duplicate pending request prevention: checks for existing `{ user: id, reqStatus: "pending" }` before creating new request
- Admin approves credit requests: adds `creditRequested` amount to `user.credits.total`, updates `reqStatus` to "approved"
- Admin can also directly add credits via `PATCH /api/admin/users/:id/credits`
- `validateCredits` util: checks credits is a number > 0

### Admin Panel
- All admin routes protected by layered middleware: `adminRouter.use(protect, isAdmin)` — applied at router level
- User management: view all users, activate/deactivate accounts, change roles (user/admin), add credits
- URL management: view all URLs across all users, delete deactivated URLs
- Stats endpoint: returns `totalUsers`, `activeUsers`, `inactiveUsers` using `countDocuments`
- Credit request management: view all pending requests (populated with user's firstname + email), approve requests

### Validation Layer
- `validationSignUpData`: checks firstname present, valid email (validator.js), strong password (8+ chars, uppercase, lowercase, number, symbol)
- `validationLoginData`: email format + password presence
- `validateCustomAlias`: trim + lowercase + regex test + length check (3–30)
- `validateCredits`: type check + positive number check
- URL validation: `validator.isURL(originalUrl)` before any processing

### Security & Production Setup
- CORS whitelist: array of allowed origins with dynamic `origin` callback — blocks unknown origins
- `credentials: true` in CORS config for cookie-based auth from frontend
- `httpOnly: true` cookie prevents XSS access to JWT
- `secure: true` + `sameSite: none` for cross-origin cookie on HTTPS (Render deployment)
- Rate limiter implemented (express-rate-limit: 10 req/min) — code present, commented out for current deployment
- Password never returned from DB (`select: false` on schema level)

### Database Design
- `userModel`: embedded `credits` object (total/used) avoids separate credits collection for simple credit tracking
- `urlModel`: `shortCode` indexed for fast redirect lookups; `createdBy` indexed for user URL queries; `isActive` flag for soft delete
- `creditRequestModel`: references User via ObjectId, status enum (`pending`/`approved`/`rejected`), `populate` used in admin query

---

## METRICS / QUANTIFIABLE FACTS

- 3 route groups: `/api/auth` (4 routes), `/api/urls` (5 routes), `/api/admin` (8 routes)
- 2 middleware layers on every admin route: `protect` + `isAdmin`
- Default 20 credits per user on signup
- URL expiry: 24 hours from creation
- Short code length: 6 characters (alphanumeric)
- Custom alias: 3–30 characters, regex validated
- Password strength: 5 requirements enforced (length, upper, lower, number, symbol)
- 3 user status transitions: active → inactive (admin), user → admin (admin)
- Credit request states: `pending` → `approved` / `rejected`

---

## INTERESTING TECHNICAL DECISIONS (for interview stories / resume bullets)

1. **Atomic credit enforcement with `$expr`** — instead of a two-step read-then-write (which has a race condition window), used MongoDB's `findOneAndUpdate` with `$expr: { $lt: ["$credits.used", "$credits.total"] }` to atomically check and increment in one DB operation. If no document is returned, credit limit was exceeded.

2. **Layered middleware at router level** — instead of adding `protect, isAdmin` to every single admin route, used `adminRouter.use(protect, isAdmin)` once at the top. Cleaner and impossible to accidentally forget on a new route.

3. **`select: false` on password field** — password is excluded from all queries by default at schema level. Only explicitly selected when needed (login). Prevents accidental password exposure in any endpoint.

4. **Redirect at root level in `app.js`** — `GET /:shortCode` is registered directly on the Express app, not inside a route group, so short URLs work at the root domain (e.g., `domain.com/abc123`).

5. **Soft delete for URLs** — URLs are deactivated (`isActive: false`) rather than deleted. This preserves click history and allows admin to manage/delete them later. Only deactivated URLs can be hard-deleted.

6. **Duplicate pending request check** — before creating a new credit request, checks if user already has a `pending` request. Prevents spam credit requests.

---

## SUGGESTED RESUME BULLETS (ready to use or adapt)

- Enforced credit-based URL creation atomically using MongoDB `$expr` + `$inc` in a single `findOneAndUpdate` — eliminated race condition in concurrent request scenarios
- Built layered Express middleware architecture — `protect` (JWT verification) + `isAdmin` (role check) applied at router level, securing all 8 admin routes with zero per-route repetition
- Implemented JWT auth stored in `httpOnly` + `secure` + `sameSite: none` cookies — production-safe across Render's cross-origin deployment
- Designed Admin Panel with full user lifecycle management: activate/deactivate accounts, role promotion, manual credit allocation, and credit request approval workflow
- Built credit request system with duplicate prevention — checks for existing `pending` requests before creating new ones, with admin approval flow updating user credit balance
- Implemented URL redirect at Express root level (`GET /:shortCode`) with active status, expiry, and click tracking — short URLs resolve at root domain without path prefix
- Applied `select: false` on password field at Mongoose schema level — excluded from all queries by default, preventing accidental credential exposure across any endpoint

---

## HOW TO USE THIS FILE

When asking an AI to write resume bullets for URL Shortener, say:

> "I have attached my URL Shortener features file. Based on this, write [X] strong resume bullet points for a [Backend/Fullstack] Developer role. Focus on [specific area: auth system / credit system / admin panel / security]. Keep bullets achievement-oriented and specific."
