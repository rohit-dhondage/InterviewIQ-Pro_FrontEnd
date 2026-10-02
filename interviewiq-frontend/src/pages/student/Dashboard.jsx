import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Calendar, Target, Zap, Loader2, ArrowRight, Brain, FileText, CheckCircle } from 'lucide-react'
import api from '../../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ applications: 0, upcoming: 0, avgScore: 0, sessions: 0, questions: 0 })
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  
  useEffect(() => {
    const load = async () => {
      try {
        const [historyRes, upcomingRes, drivesRes, analyticsRes] = await Promise.all([
          api.get('/interviews/history/me').catch(() => ({ data: [] })),
          api.get('/interviews/upcoming/me').catch(() => ({ data: [] })),
          api.get('/students/me/jobs/drives').catch(() => ({ data: [] })),
          api.get('/analytics/me').catch(() => ({ data: null })),
        ])

        const history = Array.isArray(historyRes.data) ? historyRes.data : []
        const upcoming = Array.isArray(upcomingRes.data) ? upcomingRes.data : []
        const drives = Array.isArray(drivesRes.data) ? drivesRes.data : []
        const analytics = analyticsRes.data

        const scores = history.map(h => h.readinessScore || h.overallScore || h.score).filter(s => s != null)
        const calculatedAvg = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : (analytics?.overallReadiness ?? 0)

        const sessionCount = history.length || analytics?.totalSessions || 0

        setStats({
          applications: drives.length,
          upcoming: upcoming.length,
          avgScore: calculatedAvg,
          sessions: sessionCount,
          questions: (sessionCount * 12) + (scores.length * 15),
        })

        // Populate upcoming items from live drives or real actions
        if (drives.length > 0) {
          const items = drives.slice(0, 3).map((drive, idx) => ({
            id: drive.id || idx,
            title: `${drive.companyName || drive.title || 'Placement Drive'} Recruitment`,
            time: drive.driveDate || drive.deadline ? `${drive.driveDate || drive.deadline}` : 'Upcoming Campus Drive',
            icon: Briefcase,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            btn: 'Apply Now',
            action: () => navigate('/student/drives')
          }))
          setUpcomingInterviews(items)
        } else {
          setUpcomingInterviews([
            { id: '1', title: 'AI Technical Interview Practice', time: 'Recommended Today', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50', btn: 'Start Session', action: () => navigate('/student/practice') },
            { id: '2', title: 'ATS Resume Analysis Check', time: 'Pending Review', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', btn: 'Analyze Now', action: () => navigate('/student/resume') },
            { id: '3', title: 'MNC Target Career Pathway', time: 'Select Company', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50', btn: 'View Pathway', action: () => navigate('/student/roadmap') },
          ])
        }
        
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Good Day, {user?.fullName?.split(' ')[0] || 'Student'}! 🌅
        </h1>
        <p className="text-slate-500">
          Every practice session brings you closer to your target campus placement.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-4">Overall Readiness</div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-slate-900">{stats.avgScore}%</div>
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            ↑ Readiness index from live tests
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-4">Mock Interviews</div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-slate-900">{stats.sessions}</div>
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            Completed AI sessions
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-4">Practice Questions</div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-slate-900">{stats.questions}</div>
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            Attempted problems
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-4">Placement Drives</div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-slate-900">{stats.applications}</div>
          </div>
          <div className="text-xs font-medium text-blue-600 mt-2 flex items-center gap-1">
            Active campus job postings
          </div>
        </div>

      </div>

      {/* Main Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placement Readiness Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Your Placement Readiness Index</h2>
          
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-40 h-40 flex-shrink-0 ml-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={stats.avgScore >= 70 ? '#10b981' : stats.avgScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (stats.avgScore / 100))}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-slate-900">{stats.avgScore}%</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                <CheckCircle size={18} /> Performance Tracking
              </div>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Focus on SQL, Technical Communication, and DSA for target MNC tiers.
              </p>
              <button 
                onClick={() => navigate('/student/analytics')}
                className="text-sm font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                View Detailed Report
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Upcoming Placement Drives & Actions</h2>
          
          <div className="space-y-4">
            {upcomingInterviews.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                </div>
                <button
                  onClick={item.action}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {item.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  )
}
