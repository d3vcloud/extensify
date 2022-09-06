import * as vscode from 'vscode'
import { authenticate } from '../services/auth.service'
import { filterUsers } from '../services/user.service'
import { AuthManager } from '../auth/AuthManager'
import { getNonce } from '../getNonce'
import { Commons } from '../commons'
import { ViewExtension } from '../view-extension'
import { UserExtensionsDetailPanel } from './UserExtensionsDetailPanel'

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView
  _doc?: vscode.TextDocument

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri]
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case 'show-details': {
          if (!data.value) {
            return
          }
          UserExtensionsDetailPanel.createOrShow(this._extensionUri, data.value)
          break
        }
        case 'filter': {
          if (!data.value) {
            return
          }

          try {
            const resApi = await filterUsers(data.value)

            if (!resApi) throw new Error('An error ocurred with API')

            if (!resApi.ok) {
              throw new Error(resApi.msg)
            }

            const { data: queryResults } = resApi
            webviewView.webview.postMessage({ type: 'list-results', value: queryResults })
          } catch (error) {
            Commons.showLogErrorMessage(null, 'An error ocurred with API', true)
            console.log(error)
          }
          break
        }
        case 'onError': {
          if (!data.value) {
            return
          }
          vscode.window.showErrorMessage(data.value)
          break
        }
        case 'get-token': {
          webviewView.webview.postMessage({
            type: 'token',
            value: AuthManager.getState().user?.token
          })
          break
        }
        case 'authenticated': {
          authenticate(() => {
            webviewView.webview.postMessage({
              type: 'token',
              value: AuthManager.getState().user?.token
            })
          })
          break
        }
        case 'logout': {
          AuthManager.initState()
          webviewView.webview.postMessage({ type: 'token', value: undefined })
          break
        }
      }
    })
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Uri to load secure styles into webview

    // And the uri we use to load this script in the webview
    const scriptUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media',
      'sidebar.js'
    )
    // Local path to css styles
    const styleResetUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media',
      'reset.css'
    )
    const styleMainUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media',
      'vscode.css'
    )
    // Style from sidebar.css
    const styleSidebarUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media',
      'sidebar.css'
    )

    // Debounce function
    const debounceScript = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media',
      'debounce.js'
    )

    // Intersection observer
    const intersectionObserverScript = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media',
      'intersection-observer.js'
    )
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce()
    const uris = [
      styleResetUri,
      styleMainUri,
      styleSidebarUri,
      scriptUri,
      debounceScript,
      intersectionObserverScript
    ]
    return ViewExtension.getWebviewSidebar(webview, nonce, uris)
  }
}