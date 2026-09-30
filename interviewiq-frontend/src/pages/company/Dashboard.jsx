import { useState } from 'react'
import { Building, Users, Briefcase, FileSearch, ArrowRight, Sparkles, Filter, CheckCircle2, Clock } from 'lucide-react'

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('drives')

  const drivesList = [
    { id: 1, role: 'Software Engineer (Backend)', college: 'D. J. Sanghvi & VJTI', date: 'Closing in 2 days', applicants: 342, shortlisted: 48, status: 'Screening' },
    { id: 2, role: 'Frontend React Developer', college: 'All Partner Colleges', date: 'Closing in 5 days', applicants: 215, shortlisted: 30, status: 'Open' },
    { id: 3, role: 'Data Analyst & ML Intern', college: 'KJ Somaiya & SPIT', date: 'Interviews Ongoing', applicants: 285, shortlisted: 65, status: 'Interviewing' },
  ]

  const candidateTalentPool = [
    { name: 'Sarah Jenkins', college: 'D. J. Sanghvi College', score: 94, role: 'Software Engineer', skills: ['Java', 'Spring Boot', 'SQL'] },
    { name: 'Rahul Sharma', college: 'VJTI Mumbai', score: 91, role: 'Frontend React Developer', skills: ['React', 'TypeScript', 'Tailwind'] },
    { name: 'Priya Desai', college: 'Thadomal Shahani', score: 88, role: 'Data Analyst', skills: ['Python', 'Pandas', 'SQL'] },
    { name: 'Aman Verma', college: 'SPIT Mumbai', score: 86, role: 'Software Engineer', skills: ['C++', 'DSA', 'System Design'] },
  ]

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Company Recruitment Portal</h1>
          <p className="text-slate-400 text-sm">Manage campus drives, evaluate AI interview readiness, and shortlist top talent.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Briefcase size={16} /> Post Campus Placement Drive
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="surface-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Drives</div>
            <div className="text-3xl font-extrabold text-white">3 Drives</div>
            <div className="text-xs font-medium text-emerald-400 mt-2">Across 12 Colleges</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Briefcase size={22} />
          </div>
        </div>

        <div className="surface-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Applicants</div>
            <div className="text-3xl font-extrabold text-white">842 Students</div>
            <div className="text-xs font-medium text-indigo-400 mt-2">Applied this season</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Users size={22} />
          </div>
        </div>

        <div className="surface-card p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">Shortlisted</div>
            <div className="text-3xl font-extrabold text-white">143 Talent</div>
            <div className="text-xs font-medium text-emerald-400 mt-2">≥ 80% AI Score</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileSearch size={22} />
          </div>
        </div>

        <div className="surface-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Partner Colleges</div>
            <div className="text-3xl font-extrabold text-white">12 Colleges</div>
            <div className="text-xs font-medium text-slate-400 mt-2">Connected Institutional Hubs</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Building size={22} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Campus Drives */}
        <div className="surface-card border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-400" /> Active Placement Drives
            </h2>
          </div>
          
          <div className="space-y-4">
            {drivesList.map((drive) => (
              <div key={drive.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{drive.role}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{drive.college}</p>
                  </div>
                  <span className={`badge ${
                    drive.status === 'Open' ? 'badge-green' :
                    drive.status === 'Screening' ? 'badge-yellow' : 'badge-violet'
                  }`}>
                    {drive.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-4">
                    <span>👥 {drive.applicants} Applicants</span>
                    <span className="text-emerald-400 font-semibold">✓ {drive.shortlisted} Shortlisted</span>
                  </div>
                  <span className="text-slate-400">{drive.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Scoring Talent Pool */}
        <div className="surface-card border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" /> Top AI-Scored Candidates
            </h2>
          </div>
          
          <div className="space-y-4">
            {candidateTalentPool.map((cand, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
                    {cand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{cand.name}</h3>
                    <p className="text-xs text-slate-400">{cand.college}</p>
                    <div className="flex gap-1.5 mt-1">
                      {cand.skills.map(sk => (
                        <span key={sk} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-400">{cand.score}%</div>
                  <div className="text-[11px] text-slate-400">AI Readiness</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
