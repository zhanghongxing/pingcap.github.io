// JS Goes here - ES6 supported

// TiDB Planet Pages

const prefix = '_tidb_planet_'
const cookiesKeyMap = {
  CONTRIBUTOR_NUM: `${prefix}contributor_num`,
  // VISITOR_NUM: `${prefix}visitor_num`,
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
    // auth success: is a contributor
    // TODO: change algorithm to getting contributor number
    // sort by commit date
    // update contributor number
  } else {
    // auth failed: is a visitor
    console.log('Not a contributor')
    // TODO: visitor card number
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
    // TODO: test user
    const inputName = 'xuechunL'
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
