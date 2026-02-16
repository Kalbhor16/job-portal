# Job Seeker Module - Complete Implementation

## Overview
This document outlines the complete implementation of the **Job Seeker Module** for the MERN Stack Job Portal, including backend models, controllers, routes, and frontend pages.

---

## Backend Implementation

### 1. Database Models

#### **Profile Model** (`backend/models/Profile.js`)
Stores comprehensive job seeker profile information:

```
- userId (Reference to User)
- fullName (String) - required
- email (String) - required
- phone (String) - required
- profilePhoto (String) - file path
- headline (String) - professional title
- summary (Text) - professional summary
- experienceLevel (Enum) - Intern, Entry, Mid, Senior, Lead, Manager, Director, Executive
- skills (Array) - list of skills
- location (String)
- resumeURL (String) - PDF/DOC file path
- portfolioLink (String) - URL
- linkedinLink (String) - URL
- githubLink (String) - URL
- majorProjectLink (String) - URL
- education (Array of Subdocuments)
  - institution
  - degree
  - fieldOfStudy
  - startDate, endDate
  - grade
  - description
- workExperience (Array of Subdocuments)
  - company
  - title
  - location
  - startDate, endDate
  - currentlyWorking (Boolean)
  - description
- certifications (Array)
- timestamps (createdAt, updatedAt)
```

#### **Application Model** (`backend/models/Application.js`)
Extended with recruiter field:

```
- job (Reference to Job)
- applicant (Reference to User) - job seeker
- recruiter (Reference to User) - automatically set from job.createdBy
- resumeUrl (String) - file path
- coverLetter (Text)
- portfolioLink, linkedinLink, githubLink, majorProjectLink (URLs)
- answers (Array) - custom question responses
- status (Enum) - New, Reviewed, Shortlisted, Interview Scheduled, Rejected, Hired
- interviewScheduledAt (Date)
- interviewMessage (String)
- rejectionReason (String)
- rating (Number 0-5)
- notes (String)
- appliedAt (Date)
- timestamps
```

---

### 2. Controllers

#### **jobSeekerProfileController.js** (`backend/controllers/jobSeekerProfileController.js`)

**Main Functions:**

| Function | Route | Method | Purpose |
|----------|-------|--------|---------|
| `getMyProfile` | `/profile` | GET | Fetch current user's profile (auto-creates if not exists) |
| `getProfileById` | `/profile/:userId` | GET | Public profile view by user ID |
| `updateProfile` | `/profile` | PUT | Update basic info, links, upload photo/resume |
| `addEducation` | `/profile/education` | POST | Add education record |
| `updateEducation` | `/profile/education/:eduId` | PUT | Update education |
| `deleteEducation` | `/profile/education/:eduId` | DELETE | Remove education |
| `addWorkExperience` | `/profile/work-experience` | POST | Add work history |
| `updateWorkExperience` | `/profile/work-experience/:expId` | PUT | Update experience |
| `deleteWorkExperience` | `/profile/work-experience/:expId` | DELETE | Remove experience |
| `addSkill` | `/profile/skills` | POST | Add a skill |
| `deleteSkill` | `/profile/skills/:skill` | DELETE | Remove a skill |

#### **applicationController.js** (Updated)

**Change:** Resume upload now via file (`req.file`) instead of URL:
```javascript
const resumeUrl = req.file ? req.file.path : req.body.resumeUrl;
```

**New:** Recruiter automatically assigned from job:
```javascript
recruiter: job.createdBy
```

---

### 3. Routes

#### **jobSeekerProfileRoutes.js** (`backend/routes/jobSeekerProfileRoutes.js`)

```
POST/PUT/DELETE endpoints with multer:
- Supports profile photo upload (JPEG, PNG, WebP - 5MB)
- Supports resume upload (PDF, DOC, DOCX - 10MB)
- Fields: profilePhoto, resume (multipart/form-data)
```

#### **applicationRoutes.js** (Updated)

```
POST /api/applications/:jobId
- Middleware: upload.single('resume')
- Accepts: resume file + form data (coverLetter, links, answers)
```

---

## Frontend Implementation

### 1. Pages

#### **ApplyJob.jsx** (`frontend/src/pages/ApplyJob.jsx`)

Features:
- ✅ Resume file upload (drag & drop + click)
- ✅ Cover letter textarea
- ✅ Social/portfolio link inputs
- ✅ Dynamic custom question rendering:
  - Text input
  - Textarea
  - Yes/No radio buttons
  - Multiple choice select
- ✅ Error handling & loading states
- ✅ Success redirect to `/applications`

**API Call:**
```javascript
POST /api/applications/:id (multipart/form-data)
```

---

#### **EditProfile.jsx** (`frontend/src/pages/EditProfile.jsx`)

**Sections:**
1. **Basic Information**
   - Full name *, phone *, headline, location
   - Professional summary textarea
   
2. **Experience Level**
   - Dropdown selector
   
3. **File Uploads**
   - Profile photo upload
   - Resume upload
   
4. **Social Links**
   - Portfolio, LinkedIn, GitHub, Major Project
   
5. **Skills Management**
   - Add/remove skills with UI badges
   - Input + add button
   
6. **Education**
   - View existing education
   - Add new: institution, degree, field, dates, grade
   - Delete education
   
7. **Work Experience**
   - View existing experiences
   - Add new: company, title, location, dates, description
   - "Currently working" checkbox disables end date
   - Delete experience

**API Calls:**
- `GET /profile` - fetch profile
- `PUT /profile` - save profile + file uploads
- `POST /profile/education` - add education
- `DELETE /profile/education/:eduId` - remove education
- `POST /profile/work-experience` - add experience
- `DELETE /profile/work-experience/:expId` - remove experience

---

#### **Applications.jsx** (`frontend/src/pages/Applications.jsx`)

Features:
- ✅ List all job seeker's applications
- ✅ Status badges with color coding:
  - New → Blue
  - Reviewed → Yellow
  - Shortlisted → Purple
  - Interview Scheduled → Green
  - Rejected → Red
  - Hired → Emerald
- ✅ Interview date display (if scheduled)
- ✅ Rejection reason display (if rejected)
- ✅ Quick actions: View details, Download resume
- ✅ Applied date tracking
- ✅ Empty state with "Browse Jobs" button

**API Call:**
```
GET /api/applications/my
```

---

#### **Register.jsx** (Fixed)

- Changed `<a href="/login">` → `<Link to="/login">` for client-side routing
- Prevents full page reload, preserves SPA state

---

### 2. API Service Integration

All pages use `api` service from `frontend/src/services/api.js`:
- ✅ Axios instance with JWT token interceptor
- ✅ Automatic token injection in Authorization header
- ✅ 401 redirect to login on expired token
- ✅ VITE_API_URL: `http://localhost:5000/api`

---

## File Upload Flow

### Resume Upload (Application)
```
Frontend ApplyJob → 
  FormData with 'resume' file → 
  POST /api/applications/:jobId → 
  multer middleware → 
  uploads/resumes/{timestamp}-{filename} → 
  Stored in Application.resumeUrl
```

### Profile Upload (Edit Profile)
```
Frontend EditProfile → 
  FormData with 'profilePhoto' & 'resume' fields → 
  PUT /api/profile → 
  multer middleware → 
  uploads/photos/{...} & uploads/resumes/{...} → 
  Stored in Profile.profilePhoto & Profile.resumeURL
```

---

## Database Relationships

```
User (1) ─── (1) Profile
  ↓
  └─── (Many) Application
         └─ References: Job (1), User (Recruiter) (1)
```

---

## Directory Structure

### Backend
```
backend/
├── models/
│   ├── Profile.js (NEW)
│   └── Application.js (UPDATED)
├── controllers/
│   ├── jobSeekerProfileController.js (NEW)
│   └── applicationController.js (UPDATED)
├── routes/
│   ├── jobSeekerProfileRoutes.js (NEW)
│   └── applicationRoutes.js (UPDATED)
└── server.js (UPDATED - registered new routes)
```

### Frontend
```
frontend/src/
└── pages/
    ├── ApplyJob.jsx (UPDATED)
    ├── EditProfile.jsx (UPDATED - COMPLETE REWRITE)
    ├── Applications.jsx (UPDATED)
    └── Register.jsx (FIXED - Link component)
```

---

## API Endpoints Summary

### Profile Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | ✅ Private | Get my profile |
| GET | `/api/profile/:userId` | ❌ Public | View user profile |
| PUT | `/api/profile` | ✅ Private | Update profile + uploads |
| POST | `/api/profile/education` | ✅ Private | Add education |
| PUT | `/api/profile/education/:eduId` | ✅ Private | Update education |
| DELETE | `/api/profile/education/:eduId` | ✅ Private | Delete education |
| POST | `/api/profile/work-experience` | ✅ Private | Add work experience |
| PUT | `/api/profile/work-experience/:expId` | ✅ Private | Update experience |
| DELETE | `/api/profile/work-experience/:expId` | ✅ Private | Delete experience |
| POST | `/api/profile/skills` | ✅ Private | Add skill |
| DELETE | `/api/profile/skills/:skill` | ✅ Private | Delete skill |

### Application Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/applications/:jobId` | ✅ Private | Apply to job (with resume upload) |
| GET | `/api/applications/my` | ✅ Private | Get my applications |
| GET | `/api/applications/:id` | ✅ Private | Get application details |
| PUT | `/api/applications/:id/status` | ✅ Private (Recruiter) | Update status |
| PATCH | `/api/applications/:id/schedule-interview` | ✅ Private (Recruiter) | Schedule interview |
| PATCH | `/api/applications/:id/reject` | ✅ Private (Recruiter) | Reject application |
| PATCH | `/api/applications/:id/rate` | ✅ Private (Recruiter) | Rate applicant |

---

## Environment Configuration

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Testing Workflow

### 1. **Complete Profile**
   - Navigate to `/profile/edit`
   - Fill all sections: basic info, skills, education, experience
   - Upload resume & profile photo
   - Click "Save Profile"

### 2. **Browse & Apply to Jobs**
   - Navigate to `/jobs`
   - Click job → `/jobs/:id`
   - Click "Apply" → `/jobs/:id/apply`
   - Upload resume, cover letter, answer custom questions
   - Submit application

### 3. **Track Applications**
   - Navigate to `/applications`
   - View all submissions with status
   - Click "View" to see details
   - Download resume

### 4. **Recruiter Review** (Separate module)
   - Navigate to `/recruiter/jobs/:id/applicants`
   - View applicant details
   - Update status, schedule interview, rate, reject

---

## Multer Configuration

### Profile Photo Upload
```javascript
destination: 'uploads/photos/'
fileSize: 5MB
types: JPEG, PNG, WebP
```

### Resume Upload (Application)
```javascript
destination: 'uploads/resumes/'
fileSize: 10MB
types: PDF, Word (.doc, .docx)
```

### Resume Upload (Profile Update)
```javascript
destination: 'uploads/resumes/'
fileSize: 10MB
types: PDF, Word (.doc, .docx)
```

---

## Error Handling

### Frontend
- Global toast/alert for API errors
- Form validation before submission
- Loading spinners during async operations
- Fallback UI for empty states

### Backend
- Validation middleware before DB operations
- Try-catch error handling in controllers
- Specific error messages for troubleshooting
- Multer error handling for file uploads

---

## Next Steps (Recruiter Module)

The Recruiter Module follows a similar pattern:
1. **Post Job** → Extended Job model with custom questions, required links
2. **View Applicants** → List applicants with filters
3. **Applicant Details** → Full profile + application answers
4. **Schedule Interview** → Update application status + send notification
5. **Messaging** → Real-time chat between recruiter & candidate

---

## File Paths
- Profile photos: `backend/uploads/photos/`
- Resumes: `backend/uploads/resumes/`
- Serve via: `app.use('/uploads', express.static('uploads'))`

---

## Version History
- **v1.0** - Complete Job Seeker Module (Feb 15, 2026)
  - Profile management with education & experience
  - Job application with file uploads
  - Application tracking
  - Multi-part form handling
