import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Brain, Mail, Lock, AlertCircle, Building2, Users, PieChart, Landmark } from 'lucide-react'

export default function AdminLogin() {
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
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        setError('Unauthorized access. This portal is for College Administrators only.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#064E3B] text-white font-sans">
      
      {/* Left Content */}
      <div className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight mb-20">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Brain size={18} />
            </div>
            InterviewIQ <span className="text-emerald-400">Pro</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-3">College Admin Portal</h1>
            <p className="text-lg text-emerald-100/70 mb-12">Insights. Decisions. Better Placements.</p>

            <div className="space-y-6">
              {[
                { icon: Landmark, text: 'College Dashboard' },
                { icon: Users, text: 'Department & Batch Analytics' },
                { icon: PieChart, text: 'Placement Statistics' },
                { icon: Building2, text: 'Multi-College Management' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-emerald-50">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#022C22] relative">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Login to College Admin Portal</h2>
              <p className="text-slate-500 text-sm">Access college-wide analytics, student performance and placement insights.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 text-red-600 text-sm border border-red-100">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Email ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your email"
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              New here? <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">Contact your super admin</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
