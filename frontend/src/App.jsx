import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import MyJobs from './pages/MyJobs';
import Messages from './pages/Messages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/job-seeker"
            element={
              <ProtectedRoute requiredRole={"jobseeker"}>
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute requiredRole={"recruiter"}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/post-job" element={<PostJob />} />
          <Route path="/job-details/:jobId" element={<JobDetails />} />
          
          <Route
            path="/applicants/:jobId"
            element={
              <ProtectedRoute requiredRole={"recruiter"}>
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute requiredRole={"recruiter"}>
                <MyJobs />
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

export default App;
