const fetch = require('node-fetch')
const getContributorsA = async (orgainzation) => {
  let repos = await fetch(`https://api.github.com/orgs/${orgainzation}/repos`).catch(err => console.error(err))
  let status = await repos.status
  if (status === 403) {
    let headers = await repos.headers
    let header = headers[Object.getOwnPropertySymbols(headers)[0]]
    let date = await new Date(header['x-ratelimit-reset'] * 1000)
    return `Limit: ${header['x-ratelimit-remaining']} left of ${header['x-ratelimit-limit']}. Wait until ${date.toTimeString()}`
  }
  let reposJson = await repos.json()
  return contributorsPerRepo(reposJson, orgainzation)
}

const contributorsPerRepo = async (repoList, orgainzation) => {
  return repoList.filter((item, key) => { if (key < 3) { return item } }).reduce(async (collection, current) => {
    let acc = await collection
    await Object.assign(acc, { [current.name]: await fetchContributors(current.name, orgainzation) })
    return acc
  }, Promise.resolve({}))
}

const fetchContributors = async (name, orgainzation) => {
  let contibs = await fetch(`https://api.github.com/repos/${orgainzation}/${name}/contributors`).catch(err => console.error(err))
  let body = await contibs.json()
  return body.map(contrib => contrib.login)
}

module.exports = getContributorsA
