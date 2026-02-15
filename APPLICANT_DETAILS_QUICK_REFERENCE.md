# ApplicantDetails - Quick Reference Guide

## 📍 Route
```
/recruiter/applicants/:id
```

## 🔗 Quick Navigation Links

### From Applicants List
```jsx
navigate(`/recruiter/applicants/${application._id}`)
```

### Using React Router
```jsx
<Link to={`/recruiter/applicants/${id}`}>View Details</Link>
```

---

## 📊 Data Flow

```
ApplicantDetails Component
    ↓
useEffect (mount)
    ↓
GET /api/applications/:id (with JWT token)
    ↓
API Service
    ↓
Backend Controller (getApplicationDetails)
    ↓
MongoDB Query
    ↓
Return populated application data
    ↓
Display in UI
```

---

## 🎬 Component States

### 1. Loading State
```jsx
// Shows spinner + "Loading applicant details..."
{loading && <LoadingSpinner />}
```

### 2. Error State
```jsx
// Shows error message + Go Back button
{error && <ErrorMessage error={error} />}
```

### 3. Loaded State
```jsx
// Full applicant details page with all sections
{!loading && !error && <FullPage />}
```

---

## 🎨 Collapsible Sections

### Default States
- `coverLetter`: false (collapsed)
- `questions`: true (expanded)
- `links`: true (expanded)
- `resume`: true (expanded)

### Toggle Function
```jsx
const toggleSection = (section) => {
  setExpandedSections((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
};
```

---

## 🔘 Action Buttons

### 1. Change Status
- Opens modal with status dropdown
- Saves via `PUT /api/applications/:id/status`
- Updates UI immediately on success

### 2. Schedule Interview
- Opens modal with date/time picker
- Optional message textarea
- Saves via `PATCH /api/applications/:id/schedule-interview`
- Shows interview info card on success

### 3. Message Candidate
- Navigates to messages page
- Pre-fills candidate ID

### 4. Download Resume
- Triggers browser download
- Uses resume URL

### 5. Reject Application
- Opens confirmation modal
- Optional rejection reason
- Saves via `PATCH /api/applications/:id/reject`
- Status changes to "Rejected" immediately

---

## 🌐 Responsive Grid

```
Desktop (md:col-span-8 + md:col-span-4)
├── Main Content (8 cols)
│   ├── Header Card
│   ├── Job Details
│   ├── Cover Letter
│   ├── Links
│   ├── Questions
│   └── Resume
│
└── Sticky Sidebar (4 cols)
    ├── Status Info
    ├── Action Buttons
    └── Interview Info

Mobile/Tablet
└── Single Column (full width)
    with all sections stacked
```

---

## 🎯 Key Props Usage

### StatusBadge
```jsx
<StatusBadge 
  status={application.status} 
  size="lg" 
/>
```

### InfoCard
```jsx
<InfoCard 
  label="Email" 
  value={applicant.email} 
  icon={Mail}
/>
```

### ActionButton
```jsx
<ActionButton
  label="Schedule Interview"
  icon={Calendar}
  variant="primary"
  fullWidth
  onClick={handleScheduleInterview}
  disabled={isDisabled}
/>
```

### SectionHeader
```jsx
<SectionHeader
  icon={Briefcase}
  title="Job Details"
  description={job.title}
/>
```

---

## 🔐 Authentication

All endpoints require:
```javascript
Headers: {
  "Authorization": "Bearer {jwtToken}",
  "Content-Type": "application/json"
}
```

JWT token is automatically added by API interceptor in `services/api.js`

---

## 📲 Mobile UX Features

1. **Collapsible Sections**
   - By default, cover letter is collapsed
   - Questions, links, resume are expanded
   - Tap chevron to toggle

2. **Full-Width Buttons**
   - All buttons take full width on mobile
   - Stacked vertically in sidebar

3. **Touch-Friendly**
   - Large hit targets (minimum 44px)
   - Adequate spacing between interactive elements

4. **Responsive Grid**
   - 1 column on mobile
   - 2 columns on tablet
   - 3 columns (8-4 split) on desktop

---

## 🔄 Status Workflow

```
New (Initial)
  ↓ (Recruiter reviews)
Reviewed
  ↓ (Decision made)
Shortlisted
  ↓ (OR rejected)
Interview Scheduled ─ Rejected (terminal)
  ↓ (OR rejected)
Hired (terminal)
```

---

## ✅ API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "application": {
    "_id": "...",
    "job": { /* populated */ },
    "applicant": { /* populated */ },
    "status": "Shortlisted",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🎛️ Configuration

### Tailwind Colors
```javascript
// Primary (Emerald Green)
primary-500: #22c55e
primary-600: #16a34a
primary-700: #15803d

// Secondary (Slate)
secondary-50: #f8fafc
secondary-900: #0f172a
```

### Icon Library
All icons from `lucide-react`:
```jsx
import { Mail, Phone, Calendar, ... } from 'lucide-react'
```

---

## 🧪 Common Tasks

### Navigate to ApplicantDetails
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate(`/recruiter/applicants/${applicationId}`);
```

### Fetch Application Data
```javascript
const response = await api.get(`/applications/${id}`);
const { application } = response.data;
```

### Update Status
```javascript
await api.put(`/applications/${id}/status`, {
  status: 'Shortlisted'
});
```

### Schedule Interview
```javascript
await api.patch(`/applications/${id}/schedule-interview`, {
  interviewDate: '2024-12-25T10:00:00Z',
  interviewMessage: 'Join via Zoom...'
});
```

### Reject Application
```javascript
await api.patch(`/applications/${id}/reject`, {
  rejectionReason: 'Not a good fit'
});
```

---

## 📸 UI Sections

1. **Header** - Candidate info + status badge
2. **Job Details** - Title, description, skills
3. **Cover Letter** - Expandable text section
4. **Links** - Portfolio, LinkedIn, GitHub, Projects
5. **Custom Answers** - Q&A pairs
6. **Resume** - Preview + download
7. **Sidebar** - Status info + action buttons

---

## ⚡ Performance Tips

1. **Memoization**
   - Consider wrapping reusable components with `React.memo()`
   
2. **Code Splitting**
   - ApplicantDetails is already lazy-loaded via React Router

3. **Image Optimization**
   - Resume iframe loads on-demand

4. **API Caching**
   - Consider caching application data in state

---

## 🐛 Debug Tips

1. **Check URL Params**
   - Verify ID is in URL: `/recruiter/applicants/:id`

2. **Check JWT Token**
   - `localStorage.getItem('token')`

3. **Network Tab**
   - Check API requests/responses
   - Verify correct endpoints

4. **Console Logs**
   - Check for JavaScript errors
   - Look for API error messages

5. **Redux DevTools**
   - If using Redux for state management

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| 404 Application not found | Verify correct application ID in URL |
| Unauthorized access | Check JWT token, verify recruiter role |
| API not responding | Check backend is running, CORS enabled |
| Sections not collapsing | Check browser console for errors |
| Resume not loading | Verify resume URL is valid, accessible |
| Icons not showing | Check lucide-react is installed |

---

## 📚 Related Files

- `frontend/src/pages/ApplicantDetails.jsx` - Main component
- `frontend/src/components/recruiter/StatusBadge.jsx` - Status badge
- `frontend/src/components/recruiter/InfoCard.jsx` - Info card
- `frontend/src/components/recruiter/ActionButton.jsx` - Action button
- `frontend/src/components/recruiter/SectionHeader.jsx` - Section header
- `backend/controllers/applicationController.js` - API endpoints
- `backend/models/Application.js` - Data schema
- `backend/routes/applicationRoutes.js` - Route definitions

---

**Last Updated:** February 2026
