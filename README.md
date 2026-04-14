# CampusHub 🎓
### Centralized Campus Event Management System

CampusHub replaces scattered WhatsApp group communication with a unified, role-based platform for discovering, creating, and managing college events.

---

## ✨ Features

- **Role-based access** — Admin, Organizer (Club/Department), Student
- **Event lifecycle** — Create → Pending → Admin Approval → Published
- **Student registration** — One-click event registration with QR code
- **Admin panel** — Manage departments, approve clubs & events, view users
- **Organizer panel** — Create events, request club registration
- **Google OAuth 2.0** + Email/Password authentication (JWT)
- **Search & filter** events by department or club

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT + Google OAuth 2.0 (Passport.js) |
| Validation | Joi |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/chunchun-06/CampusEvent.git
cd CampusEvent
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campushub
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

---

### 3. Setup the Database

Make sure MySQL is running, then apply the schema:

```bash
# Windows (PowerShell)
Get-Content schema.sql | mysql -u root -p

# macOS / Linux
mysql -u root -p < schema.sql
```

This will:
- Create the `campushub` database
- Create all tables (users, departments, clubs, events, registrations, bookmarks)
- Seed 8 departments
- Create an admin account

**Default Admin Credentials:**
- Email: `admin@campushub.com`
- Password: `Admin@123`

> ⚠️ Change the admin password after first login in production.

---

### 4. Setup the Frontend

```bash
cd ../frontend
npm install
```

---

### 5. Run the Project

**Backend** (from `backend/` folder):
```bash
npm start
# Runs on http://localhost:5000
```

**Frontend** (from `frontend/` folder):
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 👥 User Roles & Default Flow

| Role | How to get it | What they can do |
|------|--------------|-----------------|
| **Student** | Sign up with role = Student | Browse & register for events |
| **Pending Organizer** | Sign up with role = Organizer | Submit club registration request |
| **Organizer** | Admin approves their club | Create events (pending admin approval) |
| **Admin** | Seeded in DB | Full platform control |

### Organizer Onboarding Flow:
1. Sign up → select "Club/Department Organizer"
2. Go to **Register Club ⏳** in navbar → submit club details
3. Admin approves club → your role upgrades to **Organizer**
4. Log out & back in → create events from **My Events** panel

---

## 🔐 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **Google+ API**
3. Create **OAuth 2.0 Credentials** (Web Application)
4. Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID & Secret into your `.env`

---

## 📁 Project Structure

```
CampusEvent/
├── backend/
│   ├── config/          # DB pool, Passport OAuth config
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # JWT auth, role guards
│   ├── models/          # SQL query helpers
│   ├── routes/          # Express routers
│   ├── validation/      # Joi schemas
│   ├── schema.sql       # Database schema + seed data
│   ├── server.js        # App entry point
│   └── .env.example     # Environment variable template
└── frontend/
    └── src/
        ├── api/         # Axios instance with JWT interceptor
        ├── components/  # Navbar, EventCard, ProtectedRoute
        ├── context/     # AuthContext (global auth state)
        └── pages/       # All route pages
```

---

## 📡 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/google` | Public |
| GET | `/api/events` | Public |
| POST | `/api/events` | Organizer |
| PUT | `/api/events/:id/status` | Admin |
| POST | `/api/events/:id/register` | Student |
| GET | `/api/departments` | Public |
| POST | `/api/departments` | Admin |
| GET | `/api/clubs` | Public |
| POST | `/api/clubs` | Authenticated |
| PUT | `/api/clubs/:id/approve` | Admin |
| GET | `/api/admin/overview` | Admin |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds)
- JWT tokens expire in 7 days
- All sensitive routes protected by middleware
- `.env` file is **never committed** to git
- Input validated with **Joi** on all POST/PUT endpoints

---

*Built with ❤️ for college campuses*
