const __prod__ = process.env.NODE_ENV === 'production'

export const API_BASE_URL = __prod__ ? 'PUT_URL_API' : 'http://localhost:3001'
export const GITHUB_CLIENT_ID = ''
export const GITHUB_CLIENT_SECRET = ''
