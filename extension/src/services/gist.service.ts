import fetch from 'node-fetch'
import { API_BASE_URL } from '../constants'
import { ApiResponse } from '../types/ApiResponse'
import { Commons } from '../commons'

export const saveGist = async (gist: any): Promise<ApiResponse | undefined> => {
  try {
    const body = {
      method: 'POST',
      body: JSON.stringify(gist),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`${API_BASE_URL}/gist`, body)
    const data = await response.json() as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint.', true)
  }
}

export const getGistByUser = async (gitHubId: string): Promise<ApiResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/gist/${gitHubId}`)
    const data = await response.json() as Promise<ApiResponse>
    return data
  } catch (error) {
    Commons.showLogErrorMessage(error, 'An error has ocurred with the API Endpoint.', true)
  }
}
