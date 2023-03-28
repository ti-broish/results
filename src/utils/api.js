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
    if (
      error?.response?.data?.message &&
      Array.isArray(error.response.data.message)
    ) {
      error.response.data.message = error.response.data.message.join(' ')
    }
    return Promise.reject(error)
  }
)

export default api
