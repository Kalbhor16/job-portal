# Job Seeker Module - Quick Reference & Code Snippets

## Quick API Reference

### Import Statements (All Services)
```jsx
import {
  profileService,
  jobService,
  applicationService,
  interviewService,
  savedJobService,
  messageService,
  notificationService,
  authService
} from '../../services/apiService';
```

## Common Patterns

### 1. Fetch Data with Loading/Error
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMethod();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### 2. Form Submission
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await apiService.postMethod(formData);
    alert('Success: ' + response.data.message);
  } catch (err) {
    alert('Error: ' + err.response?.data?.message);
  }
};
```

### 3. Status Badge Component
```jsx
const getStatusColor = (status) => {
  const colors = {
    'New': 'bg-blue-100 text-blue-800',
    'Reviewed': 'bg-yellow-100 text-yellow-800',
    'Shortlisted': 'bg-green-100 text-green-800',
    'Interview Scheduled': 'bg-purple-100 text-purple-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Hired': 'bg-emerald-100 text-emerald-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Usage:
<span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(status)}`}>
  {status}
</span>
```

### 4. Format Salary
```jsx
const formatSalary = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};
```

### 5. Format Date
```jsx
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
```

## Key Component Examples

### Profile Update Form
```jsx
const [formData, setFormData] = useState({
  fullName: '',
  phone: '',
  headline: '',
  summary: '',
  experienceLevel: 'Entry',
  location: '',
  portfolioLink: '',
  linkedinLink: '',
  githubLink: '',
  majorProjectLink: '',
  skills: [],
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSkillAdd = (skill) => {
  setFormData(prev => ({
    ...prev,
    skills: [...prev.skills, skill]
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await profileService.updateProfile(formData);
    alert('Profile updated successfully');
  } catch (err) {
    console.error('Error:', err);
  }
};
```

### Application Form with Dynamic Questions
```jsx
const [application, setApplication] = useState({
  coverLetter: '',
  portfolioLink: '',
  linkedinLink: '',
  githubLink: '',
  majorProjectLink: '',
  answers: {}, // { questionId: answer }
});

const [job, setJob] = useState(null);

useEffect(() => {
  fetchJob();
}, [jobId]);

const fetchJob = async () => {
  const response = await jobService.getJobById(jobId);
  setJob(response.data.job);
};

const handleAnswerChange = (questionId, answer) => {
  setApplication(prev => ({
    ...prev,
    answers: {
      ...prev.answers,
      [questionId]: answer
    }
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('coverLetter', application.coverLetter);
    formData.append('portfolioLink', application.portfolioLink);
    // ... other fields
    formData.append('answers', JSON.stringify(application.answers));
    
    await applicationService.applyJob(jobId, formData);
    alert('Application submitted successfully');
    navigate('/applications');
  } catch (err) {
    console.error('Error:', err);
  }
};

// Render form fields based on job requirements
const renderCustomQuestion = (question) => {
  switch(question.type) {
    case 'text':
      return (
        <input
          type="text"
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder={question.questionText}
          required={question.required}
        />
      );
    case 'textarea':
      return (
        <textarea
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder={question.questionText}
          required={question.required}
          rows="4"
        />
      );
    case 'yes/no':
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={question._id}
              value="Yes"
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              required={question.required}
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={question._id}
              value="No"
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              required={question.required}
            />
            No
          </label>
        </div>
      );
    case 'multiple-choice':
      return (
        <select
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required={question.required}
        >
          <option value="">Select an option</option>
          {question.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    default:
      return null;
  }
};
```

### Tabbed Profile Editor
```jsx
const [activeTab, setActiveTab] = useState('basicInfo');

const tabs = [
  { id: 'basicInfo', label: 'Basic Information' },
  { id: 'links', label: 'Links' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'resume', label: 'Resume' },
  { id: 'certifications', label: 'Certifications' },
];

return (
  <div className="space-y-6">
    {/* Tab Navigation */}
    <div className="flex flex-wrap gap-2 border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === tab.id
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* Tab Content */}
    <div>
      {activeTab === 'basicInfo' && <BasicInfoTab />}
      {activeTab === 'links' && <LinksTab />}
      {activeTab === 'skills' && <SkillsTab />}
      {activeTab === 'education' && <EducationTab />}
      {activeTab === 'experience' && <ExperienceTab />}
      {activeTab === 'resume' && <ResumeTab />}
      {activeTab === 'certifications' && <CertificationsTab />}
    </div>
  </div>
);
```

### Interview Confirmation Modal
```jsx
const [interview, setInterview] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);

const handleConfirm = async () => {
  try {
    await interviewService.confirmInterview(interview._id);
    alert('Interview confirmed');
    setShowConfirmModal(false);
    // Refresh interview
  } catch (err) {
    alert('Error confirming interview');
  }
};

const handleRescheduleRequest = async (reason, proposedDate) => {
  try {
    await interviewService.requestReschedule(interview._id, {
      reason,
      proposedDate,
    });
    alert('Reschedule request sent');
  } catch (err) {
    alert('Error requesting reschedule');
  }
};

// Modal Component
const [{...modals
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white rounded-lg p-6 max-w-md w-full">
    <h2 className="text-xl font-bold mb-4">Interview Details</h2>
    
    <div className="space-y-3 mb-6 text-sm">
      <p><span className="font-semibold">Date:</span> {formatDateTime(interview.scheduledAt)}</p>
      <p><span className="font-semibold">Type:</span> {interview.interviewType}</p>
      {interview.interviewType === 'Online' && (
        <p><span className="font-semibold">Link:</span> {interview.meetingLink}</p>
      )}
      {interview.interviewType === 'Offline' && (
        <p><span className="font-semibold">Location:</span> {interview.location}</p>
      )}
    </div>

    <div className="flex gap-2">
      <button
        onClick={handleConfirm}
        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Confirm
      </button>
      <button
        onClick={() => setShowConfirmModal(false)}
        className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
```

### Message Thread Component
```jsx
const [messages, setMessages] = useState([]);
const [messageInput, setMessageInput] = useState('');

const fetchMessages = async (jobId) => {
  const response = await messageService.getMessages(jobId);
  setMessages(response.data.messages);
};

const handleSendMessage = async () => {
  if (!messageInput.trim()) return;
  
  try {
    await messageService.sendMessage({
      receiver: receiverId,
      jobId: jobId,
      message: messageInput,
    });
    setMessageInput('');
    fetchMessages(jobId);
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

return (
  <div className="flex flex-col h-screen">
    {/* Messages List */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => (
        <div
          key={msg._id}
          className={`flex ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-xs px-4 py-2 rounded-lg ${
            msg.sender._id === currentUserId
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}>
            <p>{msg.message}</p>
            <p className="text-xs opacity-70">{formatTime(msg.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Message Input */}
    <div className="border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Send
        </button>
      </div>
    </div>
  </div>
);
```

## Useful Constants

```jsx
// Job Types
const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

// Experience Levels
const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead', 'Director'];

// Application Statuses
const APP_STATUSES = [
  'New',
  'Reviewed',
  'Shortlisted',
  'Interview Scheduled',
  'Rejected',
  'Hired',
];

// Interview Types
const INTERVIEW_TYPES = ['Online', 'Offline', 'Phone'];

// Interview Statuses
const INTERVIEW_STATUSES = [
  'Scheduled',
  'Completed',
  'Cancelled',
  'No-Show',
  'Rescheduled',
];
```

## Form Validation Helpers

```jsx
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-()]{10,}$/;
  return re.test(phone);
};

const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateProfileComplete = (profile) => {
  return !!(
    profile.fullName &&
    profile.email &&
    profile.phone &&
    profile.location &&
    profile.skills?.length > 0 &&
    profile.experienceLevel
  );
};
```

## Environment Variables (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_JWT_EXPIRES_IN=86400000
```

## Protected Route Wrapper

```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

// Usage:
<Route
  path="/profile"
  element={
    <ProtectedRoute requiredRole="jobseeker">
      <EditProfile />
    </ProtectedRoute>
  }
/>
```

## Toast Notification Component (Optional)

```jsx
const [toast, setToast] = useState(null);

const showToast = (message, type = 'success') => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

// Usage:
showToast('Profile updated successfully', 'success');
showToast('Error updating profile', 'error');

// Component:
{toast && (
  <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg text-white ${
    toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`}>
    {toast.message}
  </div>
)}
```

## Dark Mode Support (Optional)

```jsx
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
});

useEffect(() => {
  localStorage.setItem('darkMode', darkMode);
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

---

Use these snippets as templates for building the remaining frontend pages. All API integration points are ready through the `apiService.js` file created earlier.
