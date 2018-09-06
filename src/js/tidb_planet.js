// JS Goes here - ES6 supported

// TiDB Planet Pages

const prefix = '_tidb_planet_'
const cookiesKeyMap = {
  CONTRIBUTOR_NUM: `${prefix}contributor_num`,
  USERNAME: `${prefix}username`,
}

const getCookies = () => {
  let cookiesValMap = {}
  for (let ck in cookiesKeyMap) {
    const val = $.cookie(cookiesKeyMap[ck])
    cookiesValMap[ck] = val
  }
  return cookiesValMap
}

const isAuthContributor = username => {
  console.log('has username', username)
  return window.tidbContributors[username]
}

const authenticateContributor = name => {
  if (window.tidbContributors[name]) {
    // success: is a contributor
    // sort by commit date
    const sortedContributors = _.toArray(window.tidbContributors).sort(
      (a, b) => {
        var dateA = a.first_commit_date.toLowerCase() // ignore upper and lowercase
        var dateB = b.first_commit_date.toLowerCase() // ignore upper and lowercase
        if (dateA < dateB) {
          return -1
        }
        if (dateA > dateB) {
          return 1
        }
        return 0
      }
    )

    const cNum = sortedContributors.indexOf(window.tidbContributors[name]) + 1
    // console.log(cNum)
    $.cookie(cookiesKeyMap['CONTRIBUTOR_NUM'], cNum)
    console.log(
      `Congratulations! You are the ${cNum}th landing on TiDB Planet!`
    )
  } else {
    // failed: is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
  }
}

$(function() {
  // load contributors json
  if (!window.tidbContributors) {
    window.tidbContributors = $('#tidb-planet').data('contributors')
  }

  // get username
  const username = getCookies()['USERNAME']
  console.log('username in cookies', username)
  if (!username) {
    // is a new user
    // TODO: play milestones video
    console.log('You are fresh~ please login')
    // TODO: after play video, show login mask
    // after close mask(either login or not) show login button - every page with the same rule

    // TODO: login input
    // after input username
    // TODO: authenticate contributor
    // test contributor
    const inputName = 'ngaut'
    // test visitor
    // const inputName = 'xuechunL'
    authenticateContributor(inputName)
    $.cookie(cookiesKeyMap['USERNAME'], inputName)
  } else if (isAuthContributor(username)) {
    // is a contributor
    console.log(
      `Congratulations! You are the ${
        getCookies()['CONTRIBUTOR_NUM']
      }th landing on TiDB Planet!`
    )
  } else {
    // is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
  }
})
