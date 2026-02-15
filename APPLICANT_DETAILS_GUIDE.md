# Applicant Details Page - Implementation Guide

## 📋 Overview

This document provides a comprehensive guide to the Applicant Details page implementation for the recruiter module of the Job Portal. The ApplicantDetails page is a fully responsive, feature-rich component that allows recruiters to view detailed information about job applicants and manage their applications.

## 🎯 Features Implemented

### 1. **Responsive Design**
- ✅ Mobile-optimized (collapsible sections)
- ✅ Tablet layout (2-column grid)
- ✅ Desktop layout (main content + sticky sidebar)
- ✅ Sticky action panel on desktop
- ✅ Collapsible sections on mobile for better UX

### 2. **Applicant Information**
- ✅ Profile photo with initials
- ✅ Full name, headline, and location
- ✅ Contact information (email, phone)
- ✅ Application date
- ✅ Current status badge (color-coded)

### 3. **Job Details Section**
- ✅ Job title and description
- ✅ Experience level requirement
- ✅ Skills tags
- ✅ Job posting date

### 4. **Application Content**
- ✅ Expandable cover letter section
- ✅ Custom question-answer pairs
- ✅ Links section (Portfolio, LinkedIn, GitHub, Major Project)
- ✅ Resume preview and download

### 5. **Action Management**
- ✅ Change application status
- ✅ Schedule interview
- ✅ Message candidate
- ✅ Download resume
- ✅ Reject application
- ✅ Rate applicant (future enhancement)

### 6. **Status System**
- ✅ New (Blue)
- ✅ Reviewed (Yellow)
- ✅ Shortlisted (Purple)
- ✅ Interview Scheduled (Indigo)
- ✅ Rejected (Red)
- ✅ Hired (Green)

---

## 📁 File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── ApplicantDetails.jsx        # Main page component (new)
│   │   ├── Applicants.jsx              # Updated with link to details
│   │   └── App.jsx                     # Updated with new route
│   │
│   ├── components/
│   │   └── recruiter/
│   │       ├── StatusBadge.jsx         # Status badge component (new)
│   │       ├── InfoCard.jsx            # Info card component (new)
│   │       ├── ActionButton.jsx        # Action button component (new)
│   │       └── SectionHeader.jsx       # Section header component (new)
│   │
│   └── layouts/
│       └── RecruiterLayout.jsx         # (existing)

backend/
├── models/
│   └── Application.js                  # Updated with new fields
│
├── controllers/
│   └── applicationController.js        # Updated with new endpoints
│
└── routes/
    └── applicationRoutes.js            # Updated with new routes
```

---

## 🔧 Backend Implementation

### 1. **Updated Application Model** (`backend/models/Application.js`)

New fields added:
```javascript
{
  job: ObjectId (ref: Job),              // Job reference
  applicant: ObjectId (ref: User),       // Candidate reference
  recruiter: ObjectId (ref: User),       // Recruiter reference
  resumeUrl: String (required),          // Resume URL
  coverLetter: String,                   // Cover letter text
  portfolioLink: String,                 // Portfolio URL
  linkedinLink: String,                  // LinkedIn URL
  githubLink: String,                    // GitHub URL
  majorProjectLink: String,              // Major project URL
  answers: [{
    question: String,                    // Custom question
    answer: String                       // Candidate answer
  }],
  status: Enum (New, Reviewed, Shortlisted, Interview Scheduled, Rejected, Hired),
  interviewScheduledAt: Date,            // Interview date/time
  interviewMessage: String,              // Interview details
  rejectionReason: String,               // Reason for rejection
  rating: Number (0-5),                  // Recruiter rating
  notes: String,                         // Recruiter notes
  appliedAt: Date,                       // Application date
  timestamps: true                       // createdAt, updatedAt
}
```

### 2. **New API Endpoints**

#### Get Single Application Details
```
GET /api/applications/:id
Authorization: Bearer {token}
Role: recruiter

Response:
{
  success: true,
  application: {
    _id: ObjectId,
    job: { /* job details */ },
    applicant: { /* applicant details */ },
    ...
  }
}
```

#### Update Application Status
```
PUT /api/applications/:id/status
Authorization: Bearer {token}
Role: recruiter

Request Body:
{
  status: "Shortlisted" | "Reviewed" | "New" | "Interview Scheduled" | "Rejected" | "Hired"
}

Response:
{
  success: true,
  message: "Application status updated",
  application: { /* updated application */ }
}
```

#### Schedule Interview
```
PATCH /api/applications/:id/schedule-interview
Authorization: Bearer {token}
Role: recruiter

Request Body:
{
  interviewDate: "2024-12-25T10:00:00Z",
  interviewMessage: "Join via Zoom: https://..."
}

Response:
{
  success: true,
  message: "Interview scheduled successfully",
  application: { /* updated application */ }
}
```

#### Reject Application
```
PATCH /api/applications/:id/reject
Authorization: Bearer {token}
Role: recruiter

Request Body:
{
  rejectionReason: "Not a good fit for the role"
}

Response:
{
  success: true,
  message: "Application rejected",
  application: { /* updated application */ }
}
```

#### Rate Applicant
```
PATCH /api/applications/:id/rate
Authorization: Bearer {token}
Role: recruiter

Request Body:
{
  rating: 4,
  notes: "Strong technical skills, good communication"
}

Response:
{
  success: true,
  message: "Applicant rated successfully",
  application: { /* updated application */ }
}
```

---

## 🎨 Frontend Implementation

### 1. **Reusable Components**

#### StatusBadge.jsx
```jsx
<StatusBadge status="Shortlisted" size="md" />
// Props: status (required), size: 'sm' | 'md' | 'lg'
```

#### InfoCard.jsx
```jsx
<InfoCard 
  label="Email" 
  value="john@example.com" 
  icon={Mail}
  clickable={false}
/>
// Props: label, value, icon (lucide), clickable, onClick
```

#### ActionButton.jsx
```jsx
<ActionButton 
  label="Schedule Interview" 
  icon={Calendar}
  variant="primary"
  size="md"
  fullWidth={false}
  loading={false}
  onClick={handleClick}
/>
// Props: label, icon, variant: 'primary' | 'secondary' | 'danger', etc.
```

#### SectionHeader.jsx
```jsx
<SectionHeader 
  icon={Briefcase}
  title="Job Details"
  description="Senior Developer"
  action={<button>Action</button>}
/>
// Props: icon, title (required), description, action
```

### 2. **Main Page Component**

**Route:** `/recruiter/applicants/:id`

**Key Features:**
- Loading state with spinner
- Error handling with retry option
- Expandable/Collapsible sections
- Modal dialogs for actions (status, interview, reject)
- Sticky sidebar on desktop
- Fully responsive layout

**State Management:**
```javascript
const [application, setApplication] = useState(null);
const [loading, setLoading] = useState(true);
const [expandedSections, setExpandedSections] = useState({
  coverLetter: false,
  questions: true,
  links: true,
  resume: true,
});
const [showStatusModal, setShowStatusModal] = useState(false);
const [showInterviewModal, setShowInterviewModal] = useState(false);
const [showRejectModal, setShowRejectModal] = useState(false);
```

---

## 🚀 Setup Instructions

### Backend Setup

1. **Update Application Model:**
   ```bash
   # File: backend/models/Application.js
   # Already updated with new fields
   ```

2. **Update Controller:**
   ```bash
   # File: backend/controllers/applicationController.js
   # Already updated with new endpoints
   ```

3. **Update Routes:**
   ```bash
   # File: backend/routes/applicationRoutes.js
   # Already updated with new routes
   ```

4. **Restart Backend:**
   ```bash
   cd backend
   npm start
   ```

### Frontend Setup

1. **Create New Components:**
   ```bash
   # Already created in frontend/src/components/recruiter/
   # - StatusBadge.jsx
   # - InfoCard.jsx
   # - ActionButton.jsx
   # - SectionHeader.jsx
   ```

2. **Create ApplicantDetails Page:**
   ```bash
   # File: frontend/src/pages/ApplicantDetails.jsx
   # Already created
   ```

3. **Update App.jsx:**
   ```bash
   # File: frontend/src/App.jsx
   # Added route: /recruiter/applicants/:id
   ```

4. **Update Applicants.jsx:**
   ```bash
   # File: frontend/src/pages/Applicants.jsx
   # Added "View Details" button linking to ApplicantDetails
   ```

5. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🎯 Usage Guide

### For Recruiters

1. **Navigate to Applicants:**
   - Go to Dashboard → Click on a Job → View Applicants

2. **View Applicant Details:**
   - Click "View Details" button on any applicant card
   - Or click on the applicant name

3. **Manage Application:**
   - Use sidebar buttons to schedule interviews, message, or reject
   - Click "Change Status" to update application status
   - Expand sections to view more information

4. **Schedule Interview:**
   - Click "Schedule Interview" button
   - Select date and time
   - Add interview details (Zoom link, instructions)
   - Click "Schedule"

5. **Reject Application:**
   - Click "Reject" button
   - Add optional rejection reason
   - Confirm rejection

---

## 🎨 Styling & Theme

### Color Scheme
- Primary: `#22c55e` (Emerald Green)
- Secondary: Slate gray shades
- Status colors:
  - New: Blue  
  - Reviewed: Yellow
  - Shortlisted: Purple
  - Interview Scheduled: Indigo
  - Rejected: Red
  - Hired: Green

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🔒 Security & Authorization

- ✅ JWT token authentication required
- ✅ Role-based access control (Recruiter only)
- ✅ Recruiter ownership verification
- ✅ Input validation on all endpoints
- ✅ Error handling with proper status codes

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Collapsible sections by default
- Full-width buttons
- Bottom action drawer
- Stack sidebar below main content

### Tablet (640px - 1024px)
- 2-column layout
- Side-by-side content and sidebar
- Responsive grid for links
- Optimized spacing

### Desktop (> 1024px)
- 8-column content + 4-column sticky sidebar
- Expanded sections by default
- Horizontal action layout
- Optimized typography

---

## 🐛 Troubleshooting

### API Connection Issues
1. Verify backend is running on port 5000
2. Check CORS configuration in server.js
3. Verify JWT token in localStorage
4. Check network tab in browser DevTools

### Display Issues
1. Clear browser cache
2. Restart dev server
3. Check console for JavaScript errors
4. Verify Tailwind CSS is properly configured

### Data Not Loading
1. Check if applicant ID exists in URL
2. Verify recruiter owns the application's job
3. Check backend logs for errors
4. Verify database connection

---

## 📋 Testing Checklist

- ✅ Page loads without errors
- ✅ Applicant information displays correctly
- ✅ Status badge shows correct color
- ✅ Links open in new tab
- ✅ Resume preview loads
- ✅ Resume download works
- ✅ Status update saves correctly
- ✅ Interview scheduling works
- ✅ Rejection saves with reason
- ✅ Message link navigates correctly
- ✅ Mobile layout is responsive
- ✅ Sections collapse/expand smoothly
- ✅ Modals display and close properly
- ✅ Error states display correctly

---

## 🚀 Future Enhancements

1. **Real-time Notifications**
   - Socket.io integration for live updates
   - Notify applicants of status changes

2. **Advanced Filtering**
   - Filter by date range
   - Filter by rating
   - Save custom filters

3. **Interview Integration**
   - Calendar sync
   - Automated reminder emails
   - Video interview scheduling

4. **Analytics**
   - Applicant response time tracking
   - Conversion funnel analytics
   - Recruiter performance metrics

5. **Bulk Actions**
   - Bulk status updates
   - Bulk messaging
   - Bulk export to CSV

6. **Interview Feedback**
   - Post-interview rating
   - Feedback templates
   - Structured evaluation forms

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Verify all files are updated
4. Restart both backend and frontend servers
5. Clear browser cache and localStorage

---

## 📄 License

This implementation is part of the Job Portal project.

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
