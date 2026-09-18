import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Briefcase, FileText, BarChart3, LogOut,
  Brain, FileCheck, FileBarChart, Settings, Bell
} from 'lucide-react'

const navItems = [
  { to: '/tpo/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tpo/students', icon: Users, label: 'Students' },
  { to: '/tpo/drives', icon: Briefcase, label: 'Placement Drives' },
  { to: '/tpo/eligibility', icon: FileCheck, label: 'Eligibility & Screening' },
  { to: '/tpo/applications', icon: FileText, label: 'Applications' },
  { to: '/tpo/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/tpo/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/tpo/settings', icon: Settings, label: 'Settings' },
]

export default function TpoLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900">
      
      {/* Sidebar - Dark Theme */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col z-10 bg-[#0B1120] text-slate-300 border-r border-slate-800/50 h-screen sticky top-0">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Brain size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            InterviewIQ <span className="text-blue-500">Pro</span>
          </span>
        </div>
        
        <div className="px-6 pb-6 border-b border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">TPO Portal</div>
          <div className="text-sm font-medium text-slate-300 mt-1 truncate" title={user?.collegeName || 'D. J. Sanghvi College'}>
            {user?.collegeName || 'D. J. Sanghvi College'}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 py-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full">
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content - Light Theme */}
      <main className="flex-1 overflow-auto z-10 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-20">
          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{user?.fullName || 'TPO Officer'}</div>
                <div className="text-xs text-slate-500">Placement Cell</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0) || 'T'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
