import * as vscode from 'vscode'
import { View } from './types/Commons'

export class Commons {
  public static outputChannel: vscode.OutputChannel | null = null

  public static printMessage(msg: string) {
    if (Commons.outputChannel === null) {
      Commons.outputChannel = vscode.window.createOutputChannel('Extensify.io Sync')
    }
    const outputChannel = Commons.outputChannel
    outputChannel.appendLine(msg)
  }

  public static showChannel() {
    Commons.outputChannel?.show()
  }

  public static showLogErrorMessage(error: any, message: string, msgBox: boolean): void {
    if (error) {
      const { status } = error
      console.error(error)

      if (typeof status === 'number') {
        message = this.getErrorMessageByCode(status)
      } else if (error.message) {
        try {
          message = JSON.parse(error.message).message
          if (message.toLowerCase() === 'not found') {
            msgBox = true
            message = 'Resource not found'
          }
        } catch (error: any) {
          message = error.message
        }
      }
    }

    if (msgBox === true) {
      this.showErrorMessage(message)
      vscode.window.setStatusBarMessage('').dispose()
    }
  }

  private static getErrorMessageByCode(errorCode: number): string {
    const ERROR_MESSAGES: any = {
      '500': 'Please, check your internet connection and try again',
      '401': 'Invalid token or your token has expired',
      '404': 'Resource not found'
    }
    return ERROR_MESSAGES[errorCode]
  }

  public static showSuccessMessage(message: string) {
    vscode.window.showInformationMessage(message)
  }

  public static showErrorMessage(message: string) {
    vscode.window.showErrorMessage(message)
  }

  public static showProgress(
    location: vscode.ProgressLocation | View,
    cancellable: boolean,
    cb: () => Promise<any>,
    title?: string
  ) {
    vscode.window.withProgress(
      {
        location,
        title,
        cancellable
      },
      async () => {
        await cb()
      }
    )
  }

  public static doPromise() {
    const p = new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve('Hola')
        console.log('Holaaa')
      }, 5000)
    })
    // {
    //   viewId: 'extensify-sidebar'
    // }
    return p
  }
}
