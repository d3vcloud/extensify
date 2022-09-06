import * as vscode from 'vscode'
import { AuthState, UserState } from '../types/State'

export class AuthManager {
  static globalState: vscode.Memento

  static initState() {
    const initialState: AuthState = {
      user: null,
      gistId: ''
    }
    this.globalState.update('state', initialState)
  }

  static setGistId(gistId: string) {
    const user = this.getState().user
    const state: AuthState = {
      user,
      gistId
    }
    this.globalState.update('state', state)
  }

  static setUser(user: UserState) {
    const state = {
      user,
      gistId: ''
    }
    this.globalState.update('state', state)
  }

  static getState() {
    return this.globalState.get('state') as AuthState
  }
}
