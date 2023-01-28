'use strict'

const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const JWT_SECRET = process.env.JWT_SECRET

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
  } catch (e) {
    // @todo: improve logging and an error message
    console.log('[verifyGoogleToken]', e)

    throw new Error('Invalid user detected. Please try again.')
  }
}

/**
 * @param {string} email A user's email.
 * @returns A JWT token.
 */
function getJwtToken(email) {
  return jwt.sign({ email }, JWT_SECRET, {
    expiresIn: '1d'
  })
}

/**
 * @param {string} jwtToken Our generated jwt token.
 * @returns A decoded data. Throws an exception if a jwt token is invalid.
 */
function verifyJwtToken(jwtToken) {
  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET)
    return decoded
  } catch (e) {
    // @todo: improve logging and an error message
    console.log('[verifyJwtToken]', e)

    throw new Error('Invalid JWT access token.')
  }
}

module.exports = {
  verifyGoogleToken,
  getJwtToken,
  verifyJwtToken
}
