import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      // { fullName, email, role, token }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('iq_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('iq_user') }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const userData = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      token: data.accessToken,
    }
    localStorage.setItem('iq_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    const userData = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      token: data.accessToken,
    }
    localStorage.setItem('iq_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('iq_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
