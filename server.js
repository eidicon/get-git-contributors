const express = require('express')
require('dotenv').config()
const index = require('./routes/index')

let port = process.env.HOST_PORT || 4000
let host = process.env.HOST_NAME || 'localhost'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'pug')

app.use('/', index)

app.listen(port, host, err => {
  if (err) {
    console.error(err)
  }

  console.log(`Server Now Running On ${host}:${port}`)
})
