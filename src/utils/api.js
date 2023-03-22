import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.DATA_URL.replace(/\/+$/, '')}/`,
  headers: {
    'Accept-Language': 'bg-BG',
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => (res.data !== undefined ? res.data : res),
  (error) => {
    console.error('API error: ', error)
    return Promise.reject(error)
  }
)

export default api
