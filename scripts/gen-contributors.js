// generate contributors.json for tidb-planet pages

const octokit = require('@octokit/rest')()
// https://github.com/octokit/rest.js

const owner = 'pingcap'
const repo = 'tidb'
const per_page = 100

// FIXME: GitHub REST API Issue: empty commit list
const omittedContributorsCommits = {
  liubin: {first_commit_date: "2016-04-26"},
  buggithubs: {first_commit_date: "2017-11-20"}
}

const fs = require('fs')

async function main() {
  let contributors = {}
  let commits = {}
  const list = await getRepoContributors()
  await processContributorsCommits()
  // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795
  await genJSON()

  // fetch TiDB repository contributors
  async function getRepoContributors() {
    let all = []
    const result = await octokit.repos.getContributors({
      owner,
      repo,
      per_page})
    await inner(result)
    return all

    async function inner(result) {
      all = all.concat(result.data)

      if(octokit.hasNextPage(result)) {
        let _r = await octokit.getNextPage(result)
        inner(_r)
      } else {
        console.log(all.length)
      }
    }
  }

  // generate each contributor's first commit
  async function genContributorFirstCommit(author) {
    let first_commit_date
    const result = await octokit.repos.getCommits({owner, repo, author, per_page})

    await innerCallback(result)
    return first_commit_date

    async function innerCallback(result) {
      let _res = result
      if(octokit.hasLastPage(result))
        _res = await octokit.getLastPage(result)

      if(_res.data.length) {
        const first_commit = _res.data[_res.data.length - 1].commit
        if(first_commit)
          first_commit_date = first_commit.author.date
      }
    }
  }

  // get first commit date for each contributor
  async function processContributorsCommits () {
    // map array to promises
    const promises = list.map(asyncGenCommit)
    // wait until all promises are resolved
    await Promise.all(promises)

    async function asyncGenCommit(c) {
      const { login } = c
      const first_commit_date = await genContributorFirstCommit(login) || ''
      if(!commits[login]) {
        commits[login] = {
          first_commit_date
        }
      }
    }
  }

  // generate contributors.json file
  async function genJSON() {
    // FIXME: add omitted contributors
    commits = Object.assign({}, commits, omittedContributorsCommits)

    list.forEach(c => {
      const { login, avatar_url, contributions } = c
      if(!contributors[login]) {
        // generate contributor item
        const { first_commit_date } = commits[login]
        contributors[login] = {
          login,
          avatar_url,
          contributions,
          first_commit_date
        }
      }
    })
    // write to file
    fs.writeFileSync('data/contributors.json', JSON.stringify(contributors), 'utf8')
  }
}

main()
