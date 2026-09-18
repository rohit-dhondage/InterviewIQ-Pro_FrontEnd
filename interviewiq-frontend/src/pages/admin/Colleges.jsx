import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Building2, Loader2, X, Check } from 'lucide-react'
import api from '../../api/axios'

function Modal({ title, onClose, onSubmit, children, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="surface-card p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminColleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [departments, setDepartments] = useState({})

  const [collegeModal, setCollegeModal] = useState(null) // null | { mode, data }
  const [deptModal, setDeptModal] = useState(null) // null | { collegeId }
  const [saving, setSaving] = useState(false)

  const [cForm, setCForm] = useState({ name: '', address: '' })
  const [dForm, setDForm] = useState({ name: '' })

  const fetchColleges = async () => {
    try {
      const res = await api.get('/colleges')
      setColleges(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchColleges() }, [])

  const toggleExpand = async (id) => {
    const next = { ...expanded, [id]: !expanded[id] }
    setExpanded(next)
    if (next[id] && !departments[id]) {
      try {
        const res = await api.get(`/colleges/${id}/departments`)
        setDepartments(d => ({ ...d, [id]: res.data }))
      } catch (e) { console.error(e) }
    }
  }

  const openCreateCollege = () => { setCForm({ name: '', address: '' }); setCollegeModal({ mode: 'create' }) }
  const openEditCollege = (c) => { setCForm({ name: c.name, address: c.address || '' }); setCollegeModal({ mode: 'edit', data: c }) }
  const openAddDept = (collegeId) => { setDForm({ name: '' }); setDeptModal({ collegeId }) }

  const saveCollege = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (collegeModal.mode === 'create') await api.post('/admin/colleges', cForm)
      else await api.put(`/admin/colleges/${collegeModal.data.id}`, cForm)
      await fetchColleges()
      setCollegeModal(null)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const saveDept = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await api.post(`/admin/colleges/${deptModal.collegeId}/departments`, dForm)
      setDepartments(d => ({ ...d, [deptModal.collegeId]: [...(d[deptModal.collegeId] || []), res.data] }))
      setDeptModal(null)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteDept = async (deptId, collegeId) => {
    if (!confirm('Remove this department?')) return
    try {
      await api.delete(`/admin/departments/${deptId}`)
      setDepartments(d => ({ ...d, [collegeId]: d[collegeId].filter(dep => dep.id !== deptId) }))
    } catch (e) { console.error(e) }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">College Management</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage all registered colleges and their departments.</p>
        </div>
        <button onClick={openCreateCollege} className="btn-primary"><Plus size={16} /> Add College</button>
      </div>

      <div className="space-y-3">
        {colleges.length === 0 && (
          <div className="text-center py-16 surface-card text-gray-400">No colleges found. Add one to get started.</div>
        )}
        {colleges.map(college => (
          <div key={college.id} className="surface-card overflow-hidden">
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleExpand(college.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Building2 size={20} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-semibold">{college.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{college.address || 'No address'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); openEditCollege(college) }} className="btn-ghost p-2">
                  <Pencil size={15} />
                </button>
                {expanded[college.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </div>
            </div>

            {expanded[college.id] && (
              <div className="border-t border-white/5 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">Departments</h3>
                  <button onClick={() => openAddDept(college.id)} className="text-xs btn-outline py-1.5 px-3">
                    <Plus size={12} /> Add Department
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(departments[college.id] || []).map(dept => (
                    <div key={dept.id} className="badge badge-violet flex items-center gap-2">
                      {dept.name}
                      <button onClick={() => deleteDept(dept.id, college.id)} className="hover:text-red-400 ml-1"><Trash2 size={11} /></button>
                    </div>
                  ))}
                  {(departments[college.id] || []).length === 0 && (
                    <span className="text-xs text-gray-500">No departments yet.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {collegeModal && (
        <Modal title={collegeModal.mode === 'create' ? 'Add College' : 'Edit College'} onClose={() => setCollegeModal(null)} onSubmit={saveCollege} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">College Name *</label>
            <input required className="input-field" placeholder="e.g. VJTI Mumbai" value={cForm.name} onChange={e => setCForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Address</label>
            <input className="input-field" placeholder="e.g. Mumbai, Maharashtra" value={cForm.address} onChange={e => setCForm(f => ({ ...f, address: e.target.value }))} />
          </div>
        </Modal>
      )}

      {deptModal && (
        <Modal title="Add Department" onClose={() => setDeptModal(null)} onSubmit={saveDept} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Department Name *</label>
            <input required className="input-field" placeholder="e.g. Computer Engineering" value={dForm.name} onChange={e => setDForm({ name: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  )
}
