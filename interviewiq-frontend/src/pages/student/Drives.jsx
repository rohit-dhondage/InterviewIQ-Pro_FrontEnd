import { useState } from 'react'
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react'

export default function Drives() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')

  const drives = [
    {
      id: 1,
      company: 'TCS',
      role: 'Software Engineer',
      location: 'Pan India',
      ctc: '7-9 LPA',
      deadline: '2023-10-15',
      status: 'Open',
      type: 'Full Time'
    },
    {
      id: 2,
      company: 'Cognizant',
      role: 'GenC Developer',
      location: 'Pune, Bangalore',
      ctc: '4-6.5 LPA',
      deadline: '2023-10-20',
      status: 'Applied',
      type: 'Full Time'
    },
    {
      id: 3,
      company: 'Google',
      role: 'SRE Intern',
      location: 'Hyderabad',
      ctc: '1L / month',
      deadline: '2023-11-01',
      status: 'Open',
      type: 'Internship'
    }
  ]

  const filteredDrives = drives.filter(d => 
    d.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'All' || d.status === filter)
  )

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Placement Drives</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Discover and apply to the latest opportunities.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search companies..."
              className="input pl-9 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="input appearance-none pl-4 pr-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Applied">Applied</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map(drive => (
          <div key={drive.id} className="surface-card flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xl border border-white/10">
                  {drive.company.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{drive.company}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{drive.type}</p>
                </div>
              </div>
              {drive.status === 'Applied' ? (
                <span className="badge badge-green flex items-center gap-1">
                  <CheckCircle size={12} /> Applied
                </span>
              ) : (
                <span className="badge badge-blue">Open</span>
              )}
            </div>

            <div className="space-y-2 mb-6 flex-grow">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Briefcase size={16} className="text-gray-500" />
                <span>{drive.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin size={16} className="text-gray-500" />
                <span>{drive.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <DollarSign size={16} className="text-gray-500" />
                <span>{drive.ctc}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock size={16} className="text-gray-500" />
                <span>Apply by {new Date(drive.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-auto">
              {drive.status === 'Applied' ? (
                <button className="btn btn-secondary w-full" disabled>
                  Application Submitted
                </button>
              ) : (
                <button className="btn btn-primary w-full">
                  View Details & Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredDrives.length === 0 && (
        <div className="text-center py-12 surface-card border-dashed">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-1">No drives found</h3>
          <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}
