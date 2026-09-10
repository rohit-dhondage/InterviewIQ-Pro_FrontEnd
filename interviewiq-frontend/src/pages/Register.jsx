import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Brain, User, Mail, Lock, Building, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  
  const [colleges, setColleges] = useState([])
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectedCollegeId = watch('collegeId')

  // Fetch colleges on mount
  useEffect(() => {
    // In a real app, this would be a public endpoint. 
    // Mocking for now since we don't have a public colleges endpoint in the plan.
    setColleges([
      { id: 1, name: 'VJTI Mumbai' },
      { id: 2, name: 'COEP Pune' }
    ])
  }, [])

  // Fetch departments when college changes
  useEffect(() => {
    if (selectedCollegeId) {
      setDepartments([
        { id: 1, name: 'Computer Engineering' },
        { id: 2, name: 'Information Technology' },
        { id: 3, name: 'Electronics & Telecommunication' }
      ])
    } else {
      setDepartments([])
    }
  }, [selectedCollegeId])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const user = await registerUser({
        ...data,
        collegeId: parseInt(data.collegeId),
        departmentId: parseInt(data.departmentId),
        year: data.year ? parseInt(data.year) : null
      })
      navigate('/student')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12" style={{ background: 'var(--bg)' }}>
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Main Container */}
      <div className="w-full max-w-lg z-10 relative">
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
            <h1 className="text-2xl font-bold mb-2">Create Student Account 🎓</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Join your college's placement preparation platform</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3 badge-red text-sm">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="input-field pl-11"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="input-field pl-11"
                  placeholder="name@college.edu"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' }
                  })}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">College</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Building size={18} />
                  </div>
                  <select
                    {...register('collegeId', { required: 'College is required' })}
                    className="input-field pl-11 appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238888a8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="" disabled>Select College</option>
                    {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {errors.collegeId && <p className="mt-1.5 text-xs text-red-400">{errors.collegeId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <GraduationCap size={18} />
                  </div>
                  <select
                    {...register('departmentId', { required: 'Department is required' })}
                    disabled={!selectedCollegeId}
                    className="input-field pl-11 appearance-none disabled:opacity-50"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238888a8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="" disabled>Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                {errors.departmentId && <p className="mt-1.5 text-xs text-red-400">{errors.departmentId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Passing Year</label>
                <input
                  type="number"
                  {...register('year')}
                  className="input-field"
                  placeholder="2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Roll Number</label>
                <input
                  type="text"
                  {...register('rollNo')}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center mt-6 h-[46px]"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors hover:text-white" style={{ color: 'var(--primary-light)' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
