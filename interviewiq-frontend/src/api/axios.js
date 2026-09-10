import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('iq_user')
  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) config.headers.Authorization = `Bearer ${token}`
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
