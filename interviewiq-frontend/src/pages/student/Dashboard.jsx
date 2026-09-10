import { useAuth } from '../../context/AuthContext'
import { Briefcase, Calendar, CheckCircle, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.fullName?.split(' ')[0] || 'Student'} 👋</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Here is what is happening with your placement preparation.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center badge-blue"><Briefcase size={18} /></div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Applications</div>
          </div>
          <div className="text-3xl font-bold">3</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center badge-violet"><Calendar size={18} /></div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming</div>
          </div>
          <div className="text-3xl font-bold">2</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center badge-green"><CheckCircle size={18} /></div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Score</div>
          </div>
          <div className="text-3xl font-bold">85%</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center badge-yellow"><TrendingUp size={18} /></div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</div>
          </div>
          <div className="text-3xl font-bold">12</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Upcoming Mock Interviews
            <span className="badge badge-violet text-[10px]">2</span>
          </h2>
          <div className="surface-card p-0 overflow-hidden divide-y" style={{ divideColor: 'var(--border)' }}>
            {[
              { company: 'TCS', type: 'Technical', date: 'Tomorrow, 10:00 AM' },
              { company: 'Infosys', type: 'HR', date: 'Friday, 2:00 PM' }
            ].map((i, idx) => (
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
                <div className="font-semibold text-sm mb-1">{i.company} Mock</div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{i.type} Round</span>
                  <span>{i.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drives */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Placement Drives</h2>
          <div className="surface-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-xs uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-5 py-4 font-semibold">Company</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Deadline</th>
                  <th className="px-5 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { company: 'TCS', role: 'Software Engineer', deadline: 'Oct 15' },
                  { company: 'Cognizant', role: 'GenC Developer', deadline: 'Oct 20' },
                ].map((d, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-medium">{d.company}</td>
                    <td className="px-5 py-4 text-gray-300">{d.role}</td>
                    <td className="px-5 py-4 text-gray-400">{d.deadline}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
