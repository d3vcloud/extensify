import * as vscode from 'vscode'
import { authenticate } from './services/auth.service'
import { syncExtensions } from './services/extension.service'
import { AuthManager } from './auth/AuthManager'
import { Commons } from './commons'
import { SidebarProvider } from './ui/SidebarProvider'

export async function activate(context: vscode.ExtensionContext) {
  AuthManager.globalState = context.globalState

  const sidebarProvider = new SidebarProvider(context.extensionUri)
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
    vscode.commands.registerCommand('extensify.authenticate', () => {
      authenticate(() => {
        sidebarProvider._view?.webview.postMessage({
          type: 'token',
          value: AuthManager.getState().user?.token
        })
      })
    })
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
