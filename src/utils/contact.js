const STORAGE_KEY = 'violationContact'

export const getSavedContact = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch (e) {
    return {}
  }
}

export const saveContact = ({ name, email, phone }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, phone }))
  } catch (e) {}
}

const PHONE_LOCAL_RE = /^0[1-9][0-9]{8}$/
const PHONE_INTL_RE = /^0{0,2}359[1-9][0-9]{8}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const formatPhone = (phone) =>
  PHONE_LOCAL_RE.test(phone)
    ? phone.replace(/^0(.+)/, '+359$1')
    : PHONE_INTL_RE.test(phone)
    ? phone.replace(/^0{0,2}359(.+)/, '+359$1')
    : phone

export const isValidPhone = (phone) =>
  /^\+(?:[0-9] ?){6,14}[0-9]$/.test(phone) ||
  PHONE_LOCAL_RE.test(phone) ||
  PHONE_INTL_RE.test(phone)

export const isValidEmail = (email) => EMAIL_RE.test(email)
