import * as vscode from 'vscode'
import { AuthManager } from './auth/AuthManager'
import { Commons } from './commons'
import { Credentials } from './credentials'
import { SidebarProvider } from './ui/SidebarProvider'
import { syncExtensions } from './services/extension.service'
import { authenticate } from './services/auth.service'

export async function activate(context: vscode.ExtensionContext) {
  // Getting credentials
  const credentials = new Credentials()
  await credentials.initialize(context)

  AuthManager.globalState = context.globalState

  const sidebarProvider = new SidebarProvider(context.extensionUri, credentials)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('extensify-sidebar', sidebarProvider)
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extensify.sync', async () => {
      const { user } = AuthManager.getState()
      if (!user) {
        Commons.showErrorMessage('You need to authenticate.')
        return
      }

      await syncExtensions()
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extensify.authenticate', async () => {
      await authenticate(credentials)
    })
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
