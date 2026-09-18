import { useState, useEffect } from 'react'
import { FileText, ChevronDown, Loader2, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react'
import api from '../../api/axios'

const STATUS_STYLES = {
  APPLIED:     { badge: 'badge-blue',   icon: Clock,         label: 'Applied' },
  SHORTLISTED: { badge: 'badge-green',  icon: CheckCircle,   label: 'Shortlisted' },
  REJECTED:    { badge: 'badge-red',    icon: XCircle,       label: 'Rejected' },
  PLACED:      { badge: 'badge-violet', icon: CheckCircle,   label: 'Placed' },
}

export default function TpoApplications() {
  const [drives, setDrives] = useState([])
  const [jobs, setJobs] = useState({})
  const [applications, setApplications] = useState({})
  const [expanded, setExpanded] = useState({ drive: {}, job: {} })
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

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
        [jobId]: a[jobId].map(app => app.applicationId === appId ? { ...app, status: res.data.status } : app)
      }))
    } catch (e) { console.error(e) }
    finally { setUpdatingId(null) }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Applications</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Review and manage student applications for each placement drive.</p>
      </div>

      <div className="space-y-3">
        {drives.length === 0 && (
          <div className="text-center py-16 surface-card text-gray-400">No placement drives found.</div>
        )}
        {drives.map(drive => (
          <div key={drive.id} className="surface-card overflow-hidden">
            {/* Drive Header */}
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleDrive(drive.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-semibold">{drive.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{drive.company?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${drive.isActive ? 'badge-green' : 'badge-red'}`}>{drive.isActive ? 'Active' : 'Closed'}</span>
                {expanded.drive[drive.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </div>
            </div>

            {/* Job Postings */}
            {expanded.drive[drive.id] && (
              <div className="border-t border-white/5">
                {(jobs[drive.id] || []).length === 0 && <div className="text-center py-8 text-gray-500 text-sm">No job postings in this drive.</div>}
                {(jobs[drive.id] || []).map(job => (
                  <div key={job.id} className="border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleJob(job.id)}>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <div>
                          <div className="text-sm font-medium">{job.title}</div>
                          <div className="text-xs text-gray-500">
                            {job.packageLpa && `${job.packageLpa} LPA`}{job.minimumCgpa && ` • Min CGPA: ${job.minimumCgpa}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {applications[job.id] ? `${applications[job.id].length} applicants` : ''}
                        </span>
                        {expanded.job[job.id] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                      </div>
                    </div>

                    {/* Applicants Table */}
                    {expanded.job[job.id] && (
                      <div className="bg-black/20 mx-5 mb-3 rounded-xl overflow-hidden">
                        {(applications[job.id] || []).length === 0 && (
                          <div className="text-center py-8 text-gray-500 text-sm">No applications yet.</div>
                        )}
                        {(applications[job.id] || []).length > 0 && (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Student</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">CGPA</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Readiness</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(applications[job.id] || []).map(app => {
                                const s = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED
                                const StatusIcon = s.icon
                                return (
                                  <tr key={app.applicationId} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                                    <td className="px-4 py-3">
                                      <div className="font-medium">{app.studentName}</div>
                                      <div className="text-xs text-gray-500">{app.studentEmail}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                      {app.cgpa != null ? (
                                        <span className={`badge ${app.cgpa >= 8 ? 'badge-green' : app.cgpa >= 6.5 ? 'badge-blue' : 'badge-yellow'}`}>{app.cgpa}</span>
                                      ) : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                      {app.readinessScore != null ? `${app.readinessScore}%` : '—'}
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
                                          className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white outline-none"
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
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
