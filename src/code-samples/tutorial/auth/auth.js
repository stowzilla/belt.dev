import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand
} from '@aws-sdk/client-cognito-identity-provider'

const REGION = import.meta.env.VITE_AWS_REGION
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID

const client = new CognitoIdentityProviderClient({ region: REGION })

let idToken = null

export function getToken() {
  return idToken
}

export function isAuthenticated() {
  return idToken !== null
}

export async function signIn(username, password) {
  const response = await client.send(new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: { USERNAME: username, PASSWORD: password }
  }))

  // First login requires password change
  if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    return { challenge: 'NEW_PASSWORD_REQUIRED', session: response.Session }
  }

  idToken = response.AuthenticationResult.IdToken
  localStorage.setItem('idToken', idToken)
  return { success: true }
}

export async function completeNewPassword(username, newPassword, session) {
  const response = await client.send(new RespondToAuthChallengeCommand({
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: CLIENT_ID,
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: newPassword
    }
  }))

  idToken = response.AuthenticationResult.IdToken
  localStorage.setItem('idToken', idToken)
  return { success: true }
}

export function signOut() {
  idToken = null
  localStorage.removeItem('idToken')
}

// Restore token from localStorage on page load
const stored = localStorage.getItem('idToken')
if (stored) idToken = stored
