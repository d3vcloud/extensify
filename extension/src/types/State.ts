export interface AuthState {
  user: UserState | null
  gistId: string
}

export interface UserState {
  token: string
  gitHubId: string
}
