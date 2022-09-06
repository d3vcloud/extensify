export class AuthTemplate {
  public static getTemplateSuccessAuth() {
    return `
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
      </html>`
  }

  public static getTemplateErrorAuth() {
    return `
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
    </html>`
  }
}
