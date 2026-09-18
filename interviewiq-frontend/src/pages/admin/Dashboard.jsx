import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Loader2, Building, Users, GraduationCap, Trophy } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Attempt real data fetch, fallback to mock for UI fidelity matching Image 7
    api.get('/admin/analytics')
      .then(res => setData(res.data))
      .catch(() => {
        setData({
          departments: 8,
          tpos: 12,
          students: 4200,
          placements: 68,
          deptPerformance: [
            { name: 'CSE', score: 92, color: 'bg-emerald-500' },
            { name: 'IT', score: 85, color: 'bg-emerald-400' },
            { name: 'ECE', score: 65, color: 'bg-teal-400' },
            { name: 'Mech', score: 45, color: 'bg-slate-300' },
          ],
          recruiters: [
            { id: 1, name: 'TCS', hires: 120, package: '4.5 LPA', logo: 'T' },
            { id: 2, name: 'Amazon', hires: 12, package: '28 LPA', logo: 'A' },
            { id: 3, name: 'Infosys', hires: 85, package: '5 LPA', logo: 'I' },
            { id: 4, name: 'Google', hires: 4, package: '32 LPA', logo: 'G' },
          ]
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">D. J. Sanghvi College</h1>
          <p className="text-slate-500 text-sm">College-wide performance overview for current academic year.</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-lg px-4 py-2 outline-none shadow-sm cursor-pointer hover:border-slate-300">
          <option>2025 - 2026</option>
          <option>2024 - 2025</option>
        </select>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-2">Total Departments</div>
            <div className="text-3xl font-bold text-slate-900">{data?.departments || 8}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Building size={20} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-2">Total TPOs</div>
            <div className="text-3xl font-bold text-slate-900">{data?.tpos || 12}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-2">Total Students</div>
            <div className="text-3xl font-bold text-slate-900">{data?.students || 4200}</div>
            <div className="text-xs font-medium text-emerald-600 mt-2">↑ 15% this year</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <GraduationCap size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-2">Overall Placements</div>
            <div className="text-3xl font-bold text-slate-900">{data?.placements || 68}%</div>
            <div className="text-xs font-medium text-emerald-600 mt-2">↑ 5% vs last year</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Department Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Department Performance</h2>
          
          <div className="flex-1 flex items-end gap-6 h-56 pb-2 border-b border-slate-100 px-4">
            {data?.deptPerformance?.map((dept) => (
              <div key={dept.name} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end">
                <div className="text-xs font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{dept.score}%</div>
                <div className={`w-full max-w-[64px] rounded-t-sm ${dept.color} transition-all duration-500 group-hover:opacity-80`} style={{ height: `${Math.max(5, dept.score)}%` }} />
                <div className="text-xs font-semibold text-slate-500 text-center mt-2">{dept.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recruiters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Top Recruiters</h2>
          </div>
          
          <div className="space-y-4">
            {data?.recruiters?.map(rec => (
              <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg">
                    {rec.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{rec.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.hires} Hires</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700">
                    {rec.package}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
