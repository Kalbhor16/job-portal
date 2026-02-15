# Job Portal - Visual Project Structure

```
📦 job-portal/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── db.js                          Database Connection
│   │
│   ├── 📁 controllers/                    Business Logic
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   └── profileController.js
│   │
│   ├── 📁 models/                         Database Schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── NotificationSettings.js
│   │   ├── RecruiterProfile.js
│   │   └── Company.js
│   │
│   ├── 📁 middleware/                     Request Processing
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── 📁 routes/                         API Endpoints
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── profileRoutes.js
│   │   └── seedRoutes.js
│   │
│   ├── 📁 socket/                         WebSocket (Future)
│   │
│   ├── 📁 uploads/                        User Uploads (Auto-created)
│   │   ├── profiles/
│   │   └── companies/
│   │
│   ├── server.js                          Main Entry Point
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── 📁 frontend/
│   ├── src/
│   │   ├── 📁 components/                 Reusable UI Components
│   │   │   ├── 📁 dashboard/              Dashboard Components
│   │   │   │   ├── DashboardCharts.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   ├── JobTable.jsx
│   │   │   │   ├── ApplicantsTable.jsx
│   │   │   │   └── QuickActions.jsx
│   │   │   │
│   │   │   ├── 📁 PostJob/                Job Posting Components
│   │   │   │   ├── SectionCard.jsx
│   │   │   │   ├── SkillsInput.jsx
│   │   │   │   ├── CustomQuestionBuilder.jsx
│   │   │   │   └── RequiredLinksToggle.jsx
│   │   │   │
│   │   │   ├── 📁 recruiter/              Recruiter Features
│   │   │   │   ├── FormInput.jsx
│   │   │   │   ├── ImageUploader.jsx
│   │   │   │   ├── ProfileHeader.jsx
│   │   │   │   ├── ActionButton.jsx
│   │   │   │   ├── InfoCard.jsx
│   │   │   │   ├── SectionHeader.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   └── 📁 messages/
│   │   │   │
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecruiterHeader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── 📁 pages/                     Full Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── MyJobs.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Applicants.jsx
│   │   │   ├── ApplicantDetails.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── RecruiterMessages.jsx
│   │   │   ├── RecruiterProfile.jsx
│   │   │   ├── CompanyProfile.jsx
│   │   │   ├── JobSeekerProfile.jsx
│   │   │   ├── JobSeekerDashboard.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── (others)
│   │   │
│   │   ├── 📁 context/                   Global State
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── 📁 services/                  API Layer
│   │   │   ├── api.js                    (Base Axios config)
│   │   │   ├── profileAPI.js
│   │   │   └── dashboardAPI.js
│   │   │
│   │   ├── 📁 hooks/                     Custom Hooks
│   │   │   ├── useRecruiterHeader.js
│   │   │   └── useRecruiterHeader.ts
│   │   │
│   │   ├── 📁 layouts/                   Layout Templates
│   │   │   └── RecruiterLayout.jsx
│   │   │
│   │   ├── 📁 utils/                     Utilities
│   │   │   └── mockData.js
│   │   │
│   │   ├── 📁 styles/
│   │   │   └── (custom styles)
│   │   │
│   │   ├── App.jsx                       Main Router
│   │   ├── main.jsx                      Entry Point
│   │   └── index.css                     Global Styles
│   │
│   ├── public/                           Static Assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
│
├── 📚 Documentation/
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── COMPLETE_README.md
│   ├── MONGODB_SETUP.md
│   ├── POSTJOB_QUICKSTART.md
│   ├── POSTJOB_SETUP_GUIDE.md
│   ├── POSTJOB_STYLING_GUIDE.md
│   ├── POSTJOB_TAILWIND_CLASSES_REFERENCE.md
│   ├── APPLICANT_DETAILS_GUIDE.md
│   ├── APPLICANT_DETAILS_COMPLETE_FEATURES.md
│   ├── APPLICANT_DETAILS_COMPLETE_SUMMARY.md
│   ├── APPLICANT_DETAILS_IMPLEMENTATION_COMPLETE.md
│   ├── APPLICANT_DETAILS_QUICK_REFERENCE.md
│   ├── APPLICANT_DETAILS_VISUAL_GUIDE.md
│   ├── PROFILE_SYSTEM_DOCUMENTATION.md
│   ├── PROFILE_INTEGRATION_GUIDE.md
│   ├── PROFILE_IMPLEMENTATION_SUMMARY.md
│   ├── THEME_UPDATE.md
│   ├── API_RESPONSES.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── PROJECT_STRUCTURE_GUIDE.md ← You are here
│   └── PROJECT_STRUCTURE_TREE.md ← This file
│
├── 📋 Config Files
│   ├── .gitignore
│   ├── postman_collection.json
│   └── .git/                            (Version control)
│
└── .env (Root level - if using monorepo)
```

---

## 📊 File Organization by Type

### BACKEND FILES BREAKDOWN:

**Controllers (6 files)** - Business Logic Layer
```
✅ authController.js              → Login, Register, Token management
✅ jobController.js               → Job CRUD operations
✅ applicationController.js       → Application management
✅ messageController.js           → Message operations
✅ notificationController.js      → Notification handling
✅ profileController.js           → Profile management
```

**Models (8 files)** - Database Schemas
```
✅ User.js                        → User accounts (recruiters & seekers)
✅ Job.js                         → Job postings
✅ Application.js                 → Job applications
✅ Message.js                     → Messages between users
✅ Notification.js                → Notifications
✅ NotificationSettings.js        → User notification preferences
✅ RecruiterProfile.js            → Recruiter personal profile
✅ Company.js                     → Company information
```

**Routes (7 files)** - API Endpoints
```
✅ authRoutes.js                  → /api/auth/* endpoints
✅ jobRoutes.js                   → /api/jobs/* endpoints
✅ applicationRoutes.js           → /api/applications/* endpoints
✅ messageRoutes.js               → /api/messages/* endpoints
✅ notificationRoutes.js          → /api/notifications/* endpoints
✅ profileRoutes.js               → /api/recruiter/* endpoints
✅ seedRoutes.js                  → /api/seed/* endpoints (data seeding)
```

**Middleware (2 files)** - Request Processing
```
✅ authMiddleware.js              → JWT verification
✅ roleMiddleware.js              → Role-based access control
```

**Configuration (1 file)**
```
✅ db.js                          → MongoDB connection setup
```

---

### FRONTEND FILES BREAKDOWN:

**Pages (19+ files)** - Full-page components
```
✅ Auth Pages:
   ├── Login.jsx
   └── Register.jsx

✅ Job Seeker Pages:
   ├── Landing.jsx
   ├── JobSeekerDashboard.jsx
   ├── Jobs.jsx
   ├── JobDetails.jsx
   └── JobSeekerProfile.jsx

✅ Recruiter Pages:
   ├── Dashboard.jsx
   ├── RecruiterDashboard.jsx
   ├── RecruiterDashboardExample.jsx
   ├── PostJob.jsx
   ├── MyJobs.jsx
   ├── Applicants.jsx
   ├── ApplicantDetails.jsx
   ├── Messages.jsx
   ├── RecruiterMessages.jsx
   ├── RecruiterProfile.jsx
   ├── CompanyProfile.jsx
   └── Notifications.jsx
```

**Components - Dashboard (5 files)**
```
✅ DashboardCharts.jsx            → Chart visualizations
✅ StatsCard.jsx                  → Statistics cards
✅ JobTable.jsx                   → Job postings table
✅ ApplicantsTable.jsx            → Applicants listing
✅ QuickActions.jsx               → Quick action buttons
```

**Components - PostJob (4 files)**
```
✅ SectionCard.jsx                → Form section wrapper
✅ SkillsInput.jsx                → Skills input field
✅ CustomQuestionBuilder.jsx      → Custom question builder
✅ RequiredLinksToggle.jsx        → Toggle component
```

**Components - Recruiter (8+ files)**
```
✅ FormInput.jsx                  → Reusable form input
✅ ImageUploader.jsx              → Drag-drop image upload
✅ ProfileHeader.jsx              → Profile header display
✅ ActionButton.jsx               → Action button component
✅ InfoCard.jsx                   → Information display card
✅ SectionHeader.jsx              → Section header component
✅ StatusBadge.jsx                → Status badge display
✅ messages/                      → Message components (folder)
```

**Other Components (3 files)**
```
✅ Navbar.jsx                     → Main navigation bar
✅ RecruiterHeader.jsx            → Recruiter header with dropdown
✅ ProtectedRoute.jsx             → Route protection wrapper
```

**Services (3 files)** - API Communication
```
✅ api.js                         → Base Axios instance with JWT
✅ profileAPI.js                  → Profile-related API calls
✅ dashboardAPI.js                → Dashboard API calls
```

**State Management (1 file)**
```
✅ AuthContext.jsx                → Global authentication state
```

**Hooks (2 files)** - Custom React Hooks
```
✅ useRecruiterHeader.js
✅ useRecruiterHeader.ts
```

**Layouts (1 file)**
```
✅ RecruiterLayout.jsx            → Recruiter layout wrapper
```

**Utilities (1 file)**
```
✅ mockData.js                    → Mock data for testing
```

**Configuration Files**
```
✅ App.jsx                        → Main router configuration
✅ main.jsx                       → React entry point
✅ index.css                      → Global styles
✅ tailwind.config.js             → Tailwind configuration
✅ vite.config.js                 → Vite bundler config
✅ postcss.config.js              → PostCSS config
```

---

## 🔍 File Navigation Map

### To Find Authentication Files:
```
Backend:  backend/controllers/authController.js
          backend/routes/authRoutes.js
          backend/models/User.js
          backend/middleware/authMiddleware.js

Frontend: frontend/src/pages/Login.jsx
          frontend/src/pages/Register.jsx
          frontend/src/context/AuthContext.jsx
          frontend/src/pages/Dashboard.jsx
```

### To Find Job Posting Features:
```
Backend:  backend/controllers/jobController.js
          backend/routes/jobRoutes.js
          backend/models/Job.js

Frontend: frontend/src/pages/PostJob.jsx
          frontend/src/pages/MyJobs.jsx
          frontend/src/components/PostJob/*
```

### To Find Messaging Features:
```
Backend:  backend/controllers/messageController.js
          backend/routes/messageRoutes.js
          backend/models/Message.js

Frontend: frontend/src/pages/Messages.jsx
          frontend/src/pages/RecruiterMessages.jsx
          frontend/src/components/recruiter/messages/*
```

### To Find Profile Features:
```
Backend:  backend/controllers/profileController.js
          backend/routes/profileRoutes.js
          backend/models/RecruiterProfile.js
          backend/models/Company.js

Frontend: frontend/src/pages/RecruiterProfile.jsx
          frontend/src/pages/CompanyProfile.jsx
          frontend/src/pages/JobSeekerProfile.jsx
          frontend/src/components/recruiter/FormInput.jsx
          frontend/src/components/recruiter/ImageUploader.jsx
          frontend/src/components/recruiter/ProfileHeader.jsx
          frontend/src/services/profileAPI.js
```

### To Find Dashboard Features:
```
Backend:  backend/controllers/* (all)

Frontend: frontend/src/pages/RecruiterDashboard.jsx
          frontend/src/pages/JobSeekerDashboard.jsx
          frontend/src/components/dashboard/*
          frontend/src/services/dashboardAPI.js
```

---

## 📊 Quick File Statistics

```
BACKEND:
├── Controllers:    6 files
├── Routes:         7 files
├── Models:         8 files
├── Middleware:     2 files
├── Config:         1 file
└── Total:          24 files + 1 entry point

FRONTEND:
├── Pages:          19 files
├── Components:     25+ files
├── Services:       3 files
├── Context:        1 file
├── Hooks:          2 files
├── Layouts:        1 file
├── Utils:          1 file
├── Config:         6 files
└── Total:          58+ files + 1 entry point

DOCUMENTATION:
├── Guides:         20+ markdown files
├── API Docs:       1 Postman collection
└── Total:          21+ documentation files

PROJECT TOTAL:     ~100+ files (including node_modules)
```

---

## 🎯 Common Development Tasks - Where to Find Files

### "I want to add a new field to User Profile"
1. Backend Model: `backend/models/User.js`
2. Controller: `backend/controllers/authController.js` (or profileController.js)
3. Routes: `backend/routes/authRoutes.js`
4. Frontend: `frontend/src/pages/RecruiterProfile.jsx`
5. Components: `frontend/src/components/recruiter/FormInput.jsx`

### "I want to add a new API endpoint"
1. Create/Update Controller: `backend/controllers/*.js`
2. Create/Update Routes: `backend/routes/*.js`
3. Create/Update Model if needed: `backend/models/*.js`
4. Frontend Service: `frontend/src/services/*API.js`
5. Frontend Component: `frontend/src/pages/*.jsx` or `frontend/src/components/*.jsx`

### "I want to fix a styling issue"
1. Component file: `frontend/src/components/*.jsx` or `frontend/src/pages/*.jsx`
2. Global styles: `frontend/src/index.css`
3. Tailwind config: `frontend/tailwind.config.js`

### "I want to add authentication to a route"
1. Backend Route: Add middleware in `backend/routes/*.js`
2. Middleware: Update `backend/middleware/authMiddleware.js`
3. Frontend: Update route in `frontend/src/App.jsx`
4. Component: Use `frontend/src/components/ProtectedRoute.jsx`

---

## 🚀 Getting Started Quick Reference

```bash
# Start Backend
cd backend
npm install
npm start

# Start Frontend
cd frontend
npm install
npm run dev

# Access App
Frontend:  http://localhost:5173
Backend:   http://localhost:5000
MongoDB:   Set in .env (mongodb://localhost:27017)
```

---

## 📌 Important Notes

1. **Node Modules**: Both backend and frontend have `node_modules/` (ignored in git)
2. **Environment Files**: 
   - Backend: `.env` and `.env.example`
   - Frontend: Vite handles env
3. **Assets**: Uploaded files go to `backend/uploads/`
4. **Git**: `.gitignore` excludes node_modules and sensitive files
5. **Package Managers**: npm is used for both backend and frontend

---

**Last Updated:** February 15, 2026  
**Project Status:** ✅ Production Ready  
**Total Codebase:** ~100+ files (excluding node_modules)
