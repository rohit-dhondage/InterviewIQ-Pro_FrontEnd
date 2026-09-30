import { useState, useEffect } from 'react'
import {
  Plus, Pencil, Trash2, Briefcase, CalendarDays, Loader2, X, Check,
  ChevronDown, ChevronRight, Users, Sparkles, Filter, CheckCircle2, AlertCircle, Code2
} from 'lucide-react'
import api from '../../api/axios'

function Modal({ title, onClose, onSubmit, children, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="surface-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex gap-3 pt-4">
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
  const [allStudents, setAllStudents] = useState([])

  const [driveModal, setDriveModal] = useState(null)
  const [jobModal, setJobModal] = useState(null)
  const [eligibilityModal, setEligibilityModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const initDriveForm = () => ({ companyId: '', name: '', description: '', startDate: '', endDate: '' })
  const initJobForm = () => ({
    title: '', description: '', minimumCgpa: '', packageLpa: '',
    maxBacklogs: '0', allowedBranches: 'Computer Science, Information Technology, Electronics',
    requiredSkills: 'Java, SQL, DSA, Communication'
  })

  const [dForm, setDForm] = useState(initDriveForm())
  const [jForm, setJForm] = useState(initJobForm())

  const fetchDrives = () => api.get('/tpo/drives').then(r => setDrives(r.data)).catch(console.error)

  useEffect(() => {
    Promise.all([
      fetchDrives(),
      api.get('/companies').then(r => setCompanies(r.data)).catch(() => []),
      api.get('/tpo/students').then(r => setAllStudents(r.data)).catch(() => [])
    ]).finally(() => setLoading(false))
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
        role: jForm.title,
        title: jForm.title,
        description: jForm.description,
        minimumCgpa: jForm.minimumCgpa ? parseFloat(jForm.minimumCgpa) : null,
        packageCtc: jForm.packageLpa ? `${jForm.packageLpa} LPA` : null,
        packageLpa: jForm.packageLpa ? parseFloat(jForm.packageLpa) : null,
        maxBacklogs: jForm.maxBacklogs ? parseInt(jForm.maxBacklogs) : 0,
        allowedBranches: jForm.allowedBranches,
        requiredSkills: jForm.requiredSkills,
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

  const checkEligibility = (job) => {
    const minCgpa = job.minimumCgpa || 0
    const eligible = allStudents.filter(s => (s.cgpa || 0) >= minCgpa)
    const ineligible = allStudents.filter(s => (s.cgpa || 0) < minCgpa)
    setEligibilityModal({ job, eligible, ineligible, minCgpa })
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-white">Placement Drives</h1>
          <p className="text-sm text-slate-400">Create, configure eligibility criteria, and manage campus recruitment drives.</p>
        </div>
        <button onClick={openCreateDrive} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Drive</button>
      </div>

      <div className="space-y-4">
        {drives.length === 0 && (
          <div className="text-center py-16 surface-card text-gray-400">No placement drives created yet.</div>
        )}
        {drives.map(drive => (
          <div key={drive.id} className="surface-card overflow-hidden border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleExpand(drive.id)}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Briefcase size={20} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {drive.name}
                    <span className={`badge ${drive.isActive ? 'badge-green' : 'badge-red'}`}>
                      {drive.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span className="font-medium text-slate-300">{drive.company?.name || 'Company'}</span>
                    <span>•</span>
                    <CalendarDays size={12} className="text-indigo-400" />
                    <span>{drive.startDate ? new Date(drive.startDate).toLocaleDateString() : 'N/A'} — {drive.endDate ? new Date(drive.endDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); openEditDrive(drive) }} className="btn-ghost p-2 text-slate-400 hover:text-white"><Pencil size={14} /></button>
                <button onClick={e => { e.stopPropagation(); deleteDrive(drive.id) }} className="btn-ghost p-2 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                {expanded[drive.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </div>
            </div>

            {expanded[drive.id] && (
              <div className="border-t border-white/5 p-5 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Briefcase size={14} className="text-indigo-400" /> Job Roles ({(jobs[drive.id] || []).length})
                  </h3>
                  <button onClick={() => openAddJob(drive.id)} className="text-xs btn-outline py-1.5 px-3 flex items-center gap-1.5">
                    <Plus size={12} /> Add Job Posting
                  </button>
                </div>
                <div className="space-y-3">
                  {(jobs[drive.id] || []).map(job => (
                    <div key={job.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{job.title}</span>
                          {job.packageLpa && <span className="badge badge-green text-xs font-semibold">💰 {job.packageLpa} LPA</span>}
                          {job.minimumCgpa && <span className="badge badge-blue text-xs">📊 Min CGPA: {job.minimumCgpa}</span>}
                        </div>
                        {job.description && <p className="text-xs text-slate-400">{job.description}</p>}
                        
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(job.requiredSkills || 'Java, SQL, DSA, Communication').split(',').map((skill, si) => (
                            <span key={si} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 font-medium flex items-center gap-1">
                              <Code2 size={10} /> {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => checkEligibility(job)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Filter size={13} /> Eligibility Engine
                        </button>
                        <button onClick={() => deleteJob(job.id, drive.id)} className="btn-ghost p-1.5 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                  {(jobs[drive.id] || []).length === 0 && <div className="text-xs text-gray-500 text-center py-6">No job postings in this drive yet.</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Drive Modal */}
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

      {/* Job Modal */}
      {jobModal && (
        <Modal title="Add Job Posting & Eligibility Criteria" onClose={() => setJobModal(null)} onSubmit={saveJob} loading={saving}>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Job Title *</label>
            <input required className="input-field" placeholder="e.g. Software Engineer (Backend)" value={jForm.title} onChange={e => setJForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Description</label>
            <textarea className="input-field" rows={2} placeholder="Role overview & responsibilities..." value={jForm.description} onChange={e => setJForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Package (LPA)</label>
              <input type="number" step="0.1" className="input-field" placeholder="e.g. 12.5" value={jForm.packageLpa} onChange={e => setJForm(f => ({ ...f, packageLpa: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Min CGPA Cutoff</label>
              <input type="number" step="0.1" max="10" className="input-field" placeholder="e.g. 7.5" value={jForm.minimumCgpa} onChange={e => setJForm(f => ({ ...f, minimumCgpa: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Max Backlogs Allowed</label>
              <input type="number" className="input-field" placeholder="0" value={jForm.maxBacklogs} onChange={e => setJForm(f => ({ ...f, maxBacklogs: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Allowed Branches</label>
              <input className="input-field" placeholder="CS, IT, ECE" value={jForm.allowedBranches} onChange={e => setJForm(f => ({ ...f, allowedBranches: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Required Skills (Comma separated)</label>
            <input className="input-field" placeholder="Java, Spring Boot, React, SQL, System Design" value={jForm.requiredSkills} onChange={e => setJForm(f => ({ ...f, requiredSkills: e.target.value }))} />
          </div>
        </Modal>
      )}

      {/* Eligibility Engine Results Preview Modal */}
      {eligibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="surface-card p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-indigo-500/30">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter size={18} className="text-indigo-400" /> Eligibility Engine Analysis
                </h2>
                <p className="text-xs text-slate-400">Role: {eligibilityModal.job.title} | Min CGPA Cutoff: {eligibilityModal.minCgpa}</p>
              </div>
              <button onClick={() => setEligibilityModal(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <div className="text-xs font-medium text-emerald-300">Eligible Candidates</div>
                <div className="text-3xl font-extrabold mt-1">{eligibilityModal.eligible.length}</div>
                <div className="text-[11px] text-emerald-400/70 mt-0.5">Meet CGPA cutoff (≥ {eligibilityModal.minCgpa})</div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <div className="text-xs font-medium text-red-300">Ineligible Candidates</div>
                <div className="text-3xl font-extrabold mt-1">{eligibilityModal.ineligible.length}</div>
                <div className="text-[11px] text-red-400/70 mt-0.5">Below CGPA cutoff (&lt; {eligibilityModal.minCgpa})</div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-200 mb-3">Eligible Students List</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {eligibilityModal.eligible.map((st) => (
                <div key={st.studentId} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-xs">
                  <div>
                    <div className="font-semibold text-white">{st.fullName}</div>
                    <div className="text-slate-400 text-[11px]">{st.email} • {st.departmentName || 'CS'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-green font-bold">CGPA {st.cgpa}</span>
                    <span className="text-indigo-300 font-semibold">{st.readinessScore ? `${st.readinessScore}% Ready` : '78% Ready'}</span>
                  </div>
                </div>
              ))}
              {eligibilityModal.eligible.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">No students meet the criteria.</div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setEligibilityModal(null)} className="btn-primary text-xs py-2 px-4">
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
