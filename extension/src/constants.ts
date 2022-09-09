const __prod__ = process.env.NODE_ENV === 'production'

export const API_BASE_URL = __prod__ ? 'extensify-server.up.railway.app' : 'http://localhost:3001'

export const GITHUB_CLIENT_ID = '66faaeafddf08f6bc17f'
export const GITHUB_CLIENT_SECRET = '468a43a5991719ef4e7279c306232f8bcbbe83b8'
