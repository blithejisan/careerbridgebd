# CareerBridge BD 🚀
### A Job Portal for Fresh Graduates of Bangladesh

[![Made with React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://reactjs.org/)
[![Made with Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)](https://mysql.com/)

---

## 📌 Project Overview

CareerBridge BD is a full-stack web-based job portal specifically designed to bridge the gap between **fresh graduates of Bangladesh** and employers looking for entry-level talent.

> **Course:** Software Engineering & Database Systems
> **Student:** MD. Jahidul Hasan Jisan
> **ID:** 251035042
> **Program:** B.Sc. in Artificial Intelligence and Data Science (ADS)
> **University:** Green University of Bangladesh

---

## ✨ Features

### 👨‍🎓 Graduate (Job Seeker)
- Register & Login with JWT authentication
- Build personal profile (university, skills, bio)
- Upload CV in PDF format
- Browse & filter job listings
- Apply for jobs with one click
- Track application status (Pending → Shortlisted → Hired)
- Receive email notifications on status updates

### 🏢 Employer (Company)
- Register & Login as a company
- Post new job listings (pending admin approval)
- Manage job listings (edit/delete)
- View all applicants for each job
- Update application status with email notification

### ⚙️ Admin
- View and manage all registered users
- Approve or reject job listings before they go live
- Verify employer accounts
- View platform statistics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| Authentication | JWT + bcrypt |
| File Upload | Multer |
| Email | NodeMailer (Gmail SMTP) |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
careerbridgebd/
├── backend/
│   ├── config/          # DB & email config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Database query functions
│   ├── routes/          # API route definitions
│   ├── uploads/         # CV uploads storage
│   └── server.js        # Entry point
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       └── services/    # API call functions
├── database/
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Sample data
└── docs/
    └── ER-diagram.svg   # Entity Relationship Diagram
```

---

## 🗄️ Database Schema

6 tables: `users`, `graduate_profiles`, `employer_profiles`, `job_listings`, `applications`, `notifications`

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register   → Register user
POST /api/auth/login      → Login & get JWT token
```

### Jobs
```
GET    /api/jobs           → All active jobs (public)
POST   /api/jobs           → Post job (employer)
GET    /api/jobs/:id       → Single job (public)
PATCH  /api/jobs/:id       → Update job (employer)
DELETE /api/jobs/:id       → Delete job (employer)
```

### Applications
```
POST  /api/applications          → Apply for job (graduate)
GET   /api/applications/mine     → My applications (graduate)
GET   /api/applications/job/:id  → Job applicants (employer)
PATCH /api/applications/:id      → Update status (employer)
```

### Users
```
POST /api/users/upload-cv   → Upload CV PDF (graduate)
GET  /api/users/profile     → Get profile
```

### Admin
```
GET   /api/admin/users                  → All users
PATCH /api/admin/employers/:id/verify   → Verify employer
GET   /api/admin/jobs/pending           → Pending jobs
PATCH /api/admin/jobs/:id/approve       → Approve job
PATCH /api/admin/jobs/:id/reject        → Reject job
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/careerbridgebd.git
cd careerbridgebd
```

### 2. Database Setup
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p careerbridge_bd < database/seed.sql
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=careerbridge_bd
DB_PORT=3306
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📚 References

- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.
- Elmasri, R., & Navathe, S. (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.
- React.js Documentation — https://reactjs.org/docs/
- Node.js Documentation — https://nodejs.org/en/docs/
- MySQL 8.0 Reference Manual — https://dev.mysql.com/doc/

---

*© 2026 CareerBridge BD — Green University of Bangladesh*
