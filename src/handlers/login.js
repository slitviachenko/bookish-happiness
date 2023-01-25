'use strict'

const jwt = require('jsonwebtoken')
const { verifyGoogleToken } = require('../helper')

const JWT_SECRET = process.env.JWT_SECRET
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

    res.status(200).json({
      message: 'Login was successful.',
      user: {
        firstName: profile.given_name,
        lastName: profile.family_name,
        picture: profile.picture,
        email: profile.email,
        token: jwt.sign({ email: profile.email }, JWT_SECRET, {
          expiresIn: '1d'
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error?.message || error
    })
  }
}

module.exports = {
  loginHandler
}
