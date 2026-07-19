# AI Finance Tracker

A premium, production-grade SaaS application designed to help users manage their finances intelligently. Built on the MERN stack (MongoDB, Express, React, Node.js), this platform features robust budget tracking, an AI-powered financial intelligence center, advanced analytics, and PDF/CSV reporting.

## 🚀 Features

- **🔐 Secure Authentication:** JWT-based auth with HTTP interceptors, auto-logout on expiration, and secure password hashing.
- **📊 Advanced Analytics Dashboard:** Comprehensive financial health tracking with month-over-month comparisons, average daily spending metrics, and beautiful Recharts visualizations.
- **🧠 AI Financial Intelligence:** Hybrid AI engine that analyzes spending patterns to generate a Financial Health Score, predict month-end expenses, and provide actionable recommendations. Falls back to a local heuristic algorithm if OpenAI is unavailable.
- **📑 Reports Center:** Generate custom date-range reports and export them seamlessly as PDF or CSV files.
- **💰 Budget Management:** Granular tracking of overall monthly budgets and category-specific limits.
- **🔍 Advanced Transactions:** Create, edit, and delete transactions with debounced global search, multi-parameter filtering (by amount, category, date, and payment method), and dynamic pagination.
- **⚙️ Account Settings:** Full control over profile details, passwords, theme preferences, and secure account deletion.
- **📱 Responsive Design:** Fully responsive glassmorphism UI optimized for desktop, tablet, and mobile. Includes loading skeletons, smooth animations, and toast notifications for every action.

## 📸 Screenshots

![Dashboard Placeholder](https://via.placeholder.com/800x400?text=Dashboard+View)
*The main dashboard providing a quick overview of financial health.*

![Transactions Placeholder](https://via.placeholder.com/800x400?text=Transactions+View)
*Detailed transaction tracking with advanced filters and pagination.*

![AI Insights Placeholder](https://via.placeholder.com/800x400?text=AI+Insights+View)
*AI-driven financial intelligence and recommendations.*

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS (Vanilla CSS for core setup)
- **Charts:** Recharts
- **Notifications:** React Hot Toast
- **Networking:** Axios with global request/response interceptors

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **AI Integration:** OpenAI API
- **Exporting:** PDFKit for PDF generation

## 📂 Folder Structure

```
AI-Finance-Tracker/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components & Layouts
│   │   ├── pages/          # Full page views (Dashboard, Reports, AIInsights, etc.)
│   │   ├── services/       # Axios API configurations
│   │   └── store/          # Redux slices and store configuration
├── server/                 # Backend Node/Express Application
│   ├── controllers/        # Business logic for endpoints (auth, transactions, reports, ai)
│   ├── middleware/         # Custom middlewares (auth, error handling)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routing
│   └── services/           # External service integrations (e.g., aiService)
```

## 🛠️ Installation

1. **Clone the repository**
2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

## 🚀 Running Locally

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   The backend will run on `https://ai-finance-tracker-01.vercel.app/api/auth/register`.

2. **Start the frontend application:**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## 🌍 Deployment Instructions

### Backend (Render / Heroku)
1. Push your code to a GitHub repository.
2. Create a new Web Service on Render (or similar platform).
3. Connect your repository and select the `server` root directory.
4. Set the Build Command to `npm install` and the Start Command to `npm start`.
5. Add all Environment Variables from your `.env` file into the platform's dashboard.

### Frontend (Vercel / Netlify)
1. Create a new project on Vercel or Netlify.
2. Connect your repository and set the root directory to `client`.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.
5. Deploy the application.

## 🔑 Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here_or_leave_blank
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 API Endpoints

- **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `PUT /api/auth/password`, `DELETE /api/auth/account`
- **Transactions:** `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id`
- **Categories:** `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
- **Budgets:** `GET /api/budgets`, `POST /api/budgets`, `PUT /api/budgets/:id`
- **Analytics:** `GET /api/analytics/dashboard`
- **AI:** `GET /api/ai/insights`
- **Reports:** `GET /api/reports`, `GET /api/reports/download`

## 🔮 Future Improvements
- Multi-currency conversion via live exchange rates.
- OCR scanning for receipt uploads.
- Shared family budgeting modules.
