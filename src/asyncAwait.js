const fetch = require('node-fetch')

const MAX_REPOS = '3'

const getContributorsA = async (orgainzation) => {
  let repos = await fetch(`https://api.github.com/orgs/${orgainzation}/repos`).catch(err => console.error(err))
  let status = await repos.status
  if (status === 403) {
    let headers = await repos.headers
    let header = headers[Object.getOwnPropertySymbols(headers)[0]]
    let date = await new Date(header['x-ratelimit-reset'] * 1000)
    throw new Error(`Limit: ${header['x-ratelimit-remaining']} left of ${header['x-ratelimit-limit']}. Wait until ${date.toTimeString()}`)
  }
  let reposJson = await repos.json()
  let data = await contributorsPerRepo(reposJson, orgainzation)
  return data.reduce((acc, curr) => {
    return Object.assign(acc, curr)
  }, {})
}

const contributorsPerRepo = async (repoList, orgainzation) => {
  let repos = await repoList.slice(0, MAX_REPOS)
  let [firstP, secondP, thirdP] = await repos.map(async (item) => ({ [item.name]: await fetchContributors(item.name, orgainzation) }))
  let object = Promise.all([firstP, secondP, thirdP])
  return object
}

const fetchContributors = async (name, orgainzation) => {
  let contibs = await fetch(`https://api.github.com/repos/${orgainzation}/${name}/contributors`).catch(err => console.error(err))
  let body = await contibs.json()
  return body.map(contrib => contrib.login)
}

module.exports = getContributorsA
