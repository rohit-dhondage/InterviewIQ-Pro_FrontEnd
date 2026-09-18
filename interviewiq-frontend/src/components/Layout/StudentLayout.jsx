import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Home, Video, FileText, Map, Briefcase, 
  BarChart3, User, LogOut, Brain, Settings, Target, HelpCircle
} from 'lucide-react'

const navItems = [
  { to: '/student/dashboard', icon: Home, label: 'Home' },
  { to: '/student/interviews', icon: Video, label: 'AI Interview' },
  { to: '/student/resume', icon: FileText, label: 'Resume Analyzer' },
  { to: '/student/roadmap', icon: Map, label: 'Learning Roadmap' },
  { to: '/student/practice', icon: Target, label: 'Practice' },
  { to: '/student/analytics', icon: BarChart3, label: 'My Progress' },
  { to: '/student/drives', icon: Briefcase, label: 'Placement Drives' },
  { to: '/student/skill-gap', icon: Brain, label: 'Skill Gap Analysis' },
  { to: '/student/doubts', icon: HelpCircle, label: 'Doubt Solver' },
  { to: '/student/profile', icon: User, label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900">
      
      {/* Sidebar - Dark Theme */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col z-10 bg-[#0B1120] text-slate-300 border-r border-slate-800/50 h-screen sticky top-0">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Brain size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            InterviewIQ <span className="text-blue-500">Pro</span>
          </span>
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
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 w-full mb-2">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full">
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content - Light Theme */}
      <main className="flex-1 overflow-auto z-10 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Home size={16} /> / Dashboard
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{user?.fullName || 'Student Name'}</div>
                <div className="text-xs text-slate-500">Student</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0) || 'S'}
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
