require('dotenv').config()
const express = require('express')
const router = express.Router()
const getContributorsA = require('../src/asyncAwait')
const getContributorsB = require('../src/promise')
let organizationName = 'nodejs'

router.get('/', async (req, res) => {
  return res.render('index')
})

router.get('/as-promise', (req, res) => {
  let nodejsRepoContributors = getContributorsB(organizationName)
    .then(resp => resp)
    .catch(err => console.log(err))
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(nodejsRepoContributors, null, 3))
})

router.get('/as-async-await', async (req, res) => {
  let nodejsRepoContributors = await getContributorsA(organizationName).catch(err => console.log(err))
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(nodejsRepoContributors, null, 3))
})

module.exports = router
