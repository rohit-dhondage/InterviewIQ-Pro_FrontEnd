import { TrendingUp, Target, Award, AlertCircle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

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
    { name: 'Data Structures', score: 85, color: 'bg-indigo-500' },
    { name: 'Algorithms', score: 70, color: 'bg-blue-500' },
    { name: 'System Design', score: 45, color: 'bg-yellow-500' },
    { name: 'Communication', score: 90, color: 'bg-green-500' },
    { name: 'Core CS (OS, DBMS)', score: 65, color: 'bg-violet-500' },
  ]

  const strengths = ['Graph Algorithms', 'Clear Articulation', 'SQL Queries']
  const weaknesses = ['Dynamic Programming', 'High-level System Design']

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Performance Analytics</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Track your interview readiness over time.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="surface-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-indigo-500 flex items-center justify-center font-bold text-xl">
            {analyticsData?.history?.length > 0 ? analyticsData.history[0].readinessScore : 0}
          </div>
          <div>
            <div className="text-sm text-gray-400 font-medium">Readiness Score</div>
            <div className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> Latest
            </div>
          </div>
        </div>
        <div className="surface-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-green-400">
            <Target size={28} />
          </div>
          <div>
            <div className="text-sm text-gray-400 font-medium">Interviews Taken</div>
            <div className="text-xl font-bold mt-0.5">{analyticsData?.totalSessions || 0}</div>
          </div>
        </div>
        <div className="surface-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400">
            <Award size={28} />
          </div>
          <div>
            <div className="text-sm text-gray-400 font-medium">Badges Earned</div>
            <div className="text-xl font-bold mt-0.5">0</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown (CSS Bars) */}
        <div className="surface-card">
          <h2 className="text-lg font-bold mb-6">Skill Breakdown</h2>
          <div className="space-y-6">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-gray-400">{cat.score}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${cat.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="flex flex-col gap-6">
          <div className="surface-card bg-green-500/5 border-green-500/20 flex-grow">
            <h2 className="text-lg font-bold mb-4 text-green-400 flex items-center gap-2">
              <Award size={20} /> Top Strengths
            </h2>
            <ul className="space-y-3">
              {strengths.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card bg-yellow-500/5 border-yellow-500/20 flex-grow">
            <h2 className="text-lg font-bold mb-4 text-yellow-400 flex items-center gap-2">
              <AlertCircle size={20} /> Areas to Improve
            </h2>
            <ul className="space-y-3">
              {weaknesses.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
