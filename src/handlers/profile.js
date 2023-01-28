'use strict'

const profileHandler = async (req, res) => {
  try {
    return res.status(200).json({
      data: 'profile data'
    })
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error
    })
  }
}

module.exports = {
  profileHandler
}
