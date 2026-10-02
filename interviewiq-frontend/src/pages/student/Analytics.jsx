import { TrendingUp, Target, Award, AlertCircle, Loader2, Sparkles, BookOpen, ChevronRight, Play, FileText } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }

  const totalSessions = analyticsData?.totalSessions || 0
  const readinessScore = analyticsData?.overallReadiness || 0
  const domainScores = analyticsData?.domainScores || {}
  const history = analyticsData?.history || []

  const categories = [
    { name: 'Data Structures & Algorithms', score: domainScores['Data Structures & Algorithms'] || 0, color: 'bg-indigo-500', hint: 'Evaluated from AI Technical coding sessions' },
    { name: 'Database & SQL Queries', score: domainScores['Database & SQL Queries'] || 0, color: 'bg-blue-500', hint: 'Evaluated from SQL queries & DBMS questions' },
    { name: 'System Design & Architecture', score: domainScores['System Design & Architecture'] || 0, color: 'bg-amber-500', hint: 'Evaluated from System Design & Scalability sessions' },
    { name: 'Communication & Behavioral', score: domainScores['Communication & Behavioral'] || 0, color: 'bg-emerald-500', hint: 'Evaluated from STAR format response clarity' },
    { name: 'Core CS (OS, Networking, OOP)', score: domainScores['Core CS (OS, Networking, OOP)'] || 0, color: 'bg-violet-500', hint: 'Evaluated from Core CS concept questions' },
    { name: 'Resume ATS Score', score: domainScores['Resume ATS Score'] || 0, color: 'bg-pink-500', hint: 'Evaluated from AI Resume Analyzer' },
  ]

  const hasData = totalSessions > 0 || readinessScore > 0 || Object.values(domainScores).some(s => s > 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-white">AI Placement Readiness & Real-Time Analytics</h1>
          <p className="text-sm text-slate-400">Live breakdown of your interview history, skill domain scores, and performance trends.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/student/resume')}
            className="btn-outline flex items-center gap-2"
          >
            <FileText size={16} /> Analyze Resume
          </button>
          <button
            onClick={() => navigate('/student/practice')}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={16} /> Take AI Practice Session
          </button>
        </div>
      </div>

      {!hasData ? (
        /* ── New Account Zero-State Panel ── */
        <div className="surface-card p-12 text-center border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-slate-900/60 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <Sparkles size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Performance Records Yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            You haven't completed any AI mock interviews or resume scans yet. Complete your first practice session to see your real-time placement readiness metrics!
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/student/practice')} className="btn-primary flex items-center gap-2">
              <Play size={16} /> Start Practice Interview
            </button>
            <button onClick={() => navigate('/student/resume')} className="btn-outline flex items-center gap-2">
              <FileText size={16} /> Upload Resume for ATS Score
            </button>
          </div>
        </div>
      ) : (
        /* ── Real Data Analytics Panel ── */
        <>
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
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
                  {readinessScore >= 75 ? 'Placement Ready' : readinessScore >= 50 ? 'Moderate Progress' : 'Needs Practice'}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-400" /> Computed from live DB records
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
                <div className="text-xs text-slate-400 mt-1">Recorded AI evaluations</div>
              </div>
            </div>

            {/* Badges */}
            <div className="surface-card flex items-center gap-5 p-6 border border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Award size={30} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Skill Assessment Status</div>
                <div className="text-2xl font-extrabold text-white mt-0.5">
                  {readinessScore >= 75 ? '3 Badges' : readinessScore >= 50 ? '1 Badge' : 'Active Learner'}
                </div>
                <div className="text-xs text-amber-300 font-medium mt-1">
                  {readinessScore >= 50 ? 'DSA Learner • Active Candidate' : 'Beginner Candidate'}
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Skill Domain Breakdown */}
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

            {/* Session History Log */}
            <div className="surface-card border border-white/5 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-400" /> Recent Session History
                </h2>
                {history.length === 0 ? (
                  <p className="text-sm text-slate-400">No mock interview sessions recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((sess, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/4 border border-white/8 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{sess.topic || sess.title || 'Technical Practice'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{sess.recordedAt ? new Date(sess.recordedAt).toLocaleDateString() : 'Recent session'}</p>
                        </div>
                        <span className="badge badge-green font-bold">
                          {sess.readinessScore || sess.overallScore || sess.score || 0}% Score
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/8 mt-6">
                <button
                  onClick={() => navigate('/student/practice')}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
                >
                  <Play size={16} /> Schedule Next AI Practice Session
                </button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
