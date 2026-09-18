import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, Mail, Lock, ArrowRight, AlertCircle, FileText, Target, Map } from 'lucide-react'

export default function StudentLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const user = await login(data.email, data.password)
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard')
      } else {
        setError('Unauthorized access. This portal is for students only.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-blue-50/50 text-slate-800 font-sans">
      
      {/* Left Content */}
      <div className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative">
        <div className="absolute top-8 left-12 flex items-center gap-2 text-xl font-bold tracking-tight text-blue-900">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Brain size={18} />
          </div>
          InterviewIQ <span className="text-blue-600">Pro</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-3 text-blue-950">Student Portal</h1>
          <p className="text-lg text-slate-600 mb-12">Practice. Improve. Get Placed.</p>

          <div className="space-y-6">
            {[
              { icon: Target, text: 'AI Interview Practice' },
              { icon: FileText, text: 'Resume Analysis' },
              { icon: Map, text: 'Learning Roadmap' },
              { icon: Brain, text: 'Placement Readiness Tracker' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <span className="font-semibold text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Login to Student Portal</h2>
              <p className="text-slate-500 text-sm">Access your personalized learning and placement journey.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 text-red-600 text-sm border border-red-100">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Email ID or Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your email or username"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              New here? <Link to="/student/register" className="font-semibold text-blue-600 hover:text-blue-700">Create your student account</Link>
            </div>
          </div>
          
          {/* Decorative background blobs for the right side */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        </div>
      </div>
    </div>
  )
}
