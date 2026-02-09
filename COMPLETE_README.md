# JobHub Pro - Complete MERN Recruitment Platform

A full-featured recruitment and job portal built with the MERN stack, featuring advanced recruiter management, applicant tracking, and real-time messaging.

## 🌟 Core Features

### For Recruiters
- ✅ Create, edit, and delete job postings
- ✅ View all applicants with resume URLs
- ✅ Accept/reject applications with status tracking
- ✅ Send direct messages to applicants
- ✅ Dashboard with analytics (total jobs, applications)
- ✅ Company profile management
- ✅ Manage job listings from dedicated dashboard

### For Job Seekers
- ✅ Browse and search available jobs
- ✅ View detailed job information
- ✅ Apply to jobs with resume and cover letter
- ✅ Track application status
- ✅ Receive messages from recruiters
- ✅ Manage applications

### General Features
- ✅ Secure JWT authentication (1-day expiry)
- ✅ Role-based access control (Recruiter/Job Seeker)
- ✅ Password hashing with bcrypt
- ✅ Real-time messaging system
- ✅ Responsive Tailwind CSS UI
- ✅ Protected routes
- ✅ MongoDB Atlas integration

## 📂 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema (name, email, role, companyName)
│   │   ├── Job.js                   # Job schema (title, description, requirements, etc)
│   │   ├── Application.js           # Application schema (job, applicant, status)
│   │   └── Message.js               # Message schema (sender, receiver, message)
│   ├── controllers/
│   │   ├── authController.js        # Auth endpoints
│   │   ├── jobController.js         # Job CRUD operations
│   │   ├── applicationController.js # Application management
│   │   └── messageController.js     # Messaging system
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── messageRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── roleMiddleware.js        # Role-based access
│   │   └── errorMiddleware.js       # Error handling
│   ├── server.js                    # Express server setup
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── JobDetails.jsx          # View job + apply
    │   │   ├── JobSeekerDashboard.jsx  # Browse jobs
    │   │   ├── RecruiterDashboard.jsx  # Analytics & quick actions
    │   │   ├── PostJob.jsx             # Create/edit jobs
    │   │   ├── MyJobs.jsx              # Manage recruiter jobs
    │   │   ├── Applicants.jsx          # View applicants per job
    │   │   ├── Messages.jsx            # Direct messaging
    │   │   └── Dashboard.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Loader.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

   Expected output:
   ```
   🚀 Server running on port 5000
   ✅ MongoDB Connected
   ```

### Frontend Setup

1. **Navigate to frontend directory (in another terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Recruiter or Job Seeker)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `POST /api/jobs` - Create job (Recruiter only)
- `GET /api/jobs/my` - Get recruiter's jobs (Recruiter only)
- `PUT /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter only)
- `GET /api/jobs/:id` - Get single job (public)

### Applications
- `POST /api/applications/:jobId` - Apply to job (Job Seeker only)
- `GET /api/applications/job/:jobId` - Get applicants for job (Recruiter only)
- `GET /api/applications/my` - Get my applications (Job Seeker only)
- `PUT /api/applications/:id/status` - Update application status (Recruiter only)

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/job/:jobId` - Get messages for job
- `GET /api/messages/conversation/:userId` - Get conversation with user

## 👥 User Roles & Access

### Recruiter
- Access: `/recruiter` (dashboard)
- Can: Post jobs, view applicants, accept/reject applications, message jobseekers
- Dashboard shows: Total jobs, recent applicants, quick actions

### Job Seeker
- Access: `/job-seeker` (dashboard)
- Can: Browse jobs, apply, track applications, message recruiters
- Dashboard shows: Available jobs, application status

## 🔐 Authentication Flow

1. User registers with email, password, and role
2. Backend hashes password using bcrypt
3. JWT token generated (valid for 1 day)
4. Token stored in localStorage
5. Token automatically added to all API requests
6. Auto-login on page refresh if token exists
7. Expired token triggers redirect to login

## 📝 Test Workflow

### As a Recruiter:
1. Go to `/register`
2. Select "Recruiter" role
3. Enter company name
4. Register and login
5. Go to `/recruiter` dashboard
6. Click "Post a Job"
7. Fill job details and submit
8. View applicants and manage applications

### As a Job Seeker:
1. Go to `/register`
2. Select "Job Seeker" role
3. Register and login
4. View available jobs on `/job-seeker` dashboard
5. Click on a job to view details
6. Enter resume URL and apply
7. Track application status

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

**Frontend:**
- React (Vite bundler)
- React Router DOM
- Context API
- Axios
- Tailwind CSS

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (jobseeker | recruiter),
  companyName: String (for recruiters),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  company: String (required),
  location: String (required),
  salary: Number (required),
  requirements: [String],
  jobType: String (Full-time | Part-time | Internship),
  createdBy: ObjectId (User reference),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Application Model
```javascript
{
  job: ObjectId (Job reference),
  applicant: ObjectId (User reference),
  resumeUrl: String (required),
  coverLetter: String,
  status: String (pending | accepted | rejected),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Message Model
```javascript
{
  sender: ObjectId (User reference),
  receiver: ObjectId (User reference),
  job: ObjectId (Job reference),
  message: String (required),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🎨 UI Features

- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Color Theme:** Emerald green for primary actions
- **Components:** 
  - Navigation bar with role-based menu
  - Protected routes with role checking
  - Loading states and error messages
  - Confirmation dialogs for dangerous actions
  - Status badges for applications

## 🔍 Key Implementation Details

### Protected Routes
- Routes wrapped in `ProtectedRoute` component
- Checks JWT token existence
- Validates user role (recruiter/jobseeker)
- Redirects to login if unauthorized

### Token Management
- Stored in localStorage
- Automatically added via Axios interceptor
- Auto-logout on 401 response
- One-day expiry

### Error Handling
- Try-catch in all async operations
- Meaningful error messages
- Proper HTTP status codes
- Centralized error middleware

### Data Validation
- Frontend: Form validation before submission
- Backend: Schema validation with Mongoose
- Email format validation
- Password strength requirements
- Required field checks

## 📱 Frontend Routes

```
/                       - Landing page
/login                  - Login page
/register               - Registration page
/jobs                   - Browse all jobs (public)

/job-seeker            - Job seeker dashboard (protected)
/recruiter             - Recruiter dashboard (protected)
/job-details/:jobId    - Job details & apply (protected)
/my-jobs               - Recruiter job management (protected)
/post-job              - Create/edit job (protected)
/applicants/:jobId     - View job applicants (protected)
/messages              - Messaging system (protected)
```

## 🚨 Common Issues & Solutions

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**MongoDB connection issues:**
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network access is granted

**CORS errors:**
- Backend has CORS enabled for all origins
- Frontend API URL must match `VITE_API_URL`

**Token expired:**
- Users will be redirected to login
- Clear localStorage and re-login

## 📚 Future Enhancements

- [ ] Email notifications for application status
- [ ] Advanced job search and filtering
- [ ] Batch applicant import from CSV
- [ ] Analytics dashboard for recruiters
- [ ] Saved jobs feature for job seekers
- [ ] Review and rating system
- [ ] Video interview integration
- [ ] Payment system for premium features
- [ ] Notification bell with real-time updates
- [ ] Social media integration

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ - A complete MERN recruitment platform**
