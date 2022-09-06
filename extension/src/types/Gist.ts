export interface GistData {
  isGistPublic: boolean
  descriptionGist: string
  authToken: string
  myOwnExtensions: any
  isUpdate?: boolean
}

export interface GistResponse {
  id: string
  identify: string
  version: string
}