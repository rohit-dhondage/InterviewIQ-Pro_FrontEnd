import { useState, useEffect } from 'react'
import { Search, GraduationCap, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import api from '../../api/axios'

export default function TpoStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('fullName')
  const [sortDir, setSortDir] = useState('asc')

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
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Students</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{students.length} registered students in your college.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email, department..." className="input-field pl-9 py-2.5 w-72" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { label: 'Student', field: 'fullName' },
                  { label: 'Department', field: 'departmentName' },
                  { label: 'Year', field: 'year' },
                  { label: 'CGPA', field: 'cgpa' },
                  { label: 'Roll No', field: 'rollNo' },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => toggleSort(field)}
                  >
                    <div className="flex items-center gap-1.5">
                      {label} <SortIcon field={field} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <GraduationCap size={32} className="mx-auto mb-2 opacity-40" />
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s.studentId} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                        {s.fullName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-xs text-gray-500">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{s.departmentName || 'N/A'}</td>
                  <td className="px-5 py-4 text-gray-300">{s.year ? `${s.year} Batch` : 'N/A'}</td>
                  <td className="px-5 py-4">
                    {s.cgpa ? (
                      <span className={`badge ${s.cgpa >= 8 ? 'badge-green' : s.cgpa >= 6.5 ? 'badge-blue' : 'badge-yellow'}`}>
                        {s.cgpa}
                      </span>
                    ) : <span className="text-gray-500">—</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-400">{s.rollNo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
