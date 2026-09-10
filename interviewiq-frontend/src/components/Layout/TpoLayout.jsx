import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, Briefcase, FileText, LogOut } from 'lucide-react'

const navItems = [
  { to: '/tpo/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tpo/students',     icon: Users,           label: 'Students' },
  { to: '/tpo/drives',       icon: Briefcase,       label: 'Placement Drives' },
  { to: '/tpo/applications', icon: FileText,        label: 'Applications' },
]

export default function TpoLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="orb orb-1" /><div className="orb orb-2" />
      <aside className="w-60 flex-shrink-0 flex flex-col z-10"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', position: 'sticky', top: 0, height: '100vh' }}>
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>🧠</div>
          <span className="font-bold text-sm tracking-tight">
            InterviewIQ <span style={{ color: 'var(--primary-light)' }}>Pro</span>
          </span>
        </div>
        <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="px-3 py-1">
            <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>TPO PORTAL</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={16} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
              {user?.fullName?.charAt(0) || 'T'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user?.fullName}</div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>TPO Officer</div>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item w-full text-left">
            <LogOut size={16} /><span>Log out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto z-10"><Outlet /></main>
    </div>
  )
}
