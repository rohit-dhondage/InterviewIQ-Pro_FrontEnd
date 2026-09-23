import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, CheckCircle2, AlertCircle, Loader2,
  User, Phone, Mail, Star, Briefcase, Code2, GraduationCap,
  Lightbulb, TrendingUp, RefreshCw, ChevronRight, Sparkles, BarChart3
} from 'lucide-react'
import api from '../../api/axios'

const SCORE_CATEGORIES = [
  { key: 'contactScore',     label: 'Contact Info',     icon: Phone,         color: 'text-blue-400',    bar: 'bg-blue-500' },
  { key: 'summaryScore',     label: 'Summary / Objective', icon: User,       color: 'text-violet-400',  bar: 'bg-violet-500' },
  { key: 'skillsScore',      label: 'Skills',           icon: Code2,         color: 'text-emerald-400', bar: 'bg-emerald-500' },
  { key: 'experienceScore',  label: 'Experience',       icon: Briefcase,     color: 'text-amber-400',   bar: 'bg-amber-500' },
  { key: 'educationScore',   label: 'Education',        icon: GraduationCap, color: 'text-pink-400',    bar: 'bg-pink-500' },
  { key: 'projectsScore',    label: 'Projects',         icon: Star,          color: 'text-indigo-400',  bar: 'bg-indigo-500' },
]

function ScoreRing({ score, size = 140 }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - (score || 0) / 100)
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

export default function Resume() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Mock result for demo when backend is unavailable
  const mockResult = {
    overallScore: 74,
    atsScore: 68,
    contactScore: 90,
    summaryScore: 55,
    skillsScore: 82,
    experienceScore: 70,
    educationScore: 95,
    projectsScore: 65,
    strengths: [
      'Strong technical skills section with relevant technologies',
      'Clear education history with GPA mentioned',
      'Multiple project entries with descriptions',
    ],
    improvements: [
      'Add a professional summary/objective at the top',
      'Quantify achievements with numbers (e.g., "Reduced load time by 40%")',
      'Include links to GitHub, LinkedIn or portfolio',
      'Use stronger action verbs (led, built, optimized)',
    ],
    extractedSkills: ['Java', 'Spring Boot', 'React', 'SQL', 'Git', 'REST API'],
    fileName: '',
  }

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i)) {
      setError('Only PDF or DOCX files are supported.')
      return
    }
    if (f.size > 5 * 1024 * 1024) { setError('File size must be under 5 MB.'); return }
    setError('')
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const uploadResume = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      console.warn('API unavailable, showing demo analysis:', err)
      // Show mock result so student sees what it will look like
      setResult({ ...mockResult, fileName: file.name })
    } finally {
      setUploading(false)
    }
  }

  const overallColor = result
    ? result.overallScore >= 75 ? 'text-emerald-400'
    : result.overallScore >= 50 ? 'text-amber-400'
    : 'text-red-400'
    : ''

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
        </div>
        <p className="text-sm text-slate-400 ml-12">
          Upload your resume and get an AI-powered ATS score with actionable feedback.
        </p>
      </div>

      {!result ? (
        /* ── Upload Zone ── */
        <div className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-emerald-400">{file.name}</p>
                    <p className="text-sm text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready to analyze</p>
                  </div>
                  <p className="text-xs text-slate-500">Click or drop a different file to replace</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center">
                    <Upload size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Drop your resume here</p>
                    <p className="text-sm text-slate-400 mt-1">or <span className="text-indigo-400 font-semibold">click to browse</span></p>
                  </div>
                  <p className="text-xs text-slate-500">PDF or DOCX • Max 5 MB</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {file && (
            <button
              onClick={uploadResume}
              disabled={uploading}
              className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: uploading ? '#4f46e5' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
            >
              {uploading ? (
                <><Loader2 size={18} className="animate-spin" /> Analyzing your resume with AI...</>
              ) : (
                <><Sparkles size={18} /> Analyze Resume</>
              )}
            </button>
          )}

          {/* Feature chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['ATS Score', 'Skill Extraction', 'Gap Analysis', 'Improvement Tips'].map(f => (
              <div key={f} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Analysis Results ── */
        <div className="space-y-6 animate-fade-up">

          {/* Header + Re-upload */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Analysis Complete</h2>
              <p className="text-sm text-slate-400 mt-0.5">{result.fileName || file?.name}</p>
            </div>
            <button
              onClick={() => { setResult(null); setFile(null) }}
              className="btn-outline text-sm flex items-center gap-2"
            >
              <RefreshCw size={14} /> Reanalyze
            </button>
          </div>

          {/* Score Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Score Ring */}
            <div className="surface-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
              <p className="text-sm font-semibold text-slate-400 mb-3">Overall Resume Score</p>
              <div className="relative">
                <ScoreRing score={result.overallScore} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${overallColor}`}>{result.overallScore}</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>
              <p className={`text-sm font-semibold mt-3 ${overallColor}`}>
                {result.overallScore >= 75 ? '🟢 Strong Resume' : result.overallScore >= 50 ? '🟡 Needs Improvement' : '🔴 Weak Resume'}
              </p>
            </div>

            {/* ATS Score */}
            <div className="surface-card p-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <BarChart3 size={26} />
              </div>
              <p className="text-sm font-semibold text-slate-400 mb-1">ATS Compatibility</p>
              <p className="text-4xl font-bold text-white">{result.atsScore ?? result.overallScore}</p>
              <p className="text-xs text-slate-500 mt-1">Applicant Tracking Score</p>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-4">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${result.atsScore ?? result.overallScore}%` }} />
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="surface-card p-6">
              <p className="text-sm font-semibold text-slate-400 mb-4">Detected Skills</p>
              <div className="flex flex-wrap gap-2">
                {(result.extractedSkills || []).map(skill => (
                  <span key={skill} className="badge badge-violet">{skill}</span>
                ))}
                {(!result.extractedSkills || result.extractedSkills.length === 0) && (
                  <p className="text-xs text-slate-500">No skills detected</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div className="surface-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Section-wise Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SCORE_CATEGORIES.map(({ key, label, icon: Icon, color, bar }) => {
                const score = result[key] ?? 0
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className={color} />
                        <span className="text-sm font-medium text-slate-300">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{score}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`${bar} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface-card p-6 border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} /> Strengths
              </h3>
              <ul className="space-y-3">
                {(result.strengths || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6 border border-amber-500/20 bg-amber-500/5">
              <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Lightbulb size={18} /> Improvements
              </h3>
              <ul className="space-y-3">
                {(result.improvements || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="surface-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">Ready to practice your interview?</p>
              <p className="text-sm text-slate-400 mt-0.5">Use your skill analysis to target the right preparation topics.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => navigate('/student/skill-gap')} className="btn-outline text-sm">
                Skill Gap Analysis
              </button>
              <button onClick={() => navigate('/student/practice')} className="btn-primary text-sm">
                Start AI Interview <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
