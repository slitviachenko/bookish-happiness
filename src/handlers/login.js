'use strict'

const { verifyGoogleToken, getJwtToken } = require('../helper')

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS.split(',')

const loginHandler = async (req, res) => {
  if (!req.body.credential) {
    return res.status(400).json({
      message: 'Incorrect payload.'
    })
  }

  try {
    const verificationResponse = await verifyGoogleToken(req.body.credential)
    if (verificationResponse.error) {
      return res.status(400).json({
        message: verificationResponse.error
      })
    }

    const profile = verificationResponse.payload

    const isEmailAllowed = ALLOWED_EMAILS.find((email) => email === profile.email)

    if (!isEmailAllowed) {
      return res.status(401).json({
        message: 'Your email is not allowed to login. Please contact support.'
      })
    }

    return res.status(200).json({
      message: 'Login was successful.',
      data: {
        firstName: profile.given_name,
        lastName: profile.family_name,
        picture: profile.picture,
        email: profile.email,
        token: getJwtToken(profile.email)
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error
    })
  }
}

module.exports = {
  loginHandler
}
