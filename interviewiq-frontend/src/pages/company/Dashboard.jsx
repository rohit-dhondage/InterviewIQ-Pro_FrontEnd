import { Building, Users, Briefcase, FileSearch, ArrowRight } from 'lucide-react'

export default function CompanyDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back, Tech Solutions!</h1>
          <p className="text-slate-500 text-sm">Here's an overview of your campus recruitment activities.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Create New Drive
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-semibold text-slate-500">Active Drives</div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">3</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-semibold text-slate-500">Total Applicants</div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">842</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-semibold text-slate-500">Shortlisted</div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileSearch size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">124</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm font-semibold text-slate-500">Partner Colleges</div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Building size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Drives */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Active Placement Drives</h2>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { role: 'Software Engineer Intern', date: 'Closing in 2 days', applicants: 342, status: 'Screening' },
              { role: 'Frontend Developer (FTE)', date: 'Closing in 5 days', applicants: 215, status: 'Open' },
              { role: 'Data Analyst', date: 'Closed', applicants: 285, status: 'Interviews' },
            ].map((drive, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{drive.role}</h3>
                  <div className="flex gap-4 mt-1 text-xs text-slate-500">
                    <span>{drive.date}</span>
                    <span>•</span>
                    <span>{drive.applicants} Applicants</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    drive.status === 'Open' ? 'bg-emerald-50 text-emerald-600' :
                    drive.status === 'Screening' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {drive.status}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Top Scoring Candidates</h2>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Browse Talent</button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Sarah Jenkins', college: 'D. J. Sanghvi College', score: '92%', role: 'Frontend Developer' },
              { name: 'Rahul Sharma', college: 'VJTI Mumbai', score: '88%', role: 'Software Engineer Intern' },
              { name: 'Priya Desai', college: 'Thadomal Shahani', score: '85%', role: 'Data Analyst' },
            ].map((candidate, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                    <p className="text-xs text-slate-500">{candidate.college}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">{candidate.score}</div>
                  <div className="text-xs text-slate-500">{candidate.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
