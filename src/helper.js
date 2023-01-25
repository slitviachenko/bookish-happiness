'use strict'

const { OAuth2Client } = require('google-auth-library')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

/**
 * @param {string} token A Google OIDC token
 */
async function verifyGoogleToken(token) {
  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID)

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    })

    return {
      payload: ticket.getPayload()
    }
  } catch (error) {
    return {
      error: 'Invalid user detected. Please try again.'
    }
  }
}

module.exports = {
  verifyGoogleToken
}
