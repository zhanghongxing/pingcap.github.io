// JS Goes here - ES6 supported

// TiDB Planet Pages

import Cookies from './vendor/js.cookie.js'
// https://github.com/js-cookie/js-cookie

const prefix = '_tidb_planet_'
const cookiesKeyMap = {
  CONTRIBUTOR_NUM: `${prefix}contributor_num`,
  USERNAME: `${prefix}username`,
}

const getCookies = () => {
  let cookiesValMap = {}
  for (let ck in cookiesKeyMap) {
    const val = Cookies.get(cookiesKeyMap[ck])
    cookiesValMap[ck] = val
  }
  return cookiesValMap
}

const isAuthContributor = () => {
  console.log(
    'authenticated contributor number',
    getCookies()['CONTRIBUTOR_NUM']
  )
  return getCookies()['CONTRIBUTOR_NUM']
}

const authenticateContributor = name => {
  // load contributors json data
  if (!window.tidbContributors) {
    window.tidbContributors = $('.login-box-wrapper').data('contributors')
  }

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
    Cookies.set(cookiesKeyMap['CONTRIBUTOR_NUM'], cNum)
    console.log(
      `Congratulations! You are the ${cNum}th landing on TiDB Planet!`
    )
  } else {
    // failed: is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
  }
}

$(function() {
  // get username in cookie
  const username = getCookies()['USERNAME']
  console.log('username in cookies', username)
  if (!username) {
    // is a new user
    // TODO: play milestones video
    console.log('You are fresh~ please login')

    // tidb planet welcome page
    if ($('body.tidb-planet').length) {
      // TODO: open video mask
      // TODO: after playing video, show login box or mask

      // TODO: login input,  get inputName
      //
      // TODO: after getting inputName authenticate contributor
      // test contributor
      // const inputName = 'ngaut'
      // test visitor
      const inputName = 'xuechunL'
      console.log('after getting inputName', inputName)
      authenticateContributor(inputName)
      // create a cookie about username
      Cookies.set(cookiesKeyMap['USERNAME'], inputName)
    } else {
      // not welcome page
      console.log('Not Welcome Page')
      // show login button in every pages
      // if is user info page, not show any card
    }
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
