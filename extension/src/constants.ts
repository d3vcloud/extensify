const __prod__ = process.env.NODE_ENV === 'production'

export const API_BASE_URL = __prod__ ? 'https://api.vsextensify.com' : 'http://localhost:3001'
