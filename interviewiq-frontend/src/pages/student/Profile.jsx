import { useState } from 'react'
import { User, Mail, Book, MapPin, Upload, Link, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [skills, setSkills] = useState(['React', 'Node.js', 'MongoDB', 'Java', 'Spring Boot'])
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove))
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">My Profile</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage your personal information and resume.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info & Links */}
        <div className="lg:col-span-1 space-y-6">
          <div className="surface-card text-center relative overflow-hidden pt-12">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600/40 to-violet-600/40"></div>
            <div className="relative w-24 h-24 rounded-full border-4 border-[#121212] bg-white/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <User size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold">{user?.fullName || 'Student Name'}</h2>
            <p className="text-sm text-gray-400 mb-4">{user?.email || 'student@example.com'}</p>
            <button className="btn btn-secondary w-full">Edit Profile</button>
          </div>

          <div className="surface-card">
            <h3 className="font-semibold mb-4 border-b border-white/10 pb-2">Social Links</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Link size={18} className="text-gray-400" />
                <input type="text" placeholder="github.com/username" className="input py-1.5 px-3 w-full" defaultValue="github.com/johndoe" />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Link size={18} className="text-gray-400" />
                <input type="text" placeholder="linkedin.com/in/username" className="input py-1.5 px-3 w-full" defaultValue="linkedin.com/in/johndoe" />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <ExternalLink size={18} className="text-gray-400" />
                <input type="text" placeholder="Portfolio URL" className="input py-1.5 px-3 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Resume */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card">
            <h3 className="font-semibold mb-4 border-b border-white/10 pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">College/University</label>
                <div className="flex items-center gap-2">
                  <Book size={16} className="text-gray-500" />
                  <span className="text-sm">Engineering College Pune</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Branch/Degree</label>
                <div className="text-sm">B.Tech - Computer Science</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Graduation Year</label>
                <div className="text-sm">2024</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">CGPA</label>
                <div className="text-sm">8.75</div>
              </div>
            </div>
          </div>

          <div className="surface-card">
            <h3 className="font-semibold mb-4 border-b border-white/10 pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <span key={skill} className="badge badge-blue flex items-center gap-1">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-white ml-1">&times;</button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add a skill..." 
                className="input py-1.5 px-3 text-sm flex-grow"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary py-1.5 px-4 text-sm">Add</button>
            </form>
          </div>

          <div className="surface-card">
            <h3 className="font-semibold mb-4 border-b border-white/10 pb-2">Resume</h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Upload size={20} />
              </div>
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF (Max. 5MB)</p>
            </div>
            
            <div className="mt-4 p-3 bg-white/5 rounded-lg flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded flex items-center justify-center text-xs font-bold">PDF</div>
                <div>
                  <p className="text-sm font-medium">John_Doe_Resume_2023.pdf</p>
                  <p className="text-xs text-gray-500">Updated 2 days ago</p>
                </div>
              </div>
              <button className="text-indigo-400 text-sm hover:text-indigo-300 font-medium">View</button>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button className="btn btn-primary px-8">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
