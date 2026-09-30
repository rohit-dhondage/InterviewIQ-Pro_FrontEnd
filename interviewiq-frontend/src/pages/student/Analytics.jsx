import { TrendingUp, Target, Award, AlertCircle, Loader2, Sparkles, BookOpen, ChevronRight, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/me')
        setAnalyticsData(response.data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const categories = [
    { name: 'Data Structures & Algorithms', score: 85, color: 'bg-indigo-500', hint: 'Strong array & tree mastery' },
    { name: 'Database & SQL Queries', score: 78, color: 'bg-blue-500', hint: 'Good join syntax, work on indexing' },
    { name: 'System Design & Architecture', score: 55, color: 'bg-amber-500', hint: 'Needs focus on Caching & Scalability' },
    { name: 'Communication & Behavioral', score: 92, color: 'bg-emerald-500', hint: 'Excellent STAR format answers' },
    { name: 'Core CS (OS, Networking, OOP)', score: 68, color: 'bg-violet-500', hint: 'Review Threading & Process Sync' },
  ]

  const strengths = [
    'Tree Traversal & Graph Algorithms',
    'Clear, Structured STAR format response style',
    'SQL Joins & Aggregations'
  ]
  const weaknesses = [
    'System Design (Distributed Caching & Load Balancing)',
    'Dynamic Programming optimization'
  ]

  const totalSessions = analyticsData?.totalSessions || 5
  const readinessScore = analyticsData?.history?.length > 0 ? analyticsData.history[0].readinessScore : 82

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-white">AI Placement Readiness & Analytics</h1>
          <p className="text-sm text-slate-400">Deep-dive into your interview scores, skill breakdown, and personalized recommendations.</p>
        </div>
        <button
          onClick={() => navigate('/student/practice')}
          className="btn-primary flex items-center gap-2"
        >
          <Play size={16} /> Take AI Practice Session
        </button>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Readiness Index Card */}
        <div className="surface-card border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900 flex items-center gap-5 p-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-extrabold text-2xl text-indigo-300">
            {readinessScore}%
          </div>
          <div>
            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" /> Placement Readiness
            </div>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {readinessScore >= 80 ? 'Placement Ready' : 'Needs Practice'}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-400" /> Top 15% in your college
            </div>
          </div>
        </div>

        {/* Total Interviews */}
        <div className="surface-card flex items-center gap-5 p-6 border border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Target size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Interviews Completed</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{totalSessions} Sessions</div>
            <div className="text-xs text-slate-400 mt-1">Technical & HR rounds</div>
          </div>
        </div>

        {/* Badges */}
        <div className="surface-card flex items-center gap-5 p-6 border border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Skill Badges</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">3 Earned</div>
            <div className="text-xs text-amber-300 font-medium mt-1">DSA Pro • SQL Expert</div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Detailed Category Skill Breakdown */}
        <div className="surface-card border border-white/5 p-6">
          <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400" /> Skill Domain Breakdown
          </h2>
          <div className="space-y-6">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-200">{cat.name}</span>
                  <span className="font-bold text-indigo-300">{cat.score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-1">
                  <div
                    className={`${cat.color} h-2.5 rounded-full transition-all duration-1000`}
                    style={{ width: `${cat.score}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400">{cat.hint}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="flex flex-col gap-6">
          
          <div className="surface-card bg-emerald-500/5 border border-emerald-500/20 p-6 flex-1">
            <h2 className="text-lg font-bold mb-4 text-emerald-400 flex items-center gap-2">
              <Award size={20} /> Verified Strengths
            </h2>
            <ul className="space-y-3">
              {strengths.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-200 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card bg-amber-500/5 border border-amber-500/20 p-6 flex-1">
            <h2 className="text-lg font-bold mb-4 text-amber-400 flex items-center gap-2">
              <AlertCircle size={20} /> Targeted Skill Gaps
            </h2>
            <ul className="space-y-3 mb-4">
              {weaknesses.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-200 font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/student/skill-gap')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
            >
              Analyze against target companies <ChevronRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
