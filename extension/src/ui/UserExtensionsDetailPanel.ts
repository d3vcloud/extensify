import * as vscode from 'vscode'
import { getNonce } from '../getNonce'
import { installExtension } from '../utils'
import { getGist } from '../services/github.service'
import { AuthManager } from '../auth/AuthManager'
import { ViewExtension } from '../view-extension'

export class UserExtensionsDetailPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: UserExtensionsDetailPanel | undefined

  public static readonly viewType = 'userExtensions'

  private readonly _panel: vscode.WebviewPanel
  private readonly _extensionUri: vscode.Uri
  private _disposables: vscode.Disposable[] = []
  private static gistId: string = ''

  public static createOrShow(extensionUri: vscode.Uri, value: string) {
    this.gistId = value
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    // If we already have a panel, show it.
    if (UserExtensionsDetailPanel.currentPanel) {
      UserExtensionsDetailPanel.currentPanel._panel.reveal(column)
      UserExtensionsDetailPanel.currentPanel._update()
      return
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      UserExtensionsDetailPanel.viewType,
      'extensify',
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'media'),
          vscode.Uri.joinPath(extensionUri, 'out/compiled')
        ]
      }
    )

    UserExtensionsDetailPanel.currentPanel = new UserExtensionsDetailPanel(panel, extensionUri)
  }

  public static kill() {
    UserExtensionsDetailPanel.currentPanel?.dispose()
    UserExtensionsDetailPanel.currentPanel = undefined
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    UserExtensionsDetailPanel.currentPanel = new UserExtensionsDetailPanel(panel, extensionUri)
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel
    this._extensionUri = extensionUri

    // Set the webview's initial html content
    this._update()

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)
  }

  public dispose() {
    UserExtensionsDetailPanel.currentPanel = undefined

    // Clean up our resources
    this._panel.dispose()

    while (this._disposables.length) {
      const x = this._disposables.pop()
      if (x) {
        x.dispose()
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview
    /* Listing all extensions saved by gistId */
    const response = await getGist(
      UserExtensionsDetailPanel.gistId,
      AuthManager.getState().user!.token
    )
    if (response) {
      const { data } = response
      webview.postMessage({ type: 'list-extensions', value: data })
    }

    this._panel.webview.html = this._getHtmlForWebview(webview)
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'onInfo': {
          if (!data.value) {
            return
          }
          vscode.window.showInformationMessage(data.value)
          break
        }
        case 'onError': {
          if (!data.value) {
            return
          }
          vscode.window.showErrorMessage(data.value)
          break
        }
        case 'install-extension': {
          if (!data.value) {
            return
          }
          const result = await installExtension(data.value)
          webview.postMessage({ type: 'install-extension', value: result })
          break
        }
      }
    })
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Uri to load secure styles into webview

    // And the uri we use to load this script in the webview
    const scriptUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media/js',
      'extension-details.js'
    )
    // Local path to css styles
    const styleResetUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media/css',
      'reset.css'
    )
    const styleMainUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media/css',
      'vscode.css'
    )
    // Style from panel.css
    const stylePanelUri = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media/css',
      'panel.css'
    )

    // Debounce function
    const debounceScript = ViewExtension.getWebviewResourceUri(
      webview,
      this._extensionUri,
      'media/js',
      'debounce.js'
    )

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce()
    const uris = [styleResetUri, styleMainUri, stylePanelUri, scriptUri, debounceScript]
    return ViewExtension.getWebviewPanel(webview, nonce, uris)
  }
}
