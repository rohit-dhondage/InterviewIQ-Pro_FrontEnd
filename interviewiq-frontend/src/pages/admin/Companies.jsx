import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Building, Loader2, X, Check, Search } from 'lucide-react'
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

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', website: '', address: '' })

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies')
      setCompanies(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCompanies() }, [])

  const openCreate = () => { setForm({ name: '', industry: '', website: '', address: '' }); setModal({ mode: 'create' }) }
  const openEdit = (c) => { setForm({ name: c.name, industry: c.industry || '', website: c.website || '', address: c.address || '' }); setModal({ mode: 'edit', data: c }) }

  const saveCompany = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (modal.mode === 'create') await api.post('/admin/companies', form)
      else await api.put(`/admin/companies/${modal.data.id}`, form)
      await fetchCompanies()
      setModal(null)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteCompany = async (id) => {
    if (!confirm('Delete this company? This cannot be undone.')) return
    try {
      await api.delete(`/admin/companies/${id}`)
      setCompanies(c => c.filter(co => co.id !== id))
    } catch (e) { console.error(e) }
  }

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Company Management</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage partner companies for placement drives.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search companies..." className="input-field pl-9 py-2.5" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Company</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 surface-card text-gray-400">No companies found.</div>
        )}
        {filtered.map(company => (
          <div key={company.id} className="surface-card p-6 flex flex-col gap-4 hover:border-indigo-500/20 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg">
                  {company.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{company.name}</div>
                  {company.industry && <div className="text-xs text-indigo-400 mt-0.5">{company.industry}</div>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(company)} className="btn-ghost p-2"><Pencil size={14} /></button>
                <button onClick={() => deleteCompany(company.id)} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            {company.address && <div className="text-xs text-gray-400 flex items-center gap-1.5"><Building size={12} /> {company.address}</div>}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline truncate">{company.website}</a>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Add Company' : 'Edit Company'} onClose={() => setModal(null)} onSubmit={saveCompany} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Company Name *</label>
            <input required className="input-field" placeholder="e.g. Google" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Industry</label>
            <input className="input-field" placeholder="e.g. Technology" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Address</label>
            <input className="input-field" placeholder="e.g. Bangalore, Karnataka" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Website</label>
            <input className="input-field" placeholder="https://..." value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          </div>
        </Modal>
      )}
    </div>
  )
}
