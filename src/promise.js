const fetch = require('node-fetch')
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
      .then(json => selectRepos(json, orgainzation).then(resp => resp))
      .catch(err => ({ 'err': err }))
  })
}

const selectRepos = (data, orgainzation) => {
  return new Promise((resolve, reject) => {
    resolve(data
      .filter((item, key) => { if (key < 3) { return item } })
      .reduce((promise, current) => {
        return promise
          .then(result => {
            return fetchContributors(current.name, orgainzation)
              .then(arr => Object.assign(promise, { [current.name]: arr }))
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      }, Promise.resolve())
    )
  })
}

const fetchContributors = (name, orgainzation) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.github.com/repos/${orgainzation}/${name}/contributors`)
      .then(resp => resp.json())
      .then(json => resolve(json.map(contrib => contrib.login)))
      .catch(err => reject(err))
  })
}

module.exports = getContributorsB
