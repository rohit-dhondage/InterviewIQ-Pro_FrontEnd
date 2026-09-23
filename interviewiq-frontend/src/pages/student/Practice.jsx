import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target, Brain, MessageSquare, Code2, Database, Cpu,
  LayoutGrid, ChevronRight, Sparkles, Play, Clock, BarChart3,
  Zap, Building2, Star
} from 'lucide-react'
import api from '../../api/axios'

const TOPICS = [
  { id: 'dsa', label: 'Data Structures & Algorithms', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { id: 'dbms', label: 'DBMS & SQL', icon: Database, color: 'text-violet-400', bg: 'bg-violet-500/15' },
  { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { id: 'oop', label: 'OOPs & Java', icon: LayoutGrid, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { id: 'systemdesign', label: 'System Design', icon: BarChart3, color: 'text-pink-400', bg: 'bg-pink-500/15' },
  { id: 'networking', label: 'Computer Networks', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
]

const INTERVIEW_TYPES = [
  { id: 'TECHNICAL', label: 'Technical Interview', icon: Code2, desc: 'DSA, System Design, Core CS' },
  { id: 'HR', label: 'HR Interview', icon: MessageSquare, desc: 'Behavioral, motivation, situational' },
  { id: 'MIXED', label: 'Mixed Round', icon: Brain, desc: 'Combination of both' },
]

const DIFFICULTIES = [
  { id: 'EASY', label: 'Easy', desc: 'Fresher / Entry level', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
  { id: 'MEDIUM', label: 'Medium', desc: 'Campus placement level', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10' },
  { id: 'HARD', label: 'Hard', desc: 'Product company level', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/10' },
]

const COMPANIES = [
  { id: 'TCS', name: 'TCS', logo: '🔵' },
  { id: 'Infosys', name: 'Infosys', logo: '🟣' },
  { id: 'Wipro', name: 'Wipro', logo: '⭕' },
  { id: 'Cognizant', name: 'Cognizant', logo: '🔷' },
  { id: 'Accenture', name: 'Accenture', logo: '🟡' },
  { id: 'Google', name: 'Google', logo: '🔴' },
  { id: 'Amazon', name: 'Amazon', logo: '🟠' },
  { id: 'Microsoft', name: 'Microsoft', logo: '🟦' },
  { id: 'custom', name: 'General / No Company', logo: '🌐' },
]

const DURATIONS = [
  { id: 15, label: '15 min', desc: 'Quick practice' },
  { id: 30, label: '30 min', desc: 'Standard session' },
  { id: 60, label: '60 min', desc: 'Full interview' },
]

export default function Practice() {
  const navigate = useNavigate()
  const [selectedTopics, setSelectedTopics] = useState([])
  const [interviewType, setInterviewType] = useState('TECHNICAL')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [company, setCompany] = useState('custom')
  const [duration, setDuration] = useState(30)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  const toggleTopic = (id) => {
    setSelectedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const startSession = async () => {
    if (interviewType === 'TECHNICAL' && selectedTopics.length === 0) {
      setError('Please select at least one topic for a technical interview.')
      return
    }
    setError('')
    setStarting(true)
    try {
      const payload = {
        interviewType,
        topics: selectedTopics,
        difficulty,
        company: company === 'custom' ? null : company,
        durationMinutes: duration,
      }
      const res = await api.post('/interviews/start', payload)
      navigate(`/student/interviews/${res.data.sessionId}`)
    } catch (err) {
      console.warn('API unavailable, starting demo session:', err)
      // Navigate to a demo session
      navigate(`/student/interviews/demo-session-1`)
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
          <Target size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Practice Interview</h1>
          <p className="text-sm text-slate-400">Configure your session and start practicing with AI</p>
        </div>
      </div>

      <div className="space-y-7">

        {/* Interview Type */}
        <div>
          <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">Interview Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INTERVIEW_TYPES.map(type => {
              const Icon = type.icon
              const active = interviewType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setInterviewType(type.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-violet-500/60 bg-violet-500/15'
                      : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={active ? 'text-violet-400' : 'text-slate-400'} />
                    <span className={`text-sm font-bold ${active ? 'text-violet-300' : 'text-white'}`}>
                      {type.label}
                    </span>
                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-violet-400" />}
                  </div>
                  <p className="text-xs text-slate-500">{type.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Topics (only for technical) */}
        {(interviewType === 'TECHNICAL' || interviewType === 'MIXED') && (
          <div>
            <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">
              Focus Topics <span className="text-slate-500 font-normal normal-case">(select all that apply)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TOPICS.map(topic => {
                const Icon = topic.icon
                const active = selectedTopics.includes(topic.id)
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      active
                        ? `${topic.bg} border-current ${topic.color}`
                        : 'border-white/10 bg-white/3 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{topic.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">Difficulty</p>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map(d => {
              const active = difficulty === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    active ? `${d.bg} ${d.border}` : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <p className={`text-sm font-bold ${active ? d.color : 'text-white'}`}>{d.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">
            Company-Specific Mode <span className="text-slate-500 font-normal normal-case">(optional)</span>
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {COMPANIES.map(c => {
              const active = company === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCompany(c.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all ${
                    active
                      ? 'border-violet-500/60 bg-violet-500/15'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{c.logo}</span>
                  <span className={`text-xs font-medium ${active ? 'text-violet-300' : 'text-slate-400'}`}>
                    {c.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">Session Duration</p>
          <div className="flex gap-3">
            {DURATIONS.map(d => {
              const active = duration === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                    active
                      ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                      : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Clock size={14} /> {d.label}
                  <span className="text-xs text-slate-500">· {d.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Session Summary + Start Button */}
        <div className="surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-violet-500/20">
          <div>
            <p className="font-bold text-white mb-1.5">Session Summary</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="badge badge-violet">{interviewType === 'TECHNICAL' ? 'Technical' : interviewType === 'HR' ? 'HR' : 'Mixed'}</span>
              <span className="badge badge-yellow">{difficulty}</span>
              {company !== 'custom' && <span className="badge badge-blue">{company}</span>}
              <span className="badge badge-green">{duration} min</span>
              {selectedTopics.length > 0 && (
                <span className="badge badge-violet">
                  {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={startSession}
            disabled={starting}
            className="btn-primary shrink-0 text-sm py-3 px-7"
          >
            {starting ? (
              <><span className="animate-spin">⟳</span> Starting...</>
            ) : (
              <><Sparkles size={16} /> Start AI Interview</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
