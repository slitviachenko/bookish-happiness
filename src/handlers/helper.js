'use strict'

const { verifyJwtToken } = require('../helper')

function getAccessToken(req, res, next) {
  // check the "authorization" header first
  const auth = req.headers.authorization
  let inToken = null
  if (auth && auth.toLowerCase().indexOf('bearer') === 0) {
    inToken = auth.slice('bearer '.length)
  } else if (req.body && req.body.access_token) {
    // not in the header, check in the form body
    inToken = req.body.access_token
  } else if (req.query && req.query.access_token) {
    inToken = req.query.access_token
  }

  req.access_token = inToken
  try {
    req.access_token_data = inToken ? verifyJwtToken(inToken) : null
  } catch (error) {
    return res.status(401).json({
      message: error?.message || error
    })
  }
  next()
}

function requireAccessToken(req, res, next) {
  if (req.access_token) {
    next()
  } else {
    return res.status(401).json({
      message: 'Missing JWT access token.'
    })
  }
}

module.exports = {
  getAccessToken,
  requireAccessToken
}
