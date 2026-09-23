import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Map, CheckCircle2, Circle, ChevronRight, Lock,
  Code2, Database, Cpu, Layers, MessageSquare, FileText,
  Loader2, Play, BookOpen, ExternalLink, Trophy, Star
} from 'lucide-react'
import api from '../../api/axios'

const DEFAULT_ROADMAP = [
  {
    phase: 1,
    title: 'Data Structures & Algorithms',
    icon: Code2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    topics: [
      { id: 't1', label: 'Arrays & Strings', done: true, resources: ['LeetCode Easy', 'GFG Arrays'] },
      { id: 't2', label: 'Linked Lists', done: true, resources: ['GFG LL', 'CS Dojo'] },
      { id: 't3', label: 'Stacks & Queues', done: true, resources: ['Neetcode', 'GFG'] },
      { id: 't4', label: 'Trees & Graphs', done: false, resources: ['Neetcode 150', 'GFG Trees'] },
      { id: 't5', label: 'Dynamic Programming', done: false, resources: ['DP Patterns', 'Aditya Verma YT'] },
      { id: 't6', label: 'Sorting & Searching', done: false, resources: ['GFG Sorting', 'LeetCode'] },
    ]
  },
  {
    phase: 2,
    title: 'Core Computer Science',
    icon: Cpu,
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
    topics: [
      { id: 't7', label: 'Operating Systems', done: false, resources: ['Gate Smashers YT', 'Neso Academy'] },
      { id: 't8', label: 'DBMS & SQL', done: false, resources: ['Neso Academy', 'W3Schools SQL'] },
      { id: 't9', label: 'Computer Networks', done: false, resources: ['Gate Smashers', 'Kurose Ross'] },
      { id: 't10', label: 'OOPs Concepts', done: false, resources: ['Java Brains', 'GFG OOP'] },
    ]
  },
  {
    phase: 3,
    title: 'System Design',
    icon: Layers,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    locked: false,
    topics: [
      { id: 't11', label: 'High-Level Design Basics', done: false, resources: ['Gaurav Sen YT', 'ByteByteGo'] },
      { id: 't12', label: 'Databases & Caching', done: false, resources: ['System Design Primer', 'ByteByteGo'] },
      { id: 't13', label: 'Load Balancing & Scaling', done: false, resources: ['Gaurav Sen', 'Educative.io'] },
    ]
  },
  {
    phase: 4,
    title: 'Projects & Portfolio',
    icon: FileText,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    topics: [
      { id: 't14', label: 'Build 2 Full-Stack Projects', done: false, resources: ['FCC', 'Traversy Media YT'] },
      { id: 't15', label: 'Upload to GitHub', done: false, resources: ['GitHub Docs'] },
      { id: 't16', label: 'Deploy (Vercel / Railway)', done: false, resources: ['Vercel Docs', 'Railway.app'] },
    ]
  },
  {
    phase: 5,
    title: 'Interview Preparation',
    icon: MessageSquare,
    color: 'text-pink-400',
    bg: 'bg-pink-500/15',
    border: 'border-pink-500/30',
    topics: [
      { id: 't17', label: 'HR Interview Practice', done: false, resources: ['InterviewIQ AI HR'] },
      { id: 't18', label: 'Technical Mock Interviews', done: false, resources: ['InterviewIQ AI Technical'] },
      { id: 't19', label: 'Resume Polishing', done: false, resources: ['InterviewIQ Resume Analyzer'] },
      { id: 't20', label: 'Company-Specific Prep', done: false, resources: ['InterviewIQ Practice Mode'] },
    ]
  },
]

export default function Roadmap() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [roadmap, setRoadmap] = useState(DEFAULT_ROADMAP)
  const [loading, setLoading] = useState(true)
  const [expandedPhase, setExpandedPhase] = useState(1)
  const [checkedTopics, setCheckedTopics] = useState({})

  useEffect(() => {
    api.get('/roadmap/me')
      .then(res => {
        if (res.data?.phases) setRoadmap(res.data.phases)
      })
      .catch(() => {}) // use default
      .finally(() => setLoading(false))
  }, [])

  const toggleTopic = (topicId) => {
    setCheckedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }))
  }

  const getPhaseProgress = (phase) => {
    const topics = phase.topics
    const done = topics.filter(t => t.done || checkedTopics[t.id]).length
    return { done, total: topics.length, pct: Math.round((done / topics.length) * 100) }
  }

  const totalTopics = roadmap.flatMap(p => p.topics).length
  const completedTopics = roadmap.flatMap(p => p.topics).filter(t => t.done || checkedTopics[t.id]).length
  const overallPct = Math.round((completedTopics / totalTopics) * 100)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Map size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Learning Roadmap</h1>
            <p className="text-sm text-slate-400">Personalized for {user?.fullName?.split(' ')[0] || 'you'}</p>
          </div>
        </div>

        <button onClick={() => navigate('/student/practice')} className="btn-primary text-sm shrink-0">
          <Play size={14} /> Start Practice
        </button>
      </div>

      {/* Overall Progress */}
      <div className="surface-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-400">Overall Progress</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold text-white">{overallPct}%</span>
              <span className="text-sm text-slate-500 mb-1">complete</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{completedTopics}</div>
              <div className="text-xs text-slate-500">Done</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-400">{totalTopics - completedTopics}</div>
              <div className="text-xs text-slate-500">Remaining</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{roadmap.length}</div>
              <div className="text-xs text-slate-500">Phases</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #7c3aed, #4f46e5, #10b981)' }}
          />
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {roadmap.map((phase) => {
          const PhaseIcon = phase.icon || BookOpen
          const { done, total, pct } = getPhaseProgress(phase)
          const isOpen = expandedPhase === phase.phase
          const isComplete = done === total

          return (
            <div
              key={phase.phase}
              className={`surface-card overflow-hidden border transition-all duration-200 ${
                isOpen ? phase.border || 'border-white/15' : 'border-white/7'
              }`}
            >
              {/* Phase Header */}
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                onClick={() => setExpandedPhase(isOpen ? null : phase.phase)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${phase.bg || 'bg-white/10'}`}>
                    {isComplete
                      ? <Trophy size={22} className="text-amber-400" />
                      : <PhaseIcon size={22} className={phase.color || 'text-slate-400'} />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phase {phase.phase}</span>
                      {isComplete && <span className="badge badge-green text-[10px]">Complete</span>}
                    </div>
                    <p className="font-bold text-white mt-0.5">{phase.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{done}/{total} topics completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-24 bg-white/10 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${isComplete ? 'bg-emerald-500' : phase.color?.replace('text-', 'bg-') || 'bg-indigo-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{pct}%</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Topics List */}
              {isOpen && (
                <div className="border-t border-white/7 p-5 space-y-2">
                  {phase.topics.map((topic, idx) => {
                    const isDone = topic.done || checkedTopics[topic.id]
                    return (
                      <div
                        key={topic.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                          isDone ? 'bg-emerald-500/8 border border-emerald-500/20' : 'hover:bg-white/4 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTopic(topic.id)}
                            className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-white/20 hover:border-emerald-400'
                            }`}
                          >
                            {isDone && <CheckCircle2 size={12} />}
                          </button>
                          <span className={`text-sm font-medium ${isDone ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                            {topic.label}
                          </span>
                        </div>

                        {topic.resources && topic.resources.length > 0 && (
                          <div className="hidden group-hover:flex items-center gap-1.5 ml-2">
                            {topic.resources.slice(0, 2).map((r, i) => (
                              <span key={i} className="badge badge-blue text-[10px] cursor-pointer">
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => navigate('/student/practice')}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      <Play size={12} /> Practice This Phase
                    </button>
                    <button
                      onClick={() => navigate('/student/doubts')}
                      className="btn-outline text-xs py-2 px-4"
                    >
                      <MessageSquare size={12} /> Ask a Doubt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
