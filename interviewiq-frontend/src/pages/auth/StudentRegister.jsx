import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import {
  Brain, Mail, Lock, User, GraduationCap, Building2,
  Hash, BookOpen, Target, AlertCircle, CheckCircle2,
  ArrowRight, ChevronRight
} from 'lucide-react'

const YEAR_OPTIONS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
]

const TARGET_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Analyst', 'Data Scientist',
  'DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst',
  'Business Analyst', 'System Analyst', 'Product Manager',
]

export default function StudentRegister() {
  const { register: registerField, handleSubmit, watch, formState: { errors } } = useForm()
  const { register } = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [colleges, setColleges] = useState([])
  const [departments, setDepartments] = useState([])
  const [step, setStep] = useState(1) // 2-step form

  const selectedCollegeId = watch('collegeId')

  useEffect(() => {
    api.get('/colleges').then(r => setColleges(r.data)).catch(() => setColleges([]))
  }, [])

  useEffect(() => {
    if (selectedCollegeId) {
      api.get(`/colleges/${selectedCollegeId}/departments`)
        .then(r => setDepartments(r.data))
        .catch(() => setDepartments([]))
    } else {
      setDepartments([])
    }
  }, [selectedCollegeId])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        collegeId: parseInt(data.collegeId),
        departmentId: parseInt(data.departmentId),
        year: parseInt(data.year),
        rollNo: data.rollNo,
        cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
        targetRole: data.targetRole,
      }
      const user = await register(payload)
      if (user.role === 'STUDENT') navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Target, text: 'AI-Powered Interview Practice' },
    { icon: BookOpen, text: 'Personalized Learning Roadmap' },
    { icon: Brain, text: 'Resume Analysis & Scoring' },
    { icon: GraduationCap, text: 'Placement Readiness Tracker' },
  ]

  return (
    <div className="min-h-screen flex bg-blue-50/50 text-slate-800 font-sans">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative bg-gradient-to-br from-blue-950 to-indigo-900">
        {/* Logo */}
        <div className="absolute top-8 left-12 flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
            <Brain size={18} />
          </div>
          InterviewIQ <span className="text-blue-400">Pro</span>
        </div>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Campus Placement Platform
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white leading-tight">
            Start Your Placement Journey
          </h1>
          <p className="text-lg text-blue-200 mb-12">
            Join thousands of students preparing smarter with AI.
          </p>

          <div className="space-y-4">
            {features.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-blue-100">{item.text}</span>
                <ChevronRight size={16} className="text-blue-400 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-950/50 to-transparent" />
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 text-lg font-bold tracking-tight text-blue-900 mb-8">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <Brain size={15} />
            </div>
            InterviewIQ <span className="text-blue-600">Pro</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s < step ? 'bg-blue-600 text-white' :
                  s === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {s < step ? <CheckCircle2 size={16} /> : s}
                </div>
                <span className={`text-xs font-medium ${s === step ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s === 1 ? 'Personal Info' : 'Academic Details'}
                </span>
                {s < 2 && <div className={`h-0.5 w-8 rounded ${s < step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {step === 1 ? 'Create your account' : 'Academic information'}
            </h2>
            <p className="text-sm text-slate-500">
              {step === 1
                ? 'Set up your student profile to get started.'
                : 'We need this to connect you to your college and placement drives.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl flex items-start gap-3 bg-red-50 text-red-600 text-sm border border-red-100">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Full Name</label>
                  <div className="relative">
                    <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      {...registerField('fullName', { required: 'Full name is required' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. Rohit Sharma"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      {...registerField('email', { required: 'Email is required' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="you@college.edu"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      {...registerField('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Minimum 8 characters' }
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Target Role</label>
                  <div className="relative">
                    <Target size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      {...registerField('targetRole', { required: 'Target role is required' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 appearance-none"
                    >
                      <option value="">Select your target role</option>
                      {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {errors.targetRole && <p className="mt-1.5 text-xs text-red-500">{errors.targetRole.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // Simple validation before moving to step 2
                    const fullName = document.querySelector('[name="fullName"]')?.value
                    const email = document.querySelector('[name="email"]')?.value
                    const password = document.querySelector('[name="password"]')?.value
                    const targetRole = document.querySelector('[name="targetRole"]')?.value
                    if (fullName && email && password && password.length >= 8 && targetRole) {
                      setError('')
                      setStep(2)
                    } else {
                      setError('Please complete all fields before continuing.')
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">College</label>
                  <div className="relative">
                    <Building2 size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      {...registerField('collegeId', { required: 'Please select your college' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 appearance-none"
                    >
                      <option value="">Select your college</option>
                      {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  {errors.collegeId && <p className="mt-1.5 text-xs text-red-500">{errors.collegeId.message}</p>}
                  {colleges.length === 0 && (
                    <p className="mt-1.5 text-xs text-amber-500">No colleges loaded. Ensure backend is running.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Department / Branch</label>
                  <div className="relative">
                    <BookOpen size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      {...registerField('departmentId', { required: 'Please select your department' })}
                      disabled={!selectedCollegeId}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 appearance-none disabled:opacity-50"
                    >
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  {errors.departmentId && <p className="mt-1.5 text-xs text-red-500">{errors.departmentId.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">Year</label>
                    <div className="relative">
                      <GraduationCap size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        {...registerField('year', { required: 'Year is required' })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 appearance-none"
                      >
                        <option value="">Year</option>
                        {YEAR_OPTIONS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                      </select>
                    </div>
                    {errors.year && <p className="mt-1.5 text-xs text-red-500">{errors.year.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      {...registerField('cgpa')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Roll Number</label>
                  <div className="relative">
                    <Hash size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      {...registerField('rollNo', { required: 'Roll number is required' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. CS21B024"
                    />
                  </div>
                  {errors.rollNo && <p className="mt-1.5 text-xs text-red-500">{errors.rollNo.message}</p>}
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/student/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Login here
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-slate-400">
            By registering, you agree to InterviewIQ Pro's terms and policies.
          </p>
        </div>
      </div>
    </div>
  )
}
