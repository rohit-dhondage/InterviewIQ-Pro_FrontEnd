import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Briefcase, CalendarDays, Loader2, X, Check, ChevronDown, ChevronRight } from 'lucide-react'
import api from '../../api/axios'

function Modal({ title, onClose, onSubmit, children, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="surface-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

export default function TpoDrives() {
  const [drives, setDrives] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [jobs, setJobs] = useState({})

  const [driveModal, setDriveModal] = useState(null)
  const [jobModal, setJobModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const initDriveForm = () => ({ companyId: '', name: '', description: '', startDate: '', endDate: '' })
  const initJobForm = () => ({ title: '', description: '', minimumCgpa: '', packageLpa: '' })
  const [dForm, setDForm] = useState(initDriveForm())
  const [jForm, setJForm] = useState(initJobForm())

  const fetchDrives = () => api.get('/tpo/drives').then(r => setDrives(r.data)).catch(console.error)

  useEffect(() => {
    Promise.all([fetchDrives(), api.get('/companies').then(r => setCompanies(r.data))])
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = async (id) => {
    setExpanded(e => ({ ...e, [id]: !e[id] }))
    if (!jobs[id]) {
      try {
        const res = await api.get(`/tpo/drives/${id}/jobs`)
        setJobs(j => ({ ...j, [id]: res.data }))
      } catch (e) { console.error(e) }
    }
  }

  const openCreateDrive = () => { setDForm(initDriveForm()); setDriveModal({ mode: 'create' }) }
  const openEditDrive = (d) => {
    setDForm({
      companyId: d.company?.id || '',
      name: d.name,
      description: d.description || '',
      startDate: d.startDate?.slice(0, 16) || '',
      endDate: d.endDate?.slice(0, 16) || '',
    })
    setDriveModal({ mode: 'edit', data: d })
  }
  const openAddJob = (driveId) => { setJForm(initJobForm()); setJobModal({ driveId }) }

  const saveDrive = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...dForm, companyId: parseInt(dForm.companyId), startDate: dForm.startDate + ':00', endDate: dForm.endDate + ':00' }
      if (driveModal.mode === 'create') await api.post('/tpo/drives', payload)
      else await api.put(`/tpo/drives/${driveModal.data.id}`, payload)
      await fetchDrives()
      setDriveModal(null)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteDrive = async (id) => {
    if (!confirm('Delete this placement drive?')) return
    try { await api.delete(`/tpo/drives/${id}`); await fetchDrives() } catch (e) { console.error(e) }
  }

  const saveJob = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        title: jForm.title, description: jForm.description,
        minimumCgpa: jForm.minimumCgpa ? parseFloat(jForm.minimumCgpa) : null,
        packageLpa: jForm.packageLpa ? parseFloat(jForm.packageLpa) : null,
      }
      const res = await api.post(`/tpo/drives/${jobModal.driveId}/jobs`, payload)
      setJobs(j => ({ ...j, [jobModal.driveId]: [...(j[jobModal.driveId] || []), res.data] }))
      setJobModal(null)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteJob = async (jobId, driveId) => {
    if (!confirm('Remove this job posting?')) return
    try {
      await api.delete(`/tpo/jobs/${jobId}`)
      setJobs(j => ({ ...j, [driveId]: j[driveId].filter(job => job.id !== jobId) }))
    } catch (e) { console.error(e) }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Placement Drives</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Create and manage campus recruitment drives.</p>
        </div>
        <button onClick={openCreateDrive} className="btn-primary"><Plus size={16} /> New Drive</button>
      </div>

      <div className="space-y-4">
        {drives.length === 0 && (
          <div className="text-center py-16 surface-card text-gray-400">No placement drives created yet.</div>
        )}
        {drives.map(drive => (
          <div key={drive.id} className="surface-card overflow-hidden">
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleExpand(drive.id)}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Briefcase size={20} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {drive.name}
                    <span className={`badge ${drive.isActive ? 'badge-green' : 'badge-red'}`}>
                      {drive.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span>{drive.company?.name}</span>
                    <span>•</span>
                    <CalendarDays size={11} />
                    <span>{drive.startDate ? new Date(drive.startDate).toLocaleDateString() : 'N/A'} — {drive.endDate ? new Date(drive.endDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); openEditDrive(drive) }} className="btn-ghost p-2"><Pencil size={14} /></button>
                <button onClick={e => { e.stopPropagation(); deleteDrive(drive.id) }} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={14} /></button>
                {expanded[drive.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </div>
            </div>

            {expanded[drive.id] && (
              <div className="border-t border-white/5 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">Job Postings ({(jobs[drive.id] || []).length})</h3>
                  <button onClick={() => openAddJob(drive.id)} className="text-xs btn-outline py-1.5 px-3"><Plus size={12} /> Add Job</button>
                </div>
                <div className="space-y-2">
                  {(jobs[drive.id] || []).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <div className="text-sm font-medium">{job.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                          {job.packageLpa && <span>💰 {job.packageLpa} LPA</span>}
                          {job.minimumCgpa && <span>📊 Min CGPA: {job.minimumCgpa}</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteJob(job.id, drive.id)} className="btn-ghost p-1.5 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  ))}
                  {(jobs[drive.id] || []).length === 0 && <div className="text-xs text-gray-500 text-center py-4">No job postings yet.</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {driveModal && (
        <Modal title={driveModal.mode === 'create' ? 'Create Placement Drive' : 'Edit Drive'} onClose={() => setDriveModal(null)} onSubmit={saveDrive} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Drive Name *</label>
            <input required className="input-field" placeholder="e.g. Google Campus Recruitment 2026" value={dForm.name} onChange={e => setDForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Company *</label>
            <select required className="input-field" value={dForm.companyId} onChange={e => setDForm(f => ({ ...f, companyId: e.target.value }))}>
              <option value="">Select Company</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Description</label>
            <textarea className="input-field" rows={2} placeholder="Brief description..." value={dForm.description} onChange={e => setDForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Start Date *</label>
              <input required type="datetime-local" className="input-field" value={dForm.startDate} onChange={e => setDForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">End Date *</label>
              <input required type="datetime-local" className="input-field" value={dForm.endDate} onChange={e => setDForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
        </Modal>
      )}

      {jobModal && (
        <Modal title="Add Job Posting" onClose={() => setJobModal(null)} onSubmit={saveJob} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Job Title *</label>
            <input required className="input-field" placeholder="e.g. Software Engineer" value={jForm.title} onChange={e => setJForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Description</label>
            <textarea className="input-field" rows={2} placeholder="Role description..." value={jForm.description} onChange={e => setJForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Package (LPA)</label>
              <input type="number" step="0.1" className="input-field" placeholder="e.g. 12.5" value={jForm.packageLpa} onChange={e => setJForm(f => ({ ...f, packageLpa: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Min CGPA</label>
              <input type="number" step="0.1" max="10" className="input-field" placeholder="e.g. 6.5" value={jForm.minimumCgpa} onChange={e => setJForm(f => ({ ...f, minimumCgpa: e.target.value }))} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
