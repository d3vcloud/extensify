import { UserState } from '../types/State'
import { GitUser } from '../types/GitUser'
import { Credentials } from '../credentials'
import { Commons } from '../commons'
import { AuthManager } from '../auth/AuthManager'
import { saveUser } from './user.service'

export const authenticate = async (credentials: Credentials) => {
  try {
    const octokit = await credentials.getOctokit()
    if (octokit) {
      const auth = await octokit.users.getAuthenticated()
      const token = credentials.getAccessToken()
      const userInfo = auth.data

      const { id: gitHubId, avatar_url: photoUrl, name, login: username } = userInfo

      const userData: GitUser = {
        gitHubId: String(gitHubId),
        name: name ?? 'unknown',
        username,
        photoUrl
      }
      // Setting global state
      const userState: UserState = {
        token: token ?? '',
        gitHubId: userData.gitHubId
      }

      AuthManager.setUser(userState)

      return userData
    }
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred during authentication', true)
  }
}

export const addUser = async (userData: GitUser) => {
  // POST information of user to database
  const resApi = await saveUser(userData)
  if (!resApi) throw new Error('An error ocurred with API')
  if (!resApi.ok) {
    Commons.showLogErrorMessage(null, resApi.msg, true)
  }
}

export const logout = async (credentials: Credentials) => {
  AuthManager.initState()
  credentials.logout()
}
