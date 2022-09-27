import * as vscode from 'vscode'

export class ViewExtension {
  public static getWebviewSidebar(
    webview: vscode.Webview,
    nonce: string,
    urisExtension: vscode.Uri[]
  ) {
    const [
      styleResetUri,
      styleMainUri,
      styleSidebarUri,
      scriptUri,
      debounceScript,
      intersectionObserverScript
    ] = urisExtension
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<link href="${styleSidebarUri}" rel="stylesheet">
			</head>
      <body>
        <div class="container">
          <div class="hidden panel-auth" id="panelSignIn">
            <button class="btn btn-auth">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
              Sign In with GitHub
            </button>
          </div>
          <div class="hidden panel-auth" id="panelLogged">
            <button class="btn btn-logout">
              Logout
            </button>
            <input type="search" class="input-search" placeholder="Search a user...">
            <div id='containerSearchUsers' class='hidden'>
              <div class="list-users-wrapper"></div>
              <div class="loading-users"></div>
              <div id='interceptor'></div>
            </div>
            <div id='containerFollowers' class='hidden'>
              <div class="list-followers-wrapper"></div>
            </div>
          </div>
        </div>
        <script src="${debounceScript}" nonce="${nonce}"></script>
        <script src="${scriptUri}" nonce="${nonce}"></script>
        <script src="${intersectionObserverScript}" nonce="${nonce}"></script>
		</body>
		</html>`
  }

  public static getWebviewPanel(
    webview: vscode.Webview,
    nonce: string,
    urisExtension: vscode.Uri[]
  ) {
    const [styleResetUri, styleMainUri, stylePanelUri, scriptUri, debounceScript] = urisExtension
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href=${styleResetUri} rel="stylesheet">
				<link href=${styleMainUri} rel="stylesheet">
				<link href=${stylePanelUri} rel="stylesheet">
        <link href="" rel="stylesheet">
			</head>
      <body>
        <div class="container-extensions">
          <div class="extension-details-header">
            <input 
              class="input empty" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false" 
              type="text" 
              aria-label="Type to search in extensions" 
              placeholder="Type to search in extensions">
          </div>
          <div class="extensions-details-body">
            <table class='table-extensions'>
              <thead>
                <tr>
                  <th style="width: 45%">Name</th>
                  <th style="width: 30%">Author</th>
                  <th style="width: 15%">Version</th>
                  <th style="width: 10%">Status</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>  
          </div>
        </div>
        <script nonce="${nonce}" src=${debounceScript}></script>
        <script nonce="${nonce}" src=${scriptUri}></script>
			</body>
			</html>`
  }

  public static getWebviewResourceUri(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    path: string,
    fileName: string
  ) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, path, fileName))
  }
}
