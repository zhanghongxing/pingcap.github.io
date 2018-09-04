// generate contributors.json for tidb-planet

const octokit = require('@octokit/rest')()
// https://github.com/octokit/rest.js


const repoList = ['tidb']
const owner = 'pingcap'
const per_page = 100

async function getRepoContributors(repo) {
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

// fetch each contributor's first commit
async function getContributorFirstCommit(author) {
  console.log(author)
  let first_commit_date
  const repo = repoList[0]
  const result = await octokit.repos.getCommits({owner, repo, author, per_page})
  console.log('commits result data', result.data)

  await innerCallback(result)
  return first_commit_date

  async function innerCallback(result) {
    if(octokit.hasNextPage(result)) {
      let _r = await octokit.getNextPage(result)
      innerCallback(_r)
    } else {
      console.log(result.data.length)
      first_commit_date = result.data[result.data.length - 1].commit.author.first_commit_date
      console.log(first_commit_date)
    }
  }

}

const fs = require('fs')

async function main() {
  let RepoContributorList = []
  for(let i of repoList) {
    RepoContributorList.push(await getRepoContributors(i))
  }

  let collections = {}

  RepoContributorList.forEach((list, idx)=>{
    console.log(`Repo ${repoList[idx]} has ${list.length} contributors`)

    // callback
    async function callback(c) {
      const { id, login, avatar_url, contributions } = c

      // TODO: get each contributor's first commit

      if(!collections[login]) {
        const first_commit_date = await getContributorFirstCommit(login) || ''

        collections[login] = {
          id,
          login,
          avatar_url,
          contributions,
          first_commit_date
        }
      }
    }

    list.forEach(c => {
      callback(c)
      // const { id, login, avatar_url, contributions } = c

      // // TODO: get each contributor's first commit

      // if(!collections[login]) {
      //   const first_commit_date = getContributorFirstCommit(login) || ''

      //   collections[login] = {
      //     id,
      //     login,
      //     avatar_url,
      //     contributions,
      //     first_commit_date
      //   }
      // }
    })
  }, {})

  fs.writeFileSync('./contributors.json', JSON.stringify(collections), 'utf8')
  // hash -> array
}

main()
