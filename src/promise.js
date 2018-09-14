const fetch = require('node-fetch')
const MAX_REPOS = '3'

const getContributorsB = (orgainzation) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.github.com/orgs/${orgainzation}/repos`)
      .then(resp => {
        if (resp.status === 403) {
          let headers = resp.headers
          let header = headers[Object.getOwnPropertySymbols(headers)[0]]
          let date = new Date(header['x-ratelimit-reset'] * 1000)
          reject(new Error(`Limit: ${header['x-ratelimit-remaining']} left of ${header['x-ratelimit-limit']}. Wait until ${date.toTimeString()}`))
        } else {
          return resp
        }
      })
      .then(resp => resp.json())
      .then(json => selectRepos(json, orgainzation).resolve())
      .then(promise => console.log(promise))
      .catch(err => ({ 'err': err }))
  })
}

const selectRepos = (data, orgainzation) => {
  return new Promise((resolve, reject) => {
    data.slice(0, MAX_REPOS)
      .reduce((promise, current) => {
        return promise.then(result => {
          fetchContributors(current.name, orgainzation).then(arr => Object.assign(promise, { [current.name]: arr }))
        })
      }, Promise.resolve({}))
  })
}

const fetchContributors = (name, orgainzation) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.github.com/repos/${orgainzation}/${name}/contributors`)
      .then(resp => resp.json())
      .then(json => {
        console.log(json)
        return resolve(json.map(contrib => contrib.login))
      })
      .catch(err => reject(err))
  })
}

module.exports = getContributorsB
