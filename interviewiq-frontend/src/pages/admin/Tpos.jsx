import { useState, useEffect } from 'react'
import { Plus, Trash2, Users, Building2, Loader2, X, Check } from 'lucide-react'
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
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminTpos() {
  const [colleges, setColleges] = useState([])
  const [selectedCollege, setSelectedCollege] = useState('')
  const [tpos, setTpos] = useState([])
  const [loadingColleges, setLoadingColleges] = useState(true)
  const [loadingTpos, setLoadingTpos] = useState(false)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', collegeId: '' })

  useEffect(() => {
    api.get('/colleges')
      .then(res => { setColleges(res.data); if (res.data.length > 0) setSelectedCollege(res.data[0].id) })
      .catch(console.error)
      .finally(() => setLoadingColleges(false))
  }, [])

  useEffect(() => {
    if (!selectedCollege) return
    setLoadingTpos(true)
    api.get(`/admin/colleges/${selectedCollege}/tpos`)
      .then(res => setTpos(res.data))
      .catch(console.error)
      .finally(() => setLoadingTpos(false))
  }, [selectedCollege])

  const openModal = () => {
    setForm({ fullName: '', email: '', password: '', collegeId: selectedCollege || '' })
    setModal(true)
  }

  const createTpo = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.post('/admin/tpo', { ...form, collegeId: parseInt(form.collegeId) })
      if (parseInt(form.collegeId) === parseInt(selectedCollege)) {
        const res = await api.get(`/admin/colleges/${selectedCollege}/tpos`)
        setTpos(res.data)
      }
      setModal(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deactivateTpo = async (userId) => {
    if (!confirm('Deactivate this TPO account?')) return
    try {
      await api.delete(`/admin/tpo/${userId}`)
      setTpos(t => t.filter(tp => tp.userId !== userId))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">TPO Accounts</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage Training & Placement Officer accounts per college.</p>
        </div>
        <button onClick={openModal} className="btn-primary"><Plus size={16} /> Create TPO Account</button>
      </div>

      <div className="mb-6">
        <label className="text-xs font-medium text-gray-400 block mb-2">Filter by College</label>
        {loadingColleges ? <Loader2 size={18} className="animate-spin text-indigo-400" /> : (
          <div className="flex flex-wrap gap-2">
            {colleges.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCollege(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  parseInt(selectedCollege) === c.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {loadingTpos ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tpos.length === 0 && (
            <div className="col-span-full text-center py-16 surface-card text-gray-400">No TPO accounts for this college yet.</div>
          )}
          {tpos.map(tpo => (
            <div key={tpo.userId} className="surface-card p-5 flex items-start gap-4 hover:border-indigo-500/20 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
                {tpo.fullName?.charAt(0) || 'T'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{tpo.fullName}</div>
                <div className="text-xs text-gray-400 truncate mt-0.5">{tpo.email}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Building2 size={11} /> {tpo.collegeName}
                </div>
              </div>
              <button onClick={() => deactivateTpo(tpo.userId)} className="btn-ghost p-2 hover:text-red-400 flex-shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title="Create TPO Account" onClose={() => setModal(false)} onSubmit={createTpo} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Full Name *</label>
            <input required className="input-field" placeholder="Jane Smith" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Email *</label>
            <input required type="email" className="input-field" placeholder="tpo@college.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Temporary Password *</label>
            <input required type="password" className="input-field" placeholder="Min 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Assign to College *</label>
            <select required className="input-field" value={form.collegeId} onChange={e => setForm(f => ({ ...f, collegeId: e.target.value }))}>
              <option value="">Select College</option>
              {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </div>
  )
}
