import * as vscode from 'vscode'
import { App, Request } from '@tinyhttp/app'
// import { App } from '@tinyhttp/app'
import fetch from 'node-fetch'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../constants'
import { UserState } from '../types/State'
import { saveUser } from './user.service'
import { AuthManager } from '../auth/AuthManager'
import { Commons } from '../commons'
import { GitUser } from '../types/GitUser'

export const authenticate = (fn: () => void) => {
  const app = new App()

  app.get('/callback', async (req: Request, res) => {
    try {
      const code = req.query.code as string
      const token = await getToken(code)
      const params = new URLSearchParams(token)
      const authToken = params.get('access_token') as string

      if (authToken) {
        // GET information of logged user
        const userInfo = await getUser(authToken)

        if (!userInfo) {
          throw new Error('The server was not able to get user data')
        }
        // POST information of user to database
        const resApi = await saveUser(userInfo)

        if (!resApi) throw new Error('An error ocurred with API')

        if (!resApi.ok) {
          Commons.showLogErrorMessage(null, resApi.msg, true)
          return
        }
        // Setting global state
        const userState: UserState = {
          token: authToken,
          gitHubId: userInfo.gitHubId
        }
        AuthManager.setUser(userState)
        fn()
        res.send(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta
                http-equiv="Content-Security-Policy"
                content="default-src vscode-resource:; form-action vscode-resource:; frame-ancestors vscode-resource:; img-src vscode-resource: https:; script-src 'self' 'unsafe-inline' vscode-resource:; style-src 'self' 'unsafe-inline' vscode-resource:;"
              />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title>Authentication</title>
            </head>
            <body>
                <h1>Success! You may now close this tab.</h1>
                <style>
                  html, body {
                    background-color: #1a1a1a;
                    color: #c3c3c3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    margin: 0;
                  }
                </style>
            </body>
          </html>`)
        return
      }

      // If the user revoke the permissions, It'll show an warning message
      res.send(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta
                http-equiv="Content-Security-Policy"
                content="default-src vscode-resource:; form-action vscode-resource:; frame-ancestors vscode-resource:; img-src vscode-resource: https:; script-src 'self' 'unsafe-inline' vscode-resource:; style-src 'self' 'unsafe-inline' vscode-resource:;"
              />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title>Authentication Failed</title>
            </head>
            <body>
                <h1>There were issues with the authorization. Try again.</h1>
                <style>
                  html, body {
                    background-color: #1a1a1a;
                    color: #c3c3c3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    margin: 0;
                  }
                </style>
            </body>
        </html>`)
    } catch (error) {
      Commons.showLogErrorMessage(error, 'An error has ocurred during authentication', true)
    }
  })

  app.listen(54321, async () => {
    const URI_AUTH = `https://github.com/login/oauth/authorize?scope=gist%20read:email&client_id=${GITHUB_CLIENT_ID}&redirect_uri=http://localhost:54321/callback`
    const uriToOpen = vscode.Uri.parse(URI_AUTH)
    await vscode.env.openExternal(uriToOpen)
  })
}

const getToken = async (code: string) => {
  const params = new URLSearchParams()
  params.append('client_id', GITHUB_CLIENT_ID)
  params.append('client_secret', GITHUB_CLIENT_SECRET)
  params.append('code', code)

  try {
    const response = await fetch(`https://github.com/login/oauth/access_token`, {
      method: 'POST',
      body: params
    })

    return response.text()
  } catch (error) {
    Commons.showLogErrorMessage(error, 'Your token is invalid', true)
  }
}

const getUser = async (token: string): Promise<GitUser | undefined> => {
  try {
    const response = await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`
      }
    })
    const user: any = await response.json()

    const { id: gitHubId, avatar_url: photoUrl, name, login: username } = user
    const userData: GitUser = {
      gitHubId: String(gitHubId),
      name,
      username,
      photoUrl
    }

    return userData
  } catch (error) {
    Commons.showLogErrorMessage(error, 'User not found', true)
  }
}
