import { Octokit } from '@octokit/rest'
import { GistData } from '../types/Gist'
import { Extension } from '../types/Extension'
import { saveGist } from './gist.service'
import { getExtensionList } from '../utils'
import { Commons } from '../commons'

export const newGist = async (data: GistData): Promise<string | undefined> => {
  const { isGistPublic, descriptionGist, authToken, myOwnExtensions, isUpdate } = data
  const GIST_JSON_EMPTY: any = {
    files: {
      'extensions.json': {
        content: ''
      }
    }
  }

  const extensionContent = JSON.stringify(myOwnExtensions, undefined, 2)
  try {
    const octokit = new Octokit({
      auth: authToken
    })

    GIST_JSON_EMPTY.isGistPublic = isGistPublic
    GIST_JSON_EMPTY.description = descriptionGist
    GIST_JSON_EMPTY.files['extensions.json'].content = extensionContent

    // Save data on GitHub
    const res = await octokit.request('POST /gists', GIST_JSON_EMPTY)
    if (res.status !== 201) {
      Commons.showLogErrorMessage(null, 'An error has ocurred while saving the gist', true)
      return
    }

    const { id: gistId, owner, files } = res.data
    const { id: userGithubId } = owner!
    const { raw_url } = files!['extensions.json']!
    const versionOfGist = raw_url?.split('/').at(6)

    // Save data on Database
    const data = {
      userId: userGithubId,
      identify: gistId,
      version: versionOfGist,
      isUpdate
    }

    const resApi = await saveGist(data)

    if (!resApi) throw new Error('An error ocurred with API')

    if (!resApi.ok) {
      Commons.showLogErrorMessage(null, resApi.msg, true)
      return
    }

    return gistId
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with GitHub.', true)
  }
}

export const getGist = async (gist_id: string, token: string) => {
  try {
    const octokit = new Octokit({
      auth: token
    })

    const res = await octokit.request(`GET /gists/${gist_id}`)
    if (res.status !== 200) {
      Commons.showLogErrorMessage(null, 'An error has ocurred while getting the gist', true)
      return
    }
    // Getting local extensions and user's remote extensions and identify what have already been installed
    const userRemoteExtensions = JSON.parse(res.data.files['extensions.json'].content)
    const myLocalExtensions = getExtensionList()
    const extensions = userRemoteExtensions.map((re: any) => {
      const ex = myLocalExtensions.find(
        (le: Extension) => re.id === le.id && re.version === le.version
      )
      const isInstalled = Boolean(ex)
      return { ...re, isInstalled }
    })

    return { data: extensions }
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with GitHub.', true)
    return null
  }
}

export const updateGist = async (
  idGist: string,
  contentGist: any,
  token: string
): Promise<boolean | null> => {
  try {
    const octokit = new Octokit({
      auth: token
    })

    const extensionContent = JSON.stringify(contentGist, undefined, 2)

    await octokit.request(`PATCH /gists/${idGist}`, {
      gist_id: idGist,
      files: {
        'extensions.json': {
          content: extensionContent
        }
      }
    })
    Commons.showSuccessMessage('Your extensions were upload correctly.')
    return true
  } catch (error: any) {
    const { status } = error
    if (status === 404) return null

    Commons.showLogErrorMessage(error, 'An error has ocurred with GitHub.', true)
    return false
  }
}
