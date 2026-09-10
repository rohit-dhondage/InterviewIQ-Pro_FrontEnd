import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>🧠</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    const redirect = user.role === 'STUDENT' ? '/student' : user.role === 'TPO' ? '/tpo' : '/admin'
    return <Navigate to={redirect} replace />
  }

  return children
}
