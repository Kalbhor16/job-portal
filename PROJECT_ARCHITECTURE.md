# Job Portal - Detailed Architecture & Organization

## 🏗️ Complete Project Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       JOB PORTAL SYSTEM                         │
├─────────────────────────────────────────────────────┬───────────┤
│                    Frontend (React)                 │ Backend   │
│                                                    │(Node.js) │
│  ┌─────────────────────────────────────────────┐  │           │
│  │  Pages (UI Screens)                         │  │           │
│  │  ├── Auth (Login, Register)                 │  │           │
│  │  ├── Jobs (Browse, Details, Post)           │  │           │
│  │  ├── Applications (View, Manage)            │  │           │
│  │  ├── Profiles (Recruiter, Company, Seeker) │  │           │
│  │  ├── Messages (Chat Interface)              │  │           │
│  │  └── Dashboard (Analytics, Quick Actions)   │  │           │
│  └─────────────────────────────────────────────┘  │           │
│         ↓                                          │           │
│  ┌─────────────────────────────────────────────┐  │           │
│  │  Components (Reusable UI Elements)          │  │           │
│  │  ├── Forms (FormInput, ImageUploader)       │  │           │
│  │  ├── Cards (ShortlistCard, StatsCard)       │  │           │
│  │  ├── Tables (JobTable, ApplicantsTable)     │  │           │
│  │  └── Layout (Header, Sidebar, Footer)       │  │           │
│  └─────────────────────────────────────────────┘  │           │
│         ↓                                          │           │
│  ┌─────────────────────────────────────────────┐  │           │
│  │  Services (API Communication)               │  │           │
│  │  ├── api.js (Base Axios config + JWT)       │  │           │
│  │  ├── profileAPI.js (Profile endpoints)      │  │           │
│  │  └── dashboardAPI.js (Dashboard endpoints)  │  │           │
│  └─────────────────────────────────────────────┘  │           │
│         ↓ (HTTP REST Calls)                       │           │
│                                                    │           │
│                    API Gateway                    │           │
│                                                    ↓           │
│                                          │ ┌────────────────┐ │
│                                          │ │    Routes      │ │
│                                          │ │ (API Endpoints)│ │
│                                          │ │  /api/jobs     │ │
│                                          │ │  /api/auth     │ │
│                                          │ │  /api/messages │ │
│                                          │ └────────────────┘ │
│                                          │         ↓          │
│                                          │ ┌────────────────┐ │
│                                          │ │  Controllers   │ │
│                                          │ │(Business Logic)│ │
│                                          │ │  - CRUD ops    │ │
│                                          │ │  - Validation  │ │
│                                          │ │  - Auth checks │ │
│                                          │ └────────────────┘ │
│                                          │         ↓          │
│                                          │ ┌────────────────┐ │
│                                          │ │    Models      │ │
│                                          │ │ (DB Schemas)   │ │
│                                          │ │  - User        │ │
│                                          │ │  - Job         │ │
│                                          │ │  - Application │ │
│                                          │ └────────────────┘ │
│                                          │         ↓          │
│                                          │ ┌────────────────┐ │
│                                          │ │  MongoDB       │ │
│                                          │ │  Database      │ │
│                                          │ └────────────────┘ │
└─────────────────────────────────────────────────────┼───────────┘
```

---

## 📦 Module Structure Breakdown

### 1. AUTHENTICATION MODULE

**Purpose**: User account management and session handling

**Backend Files**:
```
backend/
├── controllers/authController.js
│   ├── register()       → Create new account
│   ├── login()          → Authenticate user
│   ├── refreshToken()   → Token refresh
│   └── logout()         → End session
├── routes/authRoutes.js
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
└── models/User.js
    ├── email (unique)
    ├── password (hashed)
    ├── name
    ├── role (recruiter/jobseeker)
    └── timestamps
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   ├── Login.jsx       → Login form
│   └── Register.jsx    → Registration form
├── context/
│   └── AuthContext.jsx → Global auth state
└── services/
    └── api.js          → JWT interceptor
```

**Data Flow**:
```
User Input → Login Page → POST /api/auth/login → Server validates → 
Returns JWT → Store in localStorage → AuthContext → ProtectedRoute checks
```

---

### 2. JOB MANAGEMENT MODULE

**Purpose**: Create, manage, and browse job postings

**Backend Files**:
```
backend/
├── controllers/jobController.js
│   ├── createJob()      → Post new job
│   ├── getJobs()        → List jobs with filters
│   ├── getJobDetails()  → Single job view
│   ├── updateJob()      → Edit job
│   ├── deleteJob()      → Remove job
│   └── searchJobs()     → Search functionality
├── routes/jobRoutes.js
│   ├── GET /jobs
│   ├── GET /jobs/:id
│   ├── POST /jobs
│   ├── PUT /jobs/:id
│   └── DELETE /jobs/:id
└── models/Job.js
    ├── title
    ├── description
    ├── skills []
    ├── salary
    ├── location
    ├── jobType (full-time, contract)
    ├── recruiterId
    └── timestamps
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   ├── PostJob.jsx          → Job posting form
│   ├── MyJobs.jsx           → My posted jobs
│   ├── Jobs.jsx             → Browse all jobs
│   └── JobDetails.jsx       → Single job view
└── components/PostJob/
    ├── SectionCard.jsx      → Form section
    ├── SkillsInput.jsx      → Skills selector
    ├── CustomQuestionBuilder.jsx
    └── RequiredLinksToggle.jsx
```

**Workflow**:
```
Recruiter → PostJob page → Fill form → FormInput/SkillsInput → 
POST /api/jobs → jobController validates → Save to Job model → 
Return job ID → Show success → List in MyJobs
```

---

### 3. APPLICATION MANAGEMENT MODULE

**Purpose**: Handle job applications and candidate screening

**Backend Files**:
```
backend/
├── controllers/applicationController.js
│   ├── createApplication() → Apply for job
│   ├── getApplications()   → List applications
│   ├── updateStatus()      → Change app status
│   ├── getApplicants()     → View candidates
│   └── rejectApplication() → Reject candidate
├── routes/applicationRoutes.js
│   ├── GET /applications
│   ├── POST /applications
│   ├── PUT /applications/:id
│   └── DELETE /applications/:id
└── models/Application.js
    ├── jobId
    ├── jobSeekerId
    ├── recruiterId
    ├── status (pending, shortlisted, rejected)
    ├── resume
    └── timestamps
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   ├── Applicants.jsx       → All applicants list
│   └── ApplicantDetails.jsx → Single applicant view
└── components/dashboard/
    └── ApplicantsTable.jsx  → Applicants table
```

**Workflow**:
```
JobSeeker → JobDetails → Apply button → POST /api/applications → 
applicationController processes → Save Application → 
Recruiter sees in Applicants → Click to view details → 
ApplicantDetails page → Change status → PUT /api/applications/:id
```

---

### 4. MESSAGING MODULE

**Purpose**: Direct communication between recruiters and job seekers

**Backend Files**:
```
backend/
├── controllers/messageController.js
│   ├── sendMessage()       → Send new message
│   ├── getConversations()  → List conversations
│   ├── getMessages()       → Get chat history
│   ├── markAsRead()        → Message read status
│   └── deleteMessage()     → Remove message
├── routes/messageRoutes.js
│   ├── GET /messages/conversations
│   ├── GET /messages/conversation/:userId
│   ├── POST /messages
│   ├── PUT /messages/:id
│   └── DELETE /messages/:id
└── models/Message.js
    ├── senderId
    ├── receiverId
    ├── content
    ├── read (boolean)
    ├── conversationId
    └── timestamps
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   ├── Messages.jsx         → Messaging interface
│   └── RecruiterMessages.jsx
└── components/recruiter/messages/
    ├── ConversationList.jsx
    ├── ChatWindow.jsx
    └── MessageInput.jsx
```

**Real-time**: Socket.io configured in `backend/socket/` for live updates

**Workflow**:
```
User A → Messages page → Select conversation → Send message → 
POST /api/messages → messageController saves → 
Socket.io emits event → User B receives in real-time → 
Read receipt → PUT /api/messages/:id → Status updated
```

---

### 5. PROFILE MANAGEMENT MODULE

**Purpose**: Recruiter and company profile management

**Backend Files**:
```
backend/
├── controllers/profileController.js
│   ├── getRecruiterProfile()    → Fetch recruiter profile
│   ├── updateRecruiterProfile() → Update recruiter
│   ├── getCompanyProfile()      → Fetch company profile
│   ├── updateCompanyProfile()   → Update company
│   └── createCompanyProfile()   → Create company
├── routes/profileRoutes.js
│   ├── GET /recruiter/profile
│   ├── PUT /recruiter/profile (multipart)
│   ├── GET /recruiter/company-profile
│   ├── PUT /recruiter/company-profile (multipart)
│   └── POST /recruiter/company-profile
├── models/RecruiterProfile.js
│   ├── userId
│   ├── fullName
│   ├── phone
│   ├── profilePhoto
│   ├── designation
│   ├── bio
│   ├── linkedinLink
│   ├── companyId
│   └── profileCompletionPercentage
└── models/Company.js
    ├── companyName
    ├── location
    ├── industry
    ├── companySize
    ├── foundedYear
    ├── website
    ├── aboutCompany
    ├── companyLogo
    ├── socialLinks
    ├── recruiterId
    └── profileCompletionPercentage
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   ├── RecruiterProfile.jsx    → Recruiter personal profile
│   ├── CompanyProfile.jsx      → Company profile
│   └── JobSeekerProfile.jsx    → Candidate profile
├── components/recruiter/
│   ├── FormInput.jsx           → Input field component
│   ├── ImageUploader.jsx       → Drag-drop uploader
│   └── ProfileHeader.jsx       → Profile header display
└── services/
    └── profileAPI.js           → Profile API calls
```

**Workflow**:
```
Recruiter → /recruiter/profile → Edit profile → 
Fill FormInput fields → ImageUploader for photo → 
PUT /api/recruiter/profile → Returns completion % → 
Show success → Display in RecruiterHeader dropdown
```

---

### 6. NOTIFICATION MODULE

**Purpose**: Keep users informed of important events

**Backend Files**:
```
backend/
├── controllers/notificationController.js
│   ├── getNotifications()     → List notifications
│   ├── getUnreadCount()       → Count unread
│   ├── markAsRead()           → Mark read
│   ├── deleteNotification()   → Remove notification
│   └── sendNotification()     → Create notification
├── routes/notificationRoutes.js
│   ├── GET /notifications
│   ├── GET /notifications/unread/count
│   ├── PUT /notifications/:id
│   └── DELETE /notifications/:id
├── models/Notification.js
│   ├── userId
│   ├── type (application, message, update)
│   ├── content
│   ├── read (boolean)
│   ├── relatedId (jobId, applicationId)
│   └── timestamps
└── models/NotificationSettings.js
    ├── userId
    └── preferences {}
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   └── Notifications.jsx       → Notifications page
└── components/
    └── notification bell in header displays count
```

**Triggered by**: New application, message, job actions

**Workflow**:
```
Event happens (new application) → notificationController.sendNotification() → 
Create Notification → Socket.io sends to client → Header shows badge → 
User clicks → Notifications page → Shows all → Click one → Navigate to related
```

---

### 7. DASHBOARD MODULE

**Purpose**: Analytics and quick actions overview

**Backend Files**:
```
backend/
└── controllers/jobController.js, applicationController.js, etc.
    (Uses existing data for aggregation and statistics)
```

**Frontend Files**:
```
frontend/src/
├── pages/
│   ├── RecruiterDashboard.jsx      → Recruiter view
│   └── JobSeekerDashboard.jsx      → Seeker view
├── components/dashboard/
│   ├── DashboardCharts.jsx         → Statistics charts
│   ├── StatsCard.jsx               → Stat display
│   ├── JobTable.jsx                → Recent jobs table
│   ├── ApplicantsTable.jsx         → Recent applicants
│   └── QuickActions.jsx            → Action buttons
└── services/
    └── dashboardAPI.js             → Dashboard data calls
```

**Data Displayed**:
- Total jobs posted/applied
- Active applications
- Unread messages
- Profile completion
- Quick links

---

## 🔀 Data Models & Relationships

```
┌─────────────────┐
│      User       │  (Base user account)
│─────────────────│
│ id              │
│ email (unique)  │
│ password        │
│ name            │
│ role            │  ← Determines dashboard type
│ updatedAt       │
└─────────────────┘
    ↓ 1:1          (if recruiter)
    ├──────────────────────────────┐
    ↓                              ↓
┌─────────────────┐        ┌──────────────────┐
│ Recruiter       │        │    Company       │
│ Profile         │        │    Profile       │
│─────────────────│        │──────────────────│
│ userId (FK)     │        │ recruiterId (FK) │
│ fullName        │        │ companyName      │
│ phone           │        │ location         │
│ profilePhoto    │        │ industry         │
│ designation     │────────┼─→ companyLogo   │
│ bio             │ 1:0..1 │ website          │
│ linkedinLink    │        │ socialLinks      │
│ companyId (FK)  │        │ aboutCompany     │
└─────────────────┘        └──────────────────┘
    ↑ 1:N                           ↑ 1:N
    │                               │
    │                               │
    └───────────┬───────────────────┘
                ↓ 1
        ┌──────────────┐
        │     Job      │ (Job posting)
        │──────────────│
        │ id           │
        │ title        │
        │ description  │
        │ skills []    │
        │ recruiterId  │ ──→ References User
        │ companyId    │ ──→ References Company
        │ salary       │
        │ jobType      │
        │ status       │
        └──────────────┘
            ↓ 1:N
        ┌────────────────────┐
        │   Application      │ (Job application)
        │────────────────────│
        │ id                 │
        │ jobId (FK)         │
        │ jobSeekerId (FK)   │ ──→ References User
        │ recruiterId (FK)   │ ──→ References User
        │ status             │
        │ appliedAt          │
        └────────────────────┘


User (1 as sender) ──→ 1:N ──→ Message ←── 1:N ← User (1 as receiver)
│                               │
│                               └─→ conversationId
└─→ Multiple conversations


User ←── 1:N ──→ Notification
                  │
                  ├─→ relatedJobId
                  ├─→ relatedApplicationId
                  └─→ type: application|message|update
```

---

## 🔐 Security Layers

```
Frontend:
├── JWT stored in localStorage
├── Axios interceptor adds bearer token to headers
├── ProtectedRoute checks token existence
├── Role-based route access
└── Input validation before API call

Backend:
├── authMiddleware verifies JWT signature
├── roleMiddleware checks user role
├── Password hashing with bcryptjs
├── CORS configured for frontend origin
├── Input validation with express-validator
├── SQL injection prevention with ORM
├── XSS protection with sanitization
└── Rate limiting (can be added)
```

---

## 🔄 Typical User Journeys

### Recruiter Journey:
```
1. Register/Login
   → /register or /login

2. Create Profile (Optional)
   → /recruiter/profile (FormInput + ImageUploader)

3. Create Company (Optional)
   → /recruiter/company-profile

4. Post Job
   → /post-job → Fill job details → Select skills

5. View Dashboard
   → /recruiter → See analytics → Quick actions

6. Manage Jobs
   → /my-jobs → View posted jobs → Edit/Delete

7. View Applicants
   → /applicants → View list → Click for details

8. Message Candidate
   → /messages → Select candidate → Chat

9. Check Notifications
   → /notifications → See updates
```

### Job Seeker Journey:
```
1. Register/Login
   → /register or /login

2. View Profile
   → /job-seeker-profile (Can set dummy data)

3. Browse Jobs
   → /jobs → Filter/search → View details

4. Apply for Job
   → Job details page → Click Apply

5. View Dashboard
   → /job-seeker-dashboard → See applications

6. Message Recruiter
   → /messages → View conversations

7. Check Notifications
   → /notifications → See updates
```

---

## 🎯 API Endpoints Reference

### Authentication API
```
POST   /api/auth/register         → Register new user
POST   /api/auth/login            → Login user
POST   /api/auth/refresh          → Refresh JWT token
POST   /api/auth/logout           → Logout user
```

### Jobs API
```
GET    /api/jobs                  → List all jobs
GET    /api/jobs/:id              → Get job details
POST   /api/jobs                  → Create job (recruiter only)
PUT    /api/jobs/:id              → Update job (owner only)
DELETE /api/jobs/:id              → Delete job (owner only)
GET    /api/jobs/search?query     → Search jobs
```

### Applications API
```
POST   /api/applications          → Submit application
GET    /api/applications          → List applications
GET    /api/applications/:id      → Get application details
PUT    /api/applications/:id      → Update application status
DELETE /api/applications/:id      → Delete application
```

### Messages API
```
GET    /api/messages/conversations/all/list   → List all conversations
GET    /api/messages/conversation/:userId     → Get conversation with user
POST   /api/messages                          → Send message
PUT    /api/messages/:id                      → Update message (mark read)
DELETE /api/messages/:id                      → Delete message
```

### Notifications API
```
GET    /api/notifications                → List notifications
GET    /api/notifications/unread/count   → Count unread
PUT    /api/notifications/:id/read       → Mark as read
DELETE /api/notifications/:id            → Delete notification
```

### Profiles API
```
GET    /api/recruiter/profile            → Get recruiter profile
PUT    /api/recruiter/profile            → Update recruiter profile (multipart)
POST   /api/recruiter/company-profile    → Create company profile
GET    /api/recruiter/company-profile    → Get company profile
PUT    /api/recruiter/company-profile    → Update company profile (multipart)
```

---

## 📚 Technology Stack

**Frontend**:
- React 18.x
- Vite (bundler)
- Tailwind CSS (styling)
- React Router (navigation)
- Lucide React (icons)
- Axios (HTTP client)

**Backend**:
- Node.js x.x
- Express.js (framework)
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- Multer (file upload)
- bcryptjs (password hashing)

**Development**:
- npm (package manager)
- Git (version control)
- Postman (API testing)
- VS Code (editor)

---

**Total Project Size**: ~100+ files  
**Code Lines**: ~2,000+ lines  
**Status**: ✅ Production Ready  
**Last Updated**: February 15, 2026
