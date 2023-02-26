import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.DATA_URL.replace(/\/+$/, '')}/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => (res.data !== undefined ? res.data : res),
  (error) => console.error('API error: ', error)
)

export default api
