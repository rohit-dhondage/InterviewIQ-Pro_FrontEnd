import axios from 'axios'

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
// Normalize: remove trailing slashes and ensure /api/v1 endpoint path is present
const trimmedBaseURL = rawBaseURL.trim().replace(/\/+$/, '')
const baseURL = trimmedBaseURL.endsWith('/api/v1') ? trimmedBaseURL : `${trimmedBaseURL}/api/v1`

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('iq_user')
  if (stored) {
    try {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      localStorage.removeItem('iq_user')
    }
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('iq_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
