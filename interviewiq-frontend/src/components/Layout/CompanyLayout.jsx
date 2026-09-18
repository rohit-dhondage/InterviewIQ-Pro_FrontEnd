import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Briefcase, FileSearch, LogOut,
  Brain, Building, Bell, Settings
} from 'lucide-react'

const navItems = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/drives', icon: Briefcase, label: 'Placement Drives' },
  { to: '/company/candidates', icon: Users, label: 'Candidates' },
  { to: '/company/search', icon: FileSearch, label: 'Discover Talent' },
  { to: '/company/settings', icon: Settings, label: 'Company Profile' },
]

export default function CompanyLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900">
      
      {/* Sidebar - Slate Theme */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col z-10 bg-slate-900 text-slate-300 border-r border-slate-800 h-screen sticky top-0">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Brain size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            InterviewIQ <span className="text-indigo-400">Pro</span>
          </span>
        </div>
        
        <div className="px-6 pb-6 border-b border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Company Portal</div>
          <div className="text-sm font-medium text-slate-100 mt-1 truncate" title={user?.companyName || 'Tech Solutions Inc.'}>
            {user?.companyName || 'Tech Solutions Inc.'}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'hover:bg-slate-800 hover:text-slate-100'
                }`
              }>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 py-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-400 w-full">
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto z-10 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            Recruitment Dashboard
          </div>
          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{user?.fullName || 'HR Manager'}</div>
                <div className="text-xs text-slate-500">Talent Acquisition</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0) || 'H'}
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
