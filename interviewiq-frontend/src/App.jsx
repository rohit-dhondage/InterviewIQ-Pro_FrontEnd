import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/Layout/ProtectedRoute'

// Public Pages
import Landing from './pages/Landing'

// Auth Pages (Portals)
import StudentLogin from './pages/auth/StudentLogin'
// import StudentRegister from './pages/auth/StudentRegister' // TODO: Implement StudentRegister
import TpoLogin from './pages/auth/TpoLogin'
import AdminLogin from './pages/auth/AdminLogin'
import CompanyLogin from './pages/auth/CompanyLogin'

// Student Pages
import StudentLayout from './components/Layout/StudentLayout'
import StudentDashboard from './pages/student/Dashboard'
import StudentDrives from './pages/student/Drives'
import StudentInterviews from './pages/student/Interviews'
import InterviewSession from './pages/student/InterviewSession'
import StudentAnalytics from './pages/student/Analytics'
import StudentProfile from './pages/student/Profile'

// TPO Pages
import TpoLayout from './components/Layout/TpoLayout'
import TpoDashboard from './pages/tpo/Dashboard'
import TpoStudents from './pages/tpo/Students'
import TpoDrives from './pages/tpo/Drives'
import TpoApplications from './pages/tpo/Applications'
import TpoAnalytics from './pages/tpo/Analytics'

// Admin Pages
import AdminLayout from './components/Layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminColleges from './pages/admin/Colleges'
import AdminCompanies from './pages/admin/Companies'
import AdminTpos from './pages/admin/Tpos'

// Company Pages
import CompanyLayout from './components/Layout/CompanyLayout'
import CompanyDashboard from './pages/company/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth / Portals */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<Navigate to="/student/login" replace />} /> {/* Placeholder */}
          <Route path="/institution/tpo/login" element={<TpoLogin />} />
          <Route path="/institution/admin/login" element={<AdminLogin />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          
          {/* Redirect old generic login/register */}
          <Route path="/login" element={<Navigate to="/student/login" replace />} />
          <Route path="/register" element={<Navigate to="/student/register" replace />} />

          {/* Student Portal */}
          <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="drives" element={<StudentDrives />} />
            <Route path="interviews" element={<StudentInterviews />} />
            <Route path="interviews/:sessionId" element={<InterviewSession />} />
            <Route path="analytics" element={<StudentAnalytics />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* TPO Portal */}
          <Route path="/tpo" element={<ProtectedRoute role="TPO"><TpoLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TpoDashboard />} />
            <Route path="students" element={<TpoStudents />} />
            <Route path="drives" element={<TpoDrives />} />
            <Route path="applications" element={<TpoApplications />} />
            <Route path="analytics" element={<TpoAnalytics />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="colleges" element={<AdminColleges />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="tpos" element={<AdminTpos />} />
          </Route>

          {/* Company Portal */}
          <Route path="/company" element={<ProtectedRoute role="RECRUITER"><CompanyLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
