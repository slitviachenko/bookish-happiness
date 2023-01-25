'use strict'

require('dotenv/config')
const express = require('express')
const cors = require('cors')

const { loginHandler } = require('./src/handlers/login')

const PORT_HTTP = 8080

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:3000'
    ],
    methods: 'GET,POST'
  })
)

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' })
})

app.post('/v1.0.0/login', loginHandler)

app.listen(PORT_HTTP, () => console.log(`Server running on http://localhost:${PORT_HTTP}/`))
