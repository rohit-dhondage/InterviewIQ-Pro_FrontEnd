import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain, Target, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, TrendingUp, Loader2, RefreshCw, Play,
  Building2, Lightbulb, BookOpen
} from 'lucide-react'
import api from '../../api/axios'

const STUDENT_SKILLS = {
  'Data Structures': 76,
  'Algorithms': 68,
  'SQL & DBMS': 52,
  'Operating Systems': 61,
  'OOP & Java': 79,
  'System Design': 34,
  'Communication': 65,
  'Resume': 74,
}

const COMPANY_REQUIREMENTS = {
  TCS: {
    skills: { 'SQL & DBMS': 70, 'OOP & Java': 65, 'Communication': 60, 'Operating Systems': 55 },
    cgpa: 6.0, backlogs: 0,
    description: 'TCS values strong fundamentals with SQL, OOP, and communication skills.',
  },
  Infosys: {
    skills: { 'Data Structures': 65, 'SQL & DBMS': 65, 'Communication': 65, 'OOP & Java': 60 },
    cgpa: 6.5, backlogs: 0,
    description: 'Infosys focuses on problem-solving, SQL, and aptitude.',
  },
  Wipro: {
    skills: { 'OOP & Java': 60, 'Communication': 60, 'SQL & DBMS': 55 },
    cgpa: 6.0, backlogs: 0,
    description: 'Wipro seeks well-rounded candidates with good communication.',
  },
  Google: {
    skills: { 'Data Structures': 85, 'Algorithms': 85, 'System Design': 70, 'OOP & Java': 75 },
    cgpa: 7.5, backlogs: 0,
    description: 'Google requires exceptional DSA, algorithms, and system design knowledge.',
  },
  Amazon: {
    skills: { 'Data Structures': 80, 'Algorithms': 75, 'System Design': 65, 'Communication': 70 },
    cgpa: 7.0, backlogs: 0,
    description: 'Amazon focuses on Leadership Principles + strong DSA.',
  },
  Microsoft: {
    skills: { 'Data Structures': 78, 'Algorithms': 72, 'System Design': 60, 'OOP & Java': 70 },
    cgpa: 7.0, backlogs: 0,
    description: 'Microsoft values clean code, problem-solving, and teamwork.',
  },
  Cognizant: {
    skills: { 'SQL & DBMS': 65, 'Communication': 65, 'OOP & Java': 55 },
    cgpa: 6.0, backlogs: 1,
    description: 'Cognizant emphasizes communication and database knowledge.',
  },
}

const COMPANY_LOGOS = {
  TCS: '🔵', Infosys: '🟣', Wipro: '⭕', Google: '🔴',
  Amazon: '🟠', Microsoft: '🟦', Cognizant: '🔷',
}

function GapBar({ skill, studentScore, requiredScore }) {
  const gap = requiredScore - studentScore
  const meets = studentScore >= requiredScore
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-200">{skill}</span>
        <div className="flex items-center gap-2">
          {meets
            ? <CheckCircle2 size={15} className="text-emerald-400" />
            : <XCircle size={15} className="text-red-400" />
          }
          <span className={`text-sm font-bold ${meets ? 'text-emerald-400' : 'text-red-400'}`}>
            {studentScore}% / {requiredScore}%
          </span>
        </div>
      </div>
      <div className="relative w-full bg-white/10 rounded-full h-3">
        {/* Required threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
          style={{ left: `${requiredScore}%` }}
        />
        {/* Student score */}
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${meets ? 'bg-emerald-500' : 'bg-red-500'}`}
          style={{ width: `${studentScore}%` }}
        />
      </div>
      {!meets && (
        <p className="text-xs text-red-400/80 mt-1">
          Need +{gap}% improvement to meet requirement
        </p>
      )}
    </div>
  )
}

export default function SkillGap() {
  const navigate = useNavigate()
  const [selectedCompany, setSelectedCompany] = useState('TCS')
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/me')
      .then(res => setStudentData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const company = COMPANY_REQUIREMENTS[selectedCompany]
  const requiredSkills = company?.skills || {}

  // Use real data if available, else demo
  const getScore = (skill) => {
    if (studentData?.skillScores?.[skill] != null) return studentData.skillScores[skill]
    return STUDENT_SKILLS[skill] ?? 50
  }

  const skillResults = Object.entries(requiredSkills).map(([skill, required]) => ({
    skill,
    studentScore: getScore(skill),
    requiredScore: required,
    meets: getScore(skill) >= required,
  }))

  const metCount = skillResults.filter(s => s.meets).length
  const totalRequired = skillResults.length
  const readinessRatio = totalRequired > 0 ? Math.round((metCount / totalRequired) * 100) : 0

  const weakAreas = skillResults.filter(s => !s.meets).sort((a, b) => (a.studentScore - a.requiredScore) - (b.studentScore - b.requiredScore))

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-brain-500/20 text-purple-400 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
          <Brain size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
          <p className="text-sm text-slate-400">Compare your skills against company requirements</p>
        </div>
      </div>

      {/* Company Selector */}
      <div className="surface-card p-5 mb-6">
        <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">Select Company</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(COMPANY_REQUIREMENTS).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedCompany === c
                  ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/20 hover:text-slate-300'
              }`}
            >
              <span>{COMPANY_LOGOS[c]}</span> {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Readiness Summary */}
        <div className="space-y-4">
          {/* Readiness Score */}
          <div className="surface-card p-6 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {selectedCompany} Readiness
            </p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={readinessRatio >= 75 ? '#10b981' : readinessRatio >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - readinessRatio / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${
                  readinessRatio >= 75 ? 'text-emerald-400' :
                  readinessRatio >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>{readinessRatio}%</span>
              </div>
            </div>
            <p className={`text-sm font-bold mb-1 ${
              readinessRatio >= 75 ? 'text-emerald-400' :
              readinessRatio >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {readinessRatio >= 75 ? '✅ Ready to Apply' :
               readinessRatio >= 50 ? '⚠️ Almost Ready' : '❌ Needs More Prep'}
            </p>
            <p className="text-xs text-slate-500">
              You meet <strong className="text-white">{metCount}/{totalRequired}</strong> required skill areas
            </p>
          </div>

          {/* Company Details */}
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{COMPANY_LOGOS[selectedCompany]}</span>
              <div>
                <p className="font-bold text-white">{selectedCompany}</p>
                <p className="text-xs text-slate-500">Requirements</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{company.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Min CGPA</span>
                <span className="font-bold text-white">{company.cgpa}+</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Max Backlogs</span>
                <span className="font-bold text-white">{company.backlogs === 0 ? 'No backlogs' : `${company.backlogs} backlog allowed`}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="surface-card p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button onClick={() => navigate('/student/practice')} className="w-full btn-primary text-xs py-2.5 justify-center">
                <Play size={13} /> Practice for {selectedCompany}
              </button>
              <button onClick={() => navigate('/student/roadmap')} className="w-full btn-outline text-xs py-2.5 justify-center">
                <BookOpen size={13} /> View Study Roadmap
              </button>
            </div>
          </div>
        </div>

        {/* Right: Skill Gap Bars */}
        <div className="lg:col-span-2 space-y-4">
          <div className="surface-card p-6">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" />
              Skills Gap Analysis — {selectedCompany}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              White marker = required level | Bar = your current level
            </p>
            {skillResults.map(({ skill, studentScore, requiredScore }) => (
              <GapBar key={skill} skill={skill} studentScore={studentScore} requiredScore={requiredScore} />
            ))}
          </div>

          {/* Weak Areas + Recommendations */}
          {weakAreas.length > 0 && (
            <div className="surface-card p-6 border border-amber-500/20 bg-amber-500/5">
              <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Lightbulb size={18} /> Focus Areas for {selectedCompany}
              </h3>
              <div className="space-y-3">
                {weakAreas.map(({ skill, studentScore, requiredScore }) => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-white">{skill}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Need {requiredScore - studentScore}% more to qualify
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/student/practice')}
                      className="text-xs btn-outline py-1.5 px-3"
                    >
                      Practice <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weakAreas.length === 0 && (
            <div className="surface-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
              <p className="font-bold text-emerald-400 text-lg">You're Ready for {selectedCompany}!</p>
              <p className="text-sm text-slate-400 mt-1 mb-4">You meet all the skill requirements.</p>
              <button
                onClick={() => navigate('/student/drives')}
                className="btn-primary text-sm mx-auto"
              >
                View Placement Drives <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
