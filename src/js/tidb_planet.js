// JS Goes here - ES6 supported

// TiDB Planet Pages

const prefix = '_tidb_planet_'

const cookiesKeyMap = {
  AUTHENTICATED_CONTRIBUTORS_SUM: `${prefix}authenticated_contributors_sum`,
  CONTRIBUTOR_NUM: `${prefix}contributor_num`,
  AUTHENTICATED_VISITORS_SUM: `${prefix}authenticated_visitors_sum`,
  VISITOR_NUM: `${prefix}visitor_num`,
}

let cookiesValMap = {}

const getCookies = () => {
  for (let ck in cookiesKeyMap) {
    console.log('cookie key', ck)
    const val = $.cookie(cookiesKeyMap[ck])
    console.log('cookie value', val)
    cookiesValMap[ck] = val
  }

  console.log('cookies', cookiesValMap)
}

const isAuthContributor = () => {
  console.log('is contributor', cookiesValMap['CONTRIBUTOR_NUM'])
  return cookiesValMap['CONTRIBUTOR_NUM']
}

const isAuthVisitor = () => {
  console.log('is visitor', cookiesValMap['VISITOR_NUM'])
  return cookiesValMap['VISITOR_NUM']
}

const authenticateContributor = user => {
  getCookies()

  if (window.tidbContributors[user]) {
    // auth success: is contributor
    const cSum = +cookiesValMap['AUTHENTICATED_CONTRIBUTORS_SUM'] || 0
    const cNum = cSum + 1
    console.log(
      `Congratulations! You are the ${cNum}th landing on TiDB Planet!`
    )
    // update AUTHENTICATED_CONTRIBUTORS_SUM and CONTRIBUTOR_NUM： both +1
    $.cookie(cookiesKeyMap['AUTHENTICATED_CONTRIBUTORS_SUM'], cNum)
    $.cookie(cookiesKeyMap['CONTRIBUTOR_NUM'], cNum)
  } else {
    // auth failed: is visitor
    console.log(
      'AUTHENTICATED_VISITORS_SUM',
      +cookiesValMap['AUTHENTICATED_VISITORS_SUM']
    )
    const vSum = +cookiesValMap['AUTHENTICATED_VISITORS_SUM'] || 0
    const vNum = vSum + 1
    console.log(`Welcome to the TiDB planet! You are the ${vNum}th visitor!`)
    // update AUTHENTICATED_VISITORS_SUM and VISITOR_NUM
    $.cookie(cookiesKeyMap['AUTHENTICATED_VISITORS_SUM'], vNum)
    $.cookie(cookiesKeyMap['VISITOR_NUM'], vNum)
  }
}

$(function() {
  // load contributors json
  if (!window.tidbContributors) {
    window.tidbContributors = $('#tidb-planet').data('contributors')
  }

  // get cookies and
  getCookies()

  // judge user identity
  if (isAuthContributor()) {
    console.log(
      `Congratulations! You are the ${
        cookiesValMap['CONTRIBUTOR_NUM']
      }th landing on TiDB Planet!`
    )
  } else if (isAuthVisitor()) {
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
  } else {
    // new user
    // TODO: play milestones video
    console.log('You are fresh~ please login')
    // TODO: after play video, show login mask
    // after close mask(either login or not) show login button - every page with the same rule

    // TODO: login input
    // after input username
    // TODO: authenticate contributor
    // test user
    const user = 'liubin'
    authenticateContributor(user)
  }
  // ajax get contributors
  // $.ajax({
  //   url: 'https://api.github.com/repos/pingcap/tidb/contributors',
  //   crossDomain: true,
  //   success: function(data) {
  //     console.log(data)
  //   },
  // })
})
