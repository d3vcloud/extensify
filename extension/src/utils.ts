import * as vscode from 'vscode'
import { Commons } from './commons'
import { Extension } from './types/Extension'

export const getExtensionList = (cb?: (message: string) => void): Extension[] | [] => {
  const myLocalExtensions = vscode.extensions.all.filter((ext) => !ext.packageJSON.isBuiltin)

  if (myLocalExtensions.length === 0) return []

  if (cb) {
    cb(`Extensions to upload...`)
    cb(`--------------------`)
  }
  const extensions: Extension[] = myLocalExtensions.map((ext) => {
    const { id, uuid, author, displayName, version, publisher, name } = ext.packageJSON
    const installationId = `${publisher}.${name}`

    let extAuthor = author
    if (!author) {
      extAuthor = publisher
    }

    if (author && typeof author === 'object') extAuthor = author.name ?? 'Anonymous'

    const extension: Extension = {
      id,
      uuid,
      author: extAuthor,
      displayName,
      version,
      installationId
    }

    if (cb) {
      cb(`  ${displayName} - version ${version}`)
    }
    return extension
  })

  // Show output channel as long as there is a callback
  if (cb) {
    cb(`--------------------`)
    cb(`Done.`)
    Commons.showChannel()
  }
  return extensions
}

// extension = ext.publisher + ext.name
export const installExtension = async (extension: string) => {
  try {
    await vscode.commands.executeCommand('workbench.extensions.installExtension', extension)
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred during installation.', true)
  }
}
