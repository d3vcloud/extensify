import { newGist, updateGist } from './github.service'
import { getGistByUser } from './gist.service'
import { GistData } from '../types/Gist'
import { getExtensionList } from '../utils'
import { Commons } from '../commons'
import { AuthManager } from '../auth/AuthManager'

const saveGist = async (data: GistData) => {
  const newGistRes = await newGist(data)
  if (newGistRes) {
    // Set state to indicate we have a gist
    AuthManager.setGistId(newGistRes)
    Commons.showSuccessMessage('Your extensions were upload correctly.')
  }
}

const updateOrCreateGistIfNoExists = async (gistId: string, extensions: any, token: string, data: GistData) => {
  const res = await updateGist(gistId, extensions, token)
  // If res is null, It could be either there were troubles updating or there is not a gist
  // If we don't have a gist in GitHub for x reasons(User might have deleted), we need to create
  // a new gist and update on database
  if (res === null) {
    data.isUpdate = true
    await saveGist(data)
  }
}

export const syncExtensions = async () => {
  const { gistId, user } = AuthManager.getState()
  const { token, gitHubId } = user!

  if (!user) {
    Commons.showErrorMessage('You must authenticate first.')
    return
  }

  // Start to sync extensions
  const extensions = getExtensionList((msg: string) => {
    Commons.printMessage(msg)
  })

  const data: GistData = {
    isGistPublic: false,
    descriptionGist: 'Gist generated using extensify.io',
    authToken: token,
    myOwnExtensions: extensions
  }

  // If we don't have a gistId, it means it is our first time syncing our extensions
  if (!gistId) {
    // First, we need to check if user has a gist, if so, then sync
    const resp = await getGistByUser(gitHubId)
    
    if (resp?.data) {
      const { identify } = resp.data
      AuthManager.setGistId(identify)
      await updateOrCreateGistIfNoExists(identify, extensions, token, data)
      return
    }

    // In this context, It will create a new gist
    data.isUpdate = false

    const res = await newGist(data)
    if (res) {
      // Set state to indicate we have a gist
      AuthManager.setGistId(res)
      Commons.showSuccessMessage('Your extensions were upload correctly.')
    }
  } else {
    // If we have a gistId then update its content.
    const gistId = AuthManager.getState().gistId
    await updateOrCreateGistIfNoExists(gistId, extensions, token, data)
  }
}
