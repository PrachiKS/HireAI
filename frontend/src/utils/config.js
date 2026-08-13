export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://hireai-api.onrender.com/api/v1'
  : 'http://localhost:5000/api/v1'

export const AUTH_URL = `${BASE_URL}/auth`
export const JOBS_URL = `${BASE_URL}/jobs`
export const APPLICATIONS_URL = `${BASE_URL}/applications`
export const AI_URL = `${BASE_URL}/ai`