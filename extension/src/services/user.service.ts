import fetch from 'node-fetch'
import { Commons } from '../commons'
import { API_BASE_URL } from '../constants'
import { ApiQuery } from '../types/ApiQuery'
import { ApiResponse } from '../types/ApiResponse'
import { GitUser } from '../types/GitUser'

export const filterUsers = async (query: ApiQuery): Promise<ApiResponse | undefined> => {
  const { cursor, textToSearch } = query
  try {
    const response = await fetch(`${API_BASE_URL}/filter?q=${textToSearch}&cursor=${cursor}`)
    const data = (await response.json()) as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint', true)
  }
}

export const saveUser = async (user: GitUser): Promise<ApiResponse | undefined> => {
  try {
    const body = {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`${API_BASE_URL}/user`, body)
    const data = (await response.json()) as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint', true)
  }
}

export const followUser = async (
  gitHubId: string,
  followerId: string
): Promise<ApiResponse | undefined> => {
  try {
    const trax = {
      gitHubId,
      followerId
    }
    const body = {
      method: 'POST',
      body: JSON.stringify(trax),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`${API_BASE_URL}/follow`, body)
    const data = (await response.json()) as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint', true)
  }
}

export const unfollowUser = async (
  gitHubId: string,
  followerId: string
): Promise<ApiResponse | undefined> => {
  try {
    const trax = {
      gitHubId,
      followerId
    }
    const body = {
      method: 'POST',
      body: JSON.stringify(trax),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`${API_BASE_URL}/unfollow`, body)
    const data = (await response.json()) as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint', true)
  }
}

export const listFollowers = async (githubId: string): Promise<ApiResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/followers?q=${githubId}`)
    const data = (await response.json()) as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint', true)
  }
}
