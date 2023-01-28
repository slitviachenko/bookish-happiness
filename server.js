'use strict'

require('dotenv/config')
const express = require('express')
const cors = require('cors')

const { loginHandler } = require('./src/handlers/login')
const { profileHandler } = require('./src/handlers/profile')
const { getAccessToken, requireAccessToken } = require('./src/handlers/helper')

const PORT_HTTP = 8080
const API_VERSION_V1 = 'v1.0.0'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: 'GET,POST'
  })
)

app.use(express.json())

app.get(`/${API_VERSION_V1}/health`, (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.post(`/${API_VERSION_V1}/login`, loginHandler)

app.get(`/${API_VERSION_V1}/profile`, getAccessToken, requireAccessToken, profileHandler)

app.listen(PORT_HTTP, () => console.log(`Server running on http://localhost:${PORT_HTTP}/`))
