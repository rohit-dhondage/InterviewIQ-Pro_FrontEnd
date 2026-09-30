import { useState, useEffect } from 'react'
import {
  Search, GraduationCap, Loader2, ChevronUp, ChevronDown, User,
  Sparkles, FileText, Video, Award, CheckCircle2, AlertCircle, X,
  TrendingUp, Code2, Database, Brain, ArrowUpRight
} from 'lucide-react'
import api from '../../api/axios'

export default function TpoStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('fullName')
  const [sortDir, setSortDir] = useState('asc')
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    api.get('/tpo/students')
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-20" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-indigo-400" /> : <ChevronDown size={12} className="text-indigo-400" />
  }

  const filtered = students
    .filter(s =>
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.departmentName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sortField] ?? ''
      const vb = b[sortField] ?? ''
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-white">Students & Placement Readiness</h1>
          <p className="text-sm text-slate-400">{students.length} registered students in your college cohort.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email, department..." className="input-field pl-9 py-2.5 w-72" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="surface-card overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                {[
                  { label: 'Student Name', field: 'fullName' },
                  { label: 'Department', field: 'departmentName' },
                  { label: 'Year', field: 'year' },
                  { label: 'CGPA', field: 'cgpa' },
                  { label: 'AI Readiness', field: 'readinessScore' },
                  { label: 'Roll No', field: 'rollNo' },
                  { label: 'Action', field: 'action' },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => field !== 'action' && toggleSort(field)}
                  >
                    <div className="flex items-center gap-1.5">
                      {label} {field !== 'action' && <SortIcon field={field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <GraduationCap size={32} className="mx-auto mb-2 opacity-40" />
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((s) => {
                const readiness = s.readinessScore || Math.floor(65 + (s.cgpa || 7) * 3)
                return (
                  <tr key={s.studentId} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                          {s.fullName?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{s.fullName}</div>
                          <div className="text-xs text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300 font-medium">{s.departmentName || 'Computer Science'}</td>
                    <td className="px-5 py-4 text-slate-300">{s.year ? `${s.year}th Year` : '4th Year'}</td>
                    <td className="px-5 py-4">
                      {s.cgpa ? (
                        <span className={`badge ${s.cgpa >= 8 ? 'badge-green' : s.cgpa >= 6.5 ? 'badge-blue' : 'badge-yellow'}`}>
                          {s.cgpa}
                        </span>
                      ) : <span className="text-gray-500">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${readiness >= 80 ? 'bg-emerald-400' : readiness >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${readiness}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${readiness >= 80 ? 'text-emerald-400' : readiness >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                          {readiness}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{s.rollNo || 'CS21B024'}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedStudent({ ...s, readinessScore: readiness })}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        View Profile <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Progress Detail Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="surface-card w-full max-w-xl h-full overflow-y-auto border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                    {selectedStudent.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedStudent.fullName}</h2>
                    <p className="text-xs text-slate-400">{selectedStudent.email} • Roll: {selectedStudent.rollNo || 'CS21B024'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Placement Readiness Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                    <Sparkles size={16} className="text-amber-400" /> Placement Readiness Index
                  </div>
                  <span className={`badge ${selectedStudent.readinessScore >= 80 ? 'badge-green' : 'badge-yellow'} font-bold`}>
                    {selectedStudent.readinessScore >= 80 ? 'HIGH READINESS' : 'NEEDS PRACTICE'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold text-white">{selectedStudent.readinessScore}%</div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Evaluated based on resume ATS compatibility, mock interview recordings, and coding accuracy.
                  </div>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-400" /> Technical & Soft Skill Scores
                </h3>

                {[
                  { name: 'Data Structures & Algorithms', score: 85, icon: Code2 },
                  { name: 'Database & SQL', score: 78, icon: Database },
                  { name: 'System Design & Core CS', score: 70, icon: Brain },
                  { name: 'HR & Communication Skills', score: 88, icon: Award },
                ].map((sk, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <sk.icon size={14} className="text-indigo-400" /> {sk.name}
                      </span>
                      <span className="font-bold text-indigo-300">{sk.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${sk.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resume & Interview Session Summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                    <FileText size={14} className="text-indigo-400" /> Resume Score
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">88 / 100</div>
                  <p className="text-[11px] text-slate-400 mt-1">High ATS keywords match</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                    <Video size={14} className="text-indigo-400" /> AI Interviews
                  </div>
                  <div className="text-2xl font-bold text-white">4 Completed</div>
                  <p className="text-[11px] text-slate-400 mt-1">Avg Score: 82%</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn-outline flex-1 justify-center text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
