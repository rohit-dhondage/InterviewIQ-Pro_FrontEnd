import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, Mail, Lock, AlertCircle, Building, Users, Search, ClipboardCheck } from 'lucide-react'

export default function CompanyLogin() {
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
      // Assuming a RECRUITER role exists, otherwise fallback/mock logic will need to be implemented later.
      if (user.role === 'RECRUITER' || user.role === 'COMPANY') {
        navigate('/company/dashboard')
      } else {
        setError('Unauthorized access. This portal is for Company Recruiters only.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-white font-sans">
      
      {/* Left Content */}
      <div className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight mb-20">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <Brain size={18} />
            </div>
            InterviewIQ <span className="text-indigo-400">Pro</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-3">Company Portal</h1>
            <p className="text-lg text-slate-400 mb-12">Recruit top talent with precision.</p>

            <div className="space-y-6">
              {[
                { icon: Building, text: 'Manage Placement Drives' },
                { icon: Search, text: 'Discover Eligible Candidates' },
                { icon: Users, text: 'Shortlist & Track Interviews' },
                { icon: ClipboardCheck, text: 'Streamlined Hiring Workflow' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 text-indigo-400 flex items-center justify-center shrink-0">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Login to Company Portal</h2>
              <p className="text-slate-500 text-sm">Access your recruitment dashboard to manage drives and candidates.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 text-red-600 text-sm border border-red-100">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="name@company.com"
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Want to hire from our partner colleges? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">Contact Sales</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
