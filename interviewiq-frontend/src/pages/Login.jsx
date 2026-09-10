import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
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
      const redirect = user.role === 'STUDENT' ? '/student' : user.role === 'TPO' ? '/tpo' : '/admin'
      navigate(redirect)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight no-underline">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <Brain size={24} />
            </div>
            InterviewIQ <span style={{ color: 'var(--primary-light)' }}>Pro</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome Back 👋</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3 badge-red text-sm">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field pl-11"
                  placeholder="name@college.edu"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-xs font-medium hover:underline transition-all" style={{ color: 'var(--primary-light)' }}>Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center mt-6 h-[46px]"
            >
              {isLoading ? 'Signing in...' : 'Sign in to your account'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors hover:text-white" style={{ color: 'var(--primary-light)' }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
