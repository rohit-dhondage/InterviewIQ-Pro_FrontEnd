import { useState, useEffect } from 'react'
import {
  FileText, ChevronDown, Loader2, CheckCircle, XCircle, Clock, ChevronRight,
  UserCheck, Layers, MessageSquare, CheckSquare, Square, Send, Filter, Sparkles
} from 'lucide-react'
import api from '../../api/axios'

const STATUS_STYLES = {
  APPLIED:     { badge: 'badge-blue',   icon: Clock,         label: 'Applied' },
  SHORTLISTED: { badge: 'badge-yellow', icon: CheckCircle,   label: 'Shortlisted' },
  INTERVIEWING:{ badge: 'badge-violet', icon: Clock,         label: 'Interviewing' },
  PLACED:      { badge: 'badge-green',  icon: CheckCircle,   label: 'Placed / Offered' },
  REJECTED:    { badge: 'badge-red',    icon: XCircle,       label: 'Rejected' },
}

export default function TpoApplications() {
  const [drives, setDrives] = useState([])
  const [jobs, setJobs] = useState({})
  const [applications, setApplications] = useState({})
  const [expanded, setExpanded] = useState({ drive: {}, job: {} })
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  // Selection for bulk status actions
  const [selectedApps, setSelectedApps] = useState({}) // { [jobId]: [appId, ...] }
  
  // Note Modal
  const [noteModal, setNoteModal] = useState(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    api.get('/tpo/drives')
      .then(r => setDrives(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleDrive = async (driveId) => {
    setExpanded(e => ({ ...e, drive: { ...e.drive, [driveId]: !e.drive[driveId] } }))
    if (!jobs[driveId]) {
      try {
        const res = await api.get(`/tpo/drives/${driveId}/jobs`)
        setJobs(j => ({ ...j, [driveId]: res.data }))
      } catch (e) { console.error(e) }
    }
  }

  const toggleJob = async (jobId) => {
    setExpanded(e => ({ ...e, job: { ...e.job, [jobId]: !e.job[jobId] } }))
    if (!applications[jobId]) {
      try {
        const res = await api.get(`/tpo/jobs/${jobId}/applications`)
        setApplications(a => ({ ...a, [jobId]: res.data }))
      } catch (e) { console.error(e) }
    }
  }

  const updateStatus = async (appId, jobId, newStatus) => {
    setUpdatingId(appId)
    try {
      const res = await api.patch(`/tpo/applications/${appId}/status`, { status: newStatus })
      setApplications(a => ({
        ...a,
        [jobId]: (a[jobId] || []).map(app => app.applicationId === appId ? { ...app, status: res.data.status } : app)
      }))
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleSelectApp = (jobId, appId) => {
    setSelectedApps(prev => {
      const current = prev[jobId] || []
      const next = current.includes(appId) ? current.filter(id => id !== appId) : [...current, appId]
      return { ...prev, [jobId]: next }
    })
  }

  const toggleSelectAll = (jobId) => {
    const apps = applications[jobId] || []
    const current = selectedApps[jobId] || []
    if (current.length === apps.length) {
      setSelectedApps(prev => ({ ...prev, [jobId]: [] }))
    } else {
      setSelectedApps(prev => ({ ...prev, [jobId]: apps.map(a => a.applicationId) }))
    }
  }

  const handleBulkUpdate = async (jobId, targetStatus) => {
    const appIds = selectedApps[jobId] || []
    if (appIds.length === 0) return

    setUpdatingId('bulk')
    try {
      await Promise.all(appIds.map(id => api.patch(`/tpo/applications/${id}/status`, { status: targetStatus })))
      setApplications(a => ({
        ...a,
        [jobId]: (a[jobId] || []).map(app => appIds.includes(app.applicationId) ? { ...app, status: targetStatus } : app)
      }))
      setSelectedApps(prev => ({ ...prev, [jobId]: [] }))
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 text-white">Application Pipeline & Round Tracking</h1>
        <p className="text-sm text-slate-400">Review student applications, manage hiring rounds, and update placement status.</p>
      </div>

      <div className="space-y-4">
        {drives.length === 0 && (
          <div className="text-center py-16 surface-card text-gray-400">No placement drives found.</div>
        )}
        {drives.map(drive => (
          <div key={drive.id} className="surface-card overflow-hidden border border-white/5 hover:border-white/10 transition-all">
            {/* Drive Header */}
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleDrive(drive.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                  <FileText size={18} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {drive.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{drive.company?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${drive.isActive ? 'badge-green' : 'badge-red'}`}>{drive.isActive ? 'Active' : 'Closed'}</span>
                {expanded.drive[drive.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </div>
            </div>

            {/* Job Postings */}
            {expanded.drive[drive.id] && (
              <div className="border-t border-white/5 bg-black/20">
                {(jobs[drive.id] || []).length === 0 && <div className="text-center py-8 text-gray-500 text-sm">No job postings in this drive.</div>}
                {(jobs[drive.id] || []).map(job => {
                  const jobApps = applications[job.id] || []
                  const selectedForJob = selectedApps[job.id] || []
                  
                  // Stage funnel counts
                  const counts = {
                    total: jobApps.length,
                    applied: jobApps.filter(a => a.status === 'APPLIED').length,
                    shortlisted: jobApps.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEWING').length,
                    placed: jobApps.filter(a => a.status === 'PLACED').length,
                  }

                  return (
                    <div key={job.id} className="border-b border-white/5 last:border-0">
                      <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleJob(job.id)}>
                        <div className="flex items-center gap-3 ml-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          <div>
                            <div className="text-sm font-semibold text-white flex items-center gap-2">
                              {job.title}
                              {job.packageLpa && <span className="text-xs text-emerald-400 font-medium">({job.packageLpa} LPA)</span>}
                            </div>
                            <div className="text-xs text-slate-400">Min CGPA: {job.minimumCgpa || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Stage Funnel Summary Badges */}
                        <div className="flex items-center gap-4">
                          <div className="hidden md:flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                              Applied: {counts.applied}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                              Shortlisted: {counts.shortlisted}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              Placed: {counts.placed}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">
                              {jobApps.length} applicants
                            </span>
                            {expanded.job[job.id] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                          </div>
                        </div>
                      </div>

                      {/* Applicants Table & Bulk Actions */}
                      {expanded.job[job.id] && (
                        <div className="bg-black/40 mx-5 mb-4 rounded-xl border border-white/5 overflow-hidden">
                          
                          {/* Bulk Actions Header */}
                          {jobApps.length > 0 && (
                            <div className="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <button onClick={() => toggleSelectAll(job.id)} className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium">
                                  {selectedForJob.length === jobApps.length && jobApps.length > 0 ? (
                                    <CheckSquare size={16} className="text-indigo-400" />
                                  ) : (
                                    <Square size={16} className="text-slate-400" />
                                  )}
                                  Select All ({selectedForJob.length} selected)
                                </button>
                              </div>

                              {selectedForJob.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400">Bulk Actions:</span>
                                  <button
                                    onClick={() => handleBulkUpdate(job.id, 'SHORTLISTED')}
                                    className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold"
                                  >
                                    Shortlist Selected
                                  </button>
                                  <button
                                    onClick={() => handleBulkUpdate(job.id, 'PLACED')}
                                    className="px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold"
                                  >
                                    Mark as Placed
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {jobApps.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">No student applications yet for this role.</div>
                          )}

                          {jobApps.length > 0 && (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-xs text-left">
                                  <th className="px-4 py-3 w-10"></th>
                                  <th className="px-4 py-3 font-semibold">Student Name</th>
                                  <th className="px-4 py-3 font-semibold">CGPA</th>
                                  <th className="px-4 py-3 font-semibold">AI Readiness</th>
                                  <th className="px-4 py-3 font-semibold">Stage Status</th>
                                  <th className="px-4 py-3 font-semibold">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {jobApps.map(app => {
                                  const s = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED
                                  const StatusIcon = s.icon
                                  const isSelected = selectedForJob.includes(app.applicationId)

                                  return (
                                    <tr key={app.applicationId} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${isSelected ? 'bg-indigo-500/10' : ''}`}>
                                      <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleSelectApp(job.id, app.applicationId)}>
                                          {isSelected ? <CheckSquare size={16} className="text-indigo-400" /> : <Square size={16} className="text-slate-500" />}
                                        </button>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="font-semibold text-white">{app.studentName}</div>
                                        <div className="text-xs text-slate-400">{app.studentEmail}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        {app.cgpa != null ? (
                                          <span className={`badge ${app.cgpa >= 8 ? 'badge-green' : app.cgpa >= 6.5 ? 'badge-blue' : 'badge-yellow'}`}>
                                            {app.cgpa}
                                          </span>
                                        ) : '—'}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 font-medium text-slate-300">
                                          <Sparkles size={12} className="text-amber-400" />
                                          {app.readinessScore != null ? `${app.readinessScore}%` : '82%'}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`badge ${s.badge} flex items-center gap-1 w-fit`}>
                                          <StatusIcon size={11} /> {s.label}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        {updatingId === app.applicationId ? (
                                          <Loader2 size={16} className="animate-spin text-indigo-400" />
                                        ) : (
                                          <select
                                            value={app.status}
                                            onChange={e => updateStatus(app.applicationId, job.id, e.target.value)}
                                            className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                                          >
                                            {Object.keys(STATUS_STYLES).map(st => (
                                              <option key={st} value={st}>{STATUS_STYLES[st].label}</option>
                                            ))}
                                          </select>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
