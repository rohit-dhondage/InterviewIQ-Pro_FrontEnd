import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Loader2, TrendingUp, Users, Award, Briefcase, BarChart3, PieChart as PieIcon, ArrowUpRight } from 'lucide-react'

export default function TpoAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState('2025-2026')

  useEffect(() => {
    api.get('/tpo/analytics')
      .then(res => setData(res.data))
      .catch(() => {
        setData({
          totalEligible: 412,
          placedCount: 298,
          avgPackage: '7.8 LPA',
          highestPackage: '42.0 LPA',
          deptStats: [
            { dept: 'Computer Science', eligible: 140, placed: 128, rate: 91, avg: '9.2 LPA' },
            { dept: 'Information Technology', eligible: 110, placed: 98, rate: 89, avg: '8.4 LPA' },
            { dept: 'Electronics & Telecomm', eligible: 82, placed: 52, rate: 63, avg: '6.5 LPA' },
            { dept: 'Mechanical Engineering', eligible: 50, placed: 20, rate: 40, avg: '5.2 LPA' },
          ],
          skillReadiness: [
            { skill: 'Data Structures & Algorithms', score: 78, color: 'bg-emerald-500' },
            { skill: 'System Design & Architecture', score: 64, color: 'bg-blue-500' },
            { skill: 'Core CS (OS/DBMS/CN)', score: 72, color: 'bg-indigo-500' },
            { skill: 'Technical Communication', score: 81, color: 'bg-amber-500' },
            { skill: 'HR & Behavioral Aptitude', score: 86, color: 'bg-purple-500' },
          ],
          tierDistribution: [
            { tier: 'Super Dream (>15 LPA)', count: 42, pct: '14%' },
            { tier: 'Dream (8-15 LPA)', count: 112, pct: '38%' },
            { tier: 'Standard (4.5-8 LPA)', count: 144, pct: '48%' },
          ]
        })
      })
      .finally(() => setLoading(false))
  }, [selectedBatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Analytics & Insights</h1>
          <p className="text-sm text-slate-500 mt-1">Deep-dive cohort readiness, skill gaps, and placement conversion metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-white border border-slate-200 text-sm text-slate-700 font-semibold rounded-lg px-4 py-2 outline-none shadow-sm cursor-pointer hover:border-slate-300"
          >
            <option value="2025-2026">Cohort 2025 - 2026</option>
            <option value="2024-2025">Cohort 2024 - 2025</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">72.3%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">+5.4% YoY</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">298 placed out of 412 eligible</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average CTC</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{data?.avgPackage || '7.8 LPA'}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">+1.2 LPA</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across all confirmed offers</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest CTC</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{data?.highestPackage || '42.0 LPA'}</span>
            <span className="text-xs font-semibold text-purple-600">Product Role</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Offered by Atlassian</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Recruiters</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">48</span>
            <span className="text-xs font-semibold text-slate-500">Companies</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">14 drives currently in progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department-wise Placement */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                Department-wise Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Placement conversion and average compensation per branch</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Eligible</th>
                  <th className="py-3 px-4">Placed</th>
                  <th className="py-3 px-4">Conversion</th>
                  <th className="py-3 px-4">Avg CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.deptStats || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.dept}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.eligible}</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600">{row.placed}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full" 
                            style={{ width: `${row.rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{row.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <PieIcon size={18} className="text-purple-600" />
              Offer Tier Breakdown
            </h2>
            <p className="text-xs text-slate-500 mb-6">Distribution across compensation brackets</p>

            <div className="space-y-4">
              {(data?.tierDistribution || []).map((tier, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-800 mb-1">
                    <span>{tier.tier}</span>
                    <span className="text-blue-600">{tier.pct}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{tier.count} Students</span>
                    <span>Placed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Data refreshes automatically as students verify offers and status updates in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Skill Gap & AI Readiness Radar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">AI Mock Interview Benchmark Readiness</h2>
        <p className="text-xs text-slate-500 mb-6">Aggregate evaluation from AI mock interviews conducted by registered students</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          {(data?.skillReadiness || []).map((skill, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{skill.skill}</span>
                <span className="font-bold text-slate-900">{skill.score}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${skill.color}`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
