import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobDetails from './pages/JobDetails';
import Applicants from './pages/Applicants';
import ApplicantDetails from './pages/ApplicantDetails';
import MyJobs from './pages/MyJobs';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import JobSeekerProfile from './pages/JobSeekerProfile';
import RecruiterProfile from './pages/RecruiterProfile';
import CompanyProfile from './pages/CompanyProfile';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/job-details/:jobId" element={<JobDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* JobSeeker Routes */}
          <Route
            path="/job-seeker"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-job"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <MyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applicants/:jobId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/applicants/:id"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <ApplicantDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/seeker/:userId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <JobSeekerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/company-profile"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Layout Component for Public Routes
function NavbarLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
