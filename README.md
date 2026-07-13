<div align="center">

# 💸 AI Finance Tracker

### *Your personal AI-powered financial command centre*

Track spending. Set budgets. Predict expenses. Generate reports — all in one intelligent dashboard.

[![MIT License](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub stars](https://img.shields.io/github/stars/santhoshreddynarra/ai-finance-tracker?style=social)](https://github.com/santhoshreddynarra/ai-finance-tracker/stargazers)

<br />

<!-- Replace with actual screenshots once dashboard is complete -->
> 📸 **Screenshot / GIF placeholder** — add a `docs/demo.gif` once the dashboard phase is complete.

<br />

[🚀 Live Demo](#) &nbsp;|&nbsp; [📡 Backend API](#) &nbsp;|&nbsp; [📖 Documentation](#table-of-contents) &nbsp;|&nbsp; [🐛 Report a Bug](https://github.com/santhoshreddynarra/ai-finance-tracker/issues)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [Project Structure](#-project-structure)
5. [Architecture](#-architecture)
6. [Screenshots](#-screenshots)
7. [Getting Started](#-getting-started)
8. [Environment Variables](#-environment-variables)
9. [Running the Project](#-running-the-project)
10. [API Documentation](#-api-documentation)
11. [Database Schema](#-database-schema)
12. [Security](#-security)
13. [Performance](#-performance)
14. [Deployment](#-deployment)
15. [Future Roadmap](#-future-roadmap)
16. [Contributing](#-contributing)
17. [Acknowledgements](#-acknowledgements)
18. [License](#-license)
19. [Author](#-author)

---

## 🌟 Overview

**AI Finance Tracker** is a full-stack personal finance management application built with the MERN stack and powered by the OpenAI API. It allows users to track income and expenses, manage monthly budgets, visualise spending trends through interactive charts, and receive AI-generated financial insights — all within a secure, responsive, and modern web interface.

### Why this project?

Most personal finance apps are either too simple (spreadsheets) or too complex (enterprise software). AI Finance Tracker fills the gap: a developer-quality, self-hostable finance tool that uses real AI to surface actionable insights from your own data.

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI component library |
| [Vite](https://vitejs.dev) | 8 | Build tool and dev server |
| [Redux Toolkit](https://redux-toolkit.js.org) | 2.x | Global state management |
| [React Router](https://reactrouter.com) | 7.x | Client-side routing |
| [Axios](https://axios-http.com) | 1.x | HTTP client with interceptors |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS framework |
| [Recharts](https://recharts.org) | 3.x | Declarative chart components |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | 24.x | JavaScript runtime |
| [Express](https://expressjs.com) | 5.x | Web application framework |
| [MongoDB](https://mongodb.com) | Atlas | Cloud-hosted NoSQL database |
| [Mongoose](https://mongoosejs.com) | 9.x | ODM with schema validation |
| [JSON Web Tokens](https://jwt.io) | 9.x | Stateless authentication |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6.x | Secure password hashing |
| [Helmet](https://helmetjs.github.io) | 8.x | HTTP security headers |
| [CORS](https://github.com/expressjs/cors) | 2.x | Cross-origin resource sharing |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | 8.x | API rate limiting |
| [PDFKit](https://pdfkit.org) | 0.x | PDF report generation |
| [OpenAI SDK](https://platform.openai.com/docs) | 6.x | AI-powered financial insights |

### Developer Tools

| Tool | Purpose |
|---|---|
| Git + GitHub | Version control and collaboration |
| VS Code | Primary code editor |
| Postman | API development and testing |
| MongoDB Compass | Database visualisation |
| dotenv | Environment variable management |

---

## ✅ Features

### 🔐 Authentication
- [x] User registration with email and password
- [x] Secure login with JWT
- [x] Password hashing with bcrypt (12 salt rounds)
- [x] Protected routes (client + server side)
- [x] Token persistence via localStorage
- [x] Automatic session restore on page refresh

### 💰 Transactions *(coming soon)*
- [ ] Add, edit, and delete income/expense transactions
- [ ] Categorise transactions (food, rent, salary, etc.)
- [ ] Full-text search and multi-filter support
- [ ] Pagination for large transaction histories
- [ ] Bulk import via CSV

### 📊 Dashboard & Charts *(coming soon)*
- [ ] Overview cards (total income, expenses, net balance)
- [ ] Monthly spending bar chart
- [ ] Category breakdown pie chart
- [ ] Income vs expense trend line chart
- [ ] Customisable date range selector

### 🎯 Budget Management *(coming soon)*
- [ ] Set monthly budgets per category
- [ ] Real-time budget vs actual comparison
- [ ] Visual progress bars with colour alerts
- [ ] Budget overspend notifications

### 🤖 AI Insights *(coming soon)*
- [ ] AI-generated spending summaries (GPT-4o-mini)
- [ ] Smart expense reduction recommendations
- [ ] Expense prediction for next month
- [ ] Anomaly detection for unusual spending

### 📄 Reports & Export *(coming soon)*
- [ ] Monthly PDF report generation
- [ ] Downloadable expense summaries
- [ ] Date-range report filtering

### 🎨 UX
- [x] Fully responsive layout (mobile, tablet, desktop)
- [x] Dark-themed glassmorphism design
- [x] Loading states and error handling on all forms
- [x] Accessible inputs with proper ARIA roles

---

## 📁 Project Structure

```
ai-finance-tracker/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthLayout.jsx   # Dark card layout for auth pages
│   │   │   │   └── ProtectedRoute.jsx  # JWT-gated route wrapper
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx       # Fixed top nav with logout
│   │   │   └── ui/
│   │   │       ├── Button.jsx       # Gradient button with loading state
│   │   │       ├── InputField.jsx   # Labelled input with inline errors
│   │   │       └── Loader.jsx       # Animated CSS spinner
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   └── Dashboard.jsx        # Protected dashboard (in progress)
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with JWT interceptor
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   └── authSlice.js     # Auth state, thunks, localStorage sync
│   │   │   └── store.js             # Redux store configuration
│   │   ├── App.jsx                  # Root router + Provider
│   │   ├── main.jsx                 # React DOM entry point
│   │   └── index.css                # Tailwind CSS import
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection with logging
│   ├── controllers/
│   │   └── authController.js        # signup(), login()
│   ├── middleware/
│   │   └── errorMiddleware.js       # Global error + 404 handler
│   ├── models/
│   │   └── User.js                  # Mongoose user schema + bcrypt hook
│   ├── routes/
│   │   └── authRoutes.js            # POST /api/auth/signup|login
│   ├── services/                    # (AI, PDF services — upcoming)
│   ├── utils/                       # Shared utilities (upcoming)
│   ├── app.js                       # Express app: middleware + routes
│   ├── server.js                    # Entry point: DB → server + graceful shutdown
│   └── package.json
│
└── README.md
```

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                    │
│                                                          │
│  ┌─────────────┐    ┌──────────────────────────────┐    │
│  │  React 19   │───▶│     React Router v7           │    │
│  │  Components │    │  /login  /register  /dashboard│    │
│  └──────┬──────┘    └──────────────────────────────┘    │
│         │                                                │
│         ▼                                                │
│  ┌──────────────┐   ┌──────────────────────────────┐    │
│  │ Redux Toolkit│   │   localStorage persistence   │    │
│  │  auth slice  │◀──│   token + user state         │    │
│  └──────┬───────┘   └──────────────────────────────┘    │
│         │                                                │
│         ▼                                                │
│  ┌──────────────┐                                        │
│  │    Axios     │  JWT attached via request interceptor  │
│  │  api.js      │  401 → auto-redirect to /login         │
│  └──────┬───────┘                                        │
└─────────┼────────────────────────────────────────────────┘
          │  HTTPS / REST
          ▼
┌──────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                        │
│                                                          │
│  Helmet ─ CORS ─ Rate Limit ─ express.json()            │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │                  Routes                        │     │
│  │  POST /api/auth/signup                         │     │
│  │  POST /api/auth/login                          │     │
│  └──────────────────┬─────────────────────────────┘     │
│                     │                                    │
│         ┌───────────▼──────────┐                        │
│         │     Controllers      │                        │
│         │  authController.js   │                        │
│         └───────────┬──────────┘                        │
│                     │                                    │
│         ┌───────────▼──────────┐                        │
│         │   Mongoose Models    │                        │
│         │   User, Transaction  │                        │
│         │   Budget             │                        │
│         └───────────┬──────────┘                        │
└─────────────────────┼────────────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │    MongoDB Atlas      │
          │  (cloud-hosted)       │
          └───────────────────────┘
```

---

## 📸 Screenshots

> Screenshots will be added after the dashboard phase is complete.

| Page | Preview |
|---|---|
| Login | `docs/screenshots/login.png` |
| Register | `docs/screenshots/register.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| Transactions | `docs/screenshots/transactions.png` |
| Budget | `docs/screenshots/budget.png` |
| Reports | `docs/screenshots/reports.png` |
| AI Insights | `docs/screenshots/ai-insights.png` |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 20.x |
| npm | ≥ 10.x |
| MongoDB Atlas account | Free tier sufficient |
| OpenAI API key | Required for AI features |
| Git | Any recent version |

### Clone the repository

```bash
git clone https://github.com/santhoshreddynarra/ai-finance-tracker.git
cd ai-finance-tracker
```

---

## 🔑 Environment Variables

### Backend — `server/.env`

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ai-finance-tracker?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend — `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files.** Both are listed in `.gitignore`.

### MongoDB Atlas Setup

1. Visit [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a new **M0 (Free)** cluster.
3. Under **Database Access**, create a user with read/write permissions.
4. Under **Network Access**, allow your IP (or `0.0.0.0/0` for development).
5. Click **Connect → Connect your application** and copy the connection string.
6. Paste it as `MONGODB_URI` in `server/.env`.

### OpenAI API Key

1. Visit [platform.openai.com](https://platform.openai.com).
2. Go to **API Keys → Create new secret key**.
3. Paste it as `OPENAI_API_KEY` in `server/.env`.

---

## ▶️ Running the Project

### Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Start development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Expected output:
# ✅ MongoDB Connected successfully: <cluster-host>
# 🚀 Server running on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Expected output:
# VITE ready in ~400ms
# ➜ Local: http://localhost:5173/
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Documentation

All endpoints are prefixed with `/api`. Authentication endpoints are public; all others require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Access | Description | Body |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new user | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public | Authenticate user | `{ email, password }` |

**Signup / Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": "6a552cb8...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-07-13T18:21:51.242Z"
  }
}
```

**Error Response Format (all endpoints):**
```json
{
  "success": false,
  "message": "An account with this email already exists."
}
```

### Transactions *(planned)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Protected | List all transactions (paginated) |
| `POST` | `/api/transactions` | Protected | Create a transaction |
| `PUT` | `/api/transactions/:id` | Protected | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Protected | Delete a transaction |
| `GET` | `/api/transactions/summary` | Protected | Monthly aggregate summary |

### Budgets *(planned)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/budgets` | Protected | List all budgets |
| `POST` | `/api/budgets` | Protected | Create a budget |
| `PUT` | `/api/budgets/:id` | Protected | Update a budget |
| `DELETE` | `/api/budgets/:id` | Protected | Delete a budget |

### AI *(planned)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/insights` | Protected | Generate spending insights |
| `POST` | `/api/ai/predict` | Protected | Predict next-month expenses |

### Reports *(planned)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/monthly` | Protected | JSON monthly summary |
| `GET` | `/api/reports/pdf` | Protected | Download PDF report |

### Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server health check |

---

## 🗄 Database Schema

### User

```js
{
  name:      String,   // required, trimmed, 2–60 chars
  email:     String,   // required, unique, lowercase, validated
  password:  String,   // required, bcrypt hashed, select: false
  createdAt: Date,     // auto (timestamps)
  updatedAt: Date      // auto (timestamps)
}
```

### Transaction *(planned)*

```js
{
  user:        ObjectId,  // ref: 'User'
  type:        String,    // 'income' | 'expense'
  amount:      Number,    // required, min: 0
  category:    String,    // e.g. 'food', 'rent', 'salary'
  description: String,    // optional
  date:        Date,      // required
  createdAt:   Date,
  updatedAt:   Date
}
```

### Budget *(planned)*

```js
{
  user:     ObjectId,  // ref: 'User'
  category: String,   // matches transaction category
  limit:    Number,   // monthly spending limit
  month:    Number,   // 1–12
  year:     Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security

| Feature | Implementation |
|---|---|
| **Password Hashing** | bcrypt with 12 salt rounds — irreversible one-way hash |
| **JWT Authentication** | Signed tokens with configurable expiry (default 7 days) |
| **Protected Routes** | Server-side JWT middleware + client-side Redux guard |
| **Rate Limiting** | 100 requests / 15 minutes per IP via `express-rate-limit` |
| **Security Headers** | Helmet sets 11 HTTP headers (CSP, X-Frame-Options, etc.) |
| **CORS Policy** | Restricted to `FRONTEND_URL` only — no wildcard in production |
| **Password Exclusion** | `select: false` on schema — password never returned in queries |
| **User Enumeration Prevention** | Login returns identical error for wrong email or wrong password |
| **Environment Secrets** | All secrets in `.env` — validated at startup, never logged |

---

## ⚡ Performance

| Technique | Detail |
|---|---|
| **MongoDB Indexes** | `email` (unique), `createdAt` (descending) — fast lookups and sorts |
| **Pagination** | All list endpoints return max 20 records per page |
| **Aggregation Pipelines** | Monthly summaries computed server-side, not in client memory |
| **Mongoose `select: false`** | Password excluded from every query result automatically |
| **React Code Splitting** | Lazy-loaded pages via `React.lazy()` (upcoming) |
| **Vite Build** | Tree-shaking and chunk splitting for minimal bundle size |
| **Caching** | Redis integration planned for AI response caching |

---

## 🌍 Deployment

### Backend — Render / Railway

1. Push the repo to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set **Root Directory** to `server`.
4. Set **Start Command** to `node server.js`.
5. Add all environment variables from `server/.env`.

### Frontend — Vercel / Netlify

1. Create a new project on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add `VITE_API_URL` pointing to your deployed backend URL.

### Database — MongoDB Atlas

- Use an **M10 (paid)** cluster for production.
- Enable **IP Allow List** with your server's static IP.
- Enable **Automated Backups**.
- Set a **Connection String** with SRV format for the deployed server.

---

## 🗺 Future Roadmap

### Phase 5 — Dashboard
- [ ] Overview metric cards (income, expenses, net balance)
- [ ] Monthly bar chart (Recharts)
- [ ] Category pie chart
- [ ] Recent transactions feed

### Phase 6 — Transactions CRUD
- [ ] Add / edit / delete transactions
- [ ] Category tagging
- [ ] Search, filter, and sort
- [ ] CSV import / export

### Phase 7 — Budget Management
- [ ] Per-category monthly budgets
- [ ] Budget vs actual progress bars
- [ ] Overspend alerts

### Phase 8 — AI Insights
- [ ] GPT-4o-mini spending summaries
- [ ] Next-month expense prediction
- [ ] Smart saving recommendations

### Phase 9 — Reports & PDF Export
- [ ] Monthly PDF report via PDFKit
- [ ] Date-range report filtering
- [ ] Email delivery of reports

### Phase 10 — Production Hardening
- [ ] Redis caching for AI responses
- [ ] Full test suite (Jest + Supertest + React Testing Library)
- [ ] GitHub Actions CI/CD pipeline
- [ ] Docker Compose setup
- [ ] Prometheus + Grafana observability

---

## 🤝 Contributing

Contributions are welcome! Please follow these conventions to keep the project clean.

### Branch Naming

```
feature/short-description       # New feature
fix/short-description           # Bug fix
chore/short-description         # Tooling, deps, config
docs/short-description          # Documentation only
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add monthly budget creation endpoint
fix: prevent re-hashing password on profile update
docs: add API documentation table to README
chore: upgrade mongoose to v9.7.4
```

### Pull Request Process

1. Fork the repository and create your feature branch.
2. Write clean, commented code following the existing style.
3. Ensure the backend starts without errors (`npm run dev`).
4. Open a PR against `main` with a clear description of changes.
5. Reference any related issues using `Closes #issue-number`.

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com) — GPT-4o-mini API for financial insights
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Free-tier cloud database
- [Heroicons](https://heroicons.com) — SVG icon set used in the UI
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Recharts](https://recharts.org) — Composable chart library for React
- [PDFKit](https://pdfkit.org) — Server-side PDF generation

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

```
MIT License — Copyright (c) 2026 Santhosh Reddy Narra
```

---

## 👨‍💻 Author

<div align="center">

**Santhosh Reddy Narra**

*Full-Stack Developer · MERN Stack · AI Integration*

[![GitHub](https://img.shields.io/badge/GitHub-santhoshreddynarra-181717?logo=github)](https://github.com/santhoshreddynarra)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin)](https://linkedin.com/in/santhoshreddynarra)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-violet)](https://santhoshreddynarra.dev)

</div>

---

## 📬 Contact

Have a question, suggestion, or just want to connect?

- 📧 Open a [GitHub Issue](https://github.com/santhoshreddynarra/ai-finance-tracker/issues)
- 💬 Start a [GitHub Discussion](https://github.com/santhoshreddynarra/ai-finance-tracker/discussions)

---

<div align="center">

### ⭐ Found this project useful?

**Give it a star on GitHub — it helps the project grow and reach more developers!**

[![Star this repo](https://img.shields.io/github/stars/santhoshreddynarra/ai-finance-tracker?style=for-the-badge&logo=github&color=violet)](https://github.com/santhoshreddynarra/ai-finance-tracker/stargazers)

<br />

*Built with ❤️ by [Santhosh Reddy Narra](https://github.com/santhoshreddynarra)*

</div>
