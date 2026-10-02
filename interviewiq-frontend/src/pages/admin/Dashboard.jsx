import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Loader2, Building, Users, GraduationCap, Trophy, TrendingUp, Briefcase, Award } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data))
      .catch(() => {
        setData({
          collegesCount: 14,
          departments: 8,
          tpos: 24,
          students: 8400,
          placementsRate: 74,
          deptPerformance: [
            { name: 'Computer Engineering', score: 94, placed: 320, total: 340, color: 'bg-indigo-500' },
            { name: 'Information Tech', score: 88, placed: 240, total: 270, color: 'bg-emerald-500' },
            { name: 'Electronics & Telecom', score: 72, placed: 180, total: 250, color: 'bg-amber-500' },
            { name: 'Data Science & AI', score: 91, placed: 150, total: 165, color: 'bg-violet-500' },
            { name: 'Mechanical Eng.', score: 58, placed: 90, total: 155, color: 'bg-slate-500' },
          ],
          recruiters: [
            { id: 1, name: 'Google', hires: 14, package: '34 LPA', logo: 'G' },
            { id: 2, name: 'Amazon', hires: 28, package: '28 LPA', logo: 'A' },
            { id: 3, name: 'Microsoft', hires: 18, package: '31 LPA', logo: 'M' },
            { id: 4, name: 'TCS Digital', hires: 140, package: '7.5 LPA', logo: 'T' },
            { id: 5, name: 'Infosys Power Programmer', hires: 95, package: '9.5 LPA', logo: 'I' },
          ]
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Institutional Placement Analytics</h1>
          <p className="text-slate-400 text-sm">Multi-college & department placement statistics dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-900 border border-slate-700 text-sm text-white font-semibold rounded-xl px-4 py-2.5 outline-none cursor-pointer">
            <option>All Colleges (System-wide)</option>
            <option>MET's Institute of Engineering (MET BKC) Nashik</option>
            <option>K. K. Wagh Institute (KKWIEER) Nashik</option>
            <option>PVG's College of Engineering (PVGCOE) Nashik</option>
            <option>NDMVP's KBT College of Engineering Nashik</option>
            <option>Sandip Institute (SITRC) Nashik</option>
            <option>Guru Gobind Singh College (GCOERC) Nashik</option>
            <option>Matoshri College of Engineering (MCOERC) Nashik</option>
            <option>GES's R. H. Sapat College Nashik</option>
            <option>Sir Visvesvaraya Institute (SVIT) Chincholi</option>
          </select>
          <select className="bg-slate-900 border border-slate-700 text-sm text-white font-semibold rounded-xl px-4 py-2.5 outline-none cursor-pointer">
            <option>Academic Year 2025-2026</option>
            <option>Academic Year 2024-2025</option>
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="surface-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Associated Colleges</div>
            <div className="text-3xl font-extrabold text-white">{data?.collegesCount || 14}</div>
            <div className="text-xs font-medium text-emerald-400 mt-2">Active Institutions</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Building size={24} />
          </div>
        </div>
        
        <div className="surface-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">TPOs & Officers</div>
            <div className="text-3xl font-extrabold text-white">{data?.tpos || 24}</div>
            <div className="text-xs font-medium text-indigo-400 mt-2">Managing Drives</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Users size={24} />
          </div>
        </div>

        <div className="surface-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Students</div>
            <div className="text-3xl font-extrabold text-white">{data?.students || 8400}</div>
            <div className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> ↑ 18% vs last year
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="surface-card p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">Placement Rate</div>
            <div className="text-3xl font-extrabold text-white">{data?.placementsRate || 74}%</div>
            <div className="text-xs font-medium text-emerald-400 mt-2">980+ Students Hired</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy size={24} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Department Placement Breakdown */}
        <div className="lg:col-span-2 surface-card border border-white/5 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Department Placement Conversion
            </h2>
            <span className="text-xs text-slate-400">Total Hired vs Eligible</span>
          </div>
          
          <div className="space-y-5">
            {data?.deptPerformance?.map((dept) => (
              <div key={dept.name} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-white">{dept.name}</span>
                  <span className="font-bold text-indigo-300">{dept.placed} / {dept.total} Placed ({dept.score}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className={`h-full ${dept.color} rounded-full transition-all duration-700`} style={{ width: `${dept.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hiring Partners */}
        <div className="surface-card border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-400" /> Top Recruiting Companies
            </h2>
          </div>
          
          <div className="space-y-3">
            {data?.recruiters?.map(rec => (
              <div key={rec.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-extrabold text-base">
                    {rec.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{rec.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{rec.hires} Hired</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
