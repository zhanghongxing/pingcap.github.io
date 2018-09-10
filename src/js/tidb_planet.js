// JS Code in TiDB Planet Pages

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

const isAuthContributor = () => getCookies()['CONTRIBUTOR_NUM']

const usernameValidation = name => {
  var githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
  // console.log('username validation', githubUsernameRegex.test(name))
  return githubUsernameRegex.test(name)
}

const authenticateContributor = name => {
  // load contributors json data
  if (!window.tidbContributors) {
    window.tidbContributors = $('.j-login-btn').data('contributors')
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
    Cookies.set(cookiesKeyMap['CONTRIBUTOR_NUM'], cNum)
    console.log(
      `Congratulations! You are the ${cNum}th landing on TiDB Planet!`
    )
  } else {
    // failed: is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
  }
}

// generate numerical order abbr.
const ordinalAbbr = number => {
  var b = number % 10
  return ~~((number % 100) / 10) === 1
    ? 'th'
    : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th'
}

const showUserInfo = type => {
  // fill username
  $('.j-username').text(getCookies()['USERNAME'])

  if (type === 'contributor') {
    $('.j-contributor').fadeIn()
    // fill contributor num
    $('.j-contributor-num').text(
      `${getCookies()['CONTRIBUTOR_NUM']}${ordinalAbbr(
        getCookies()['CONTRIBUTOR_NUM']
      )}`
    )
  } else {
    $('.j-visitor').fadeIn()
  }
}

// convert html to canvas, then convert canvas to image
const convert2image = () => {
  var shareContent = document.body
  var width = shareContent.offsetWidth
  var height = shareContent.offsetHeight
  var canvas = document.createElement('canvas')
  var scale = 2

  canvas.width = width * scale
  canvas.height = height * scale
  canvas.getContext('2d').scale(scale, scale)

  var opts = {
    scale: scale,
    canvas: canvas,
    useCORS: true,
    logging: true,
    width: width,
    height: height,
  }
  html2canvas(shareContent, opts).then(function(canvas) {
    $('.qr-code-container').remove()
    var context = canvas.getContext('2d')

    var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height)

    // TODO: polish generated picture container dom element
    document.body.appendChild(img)
    $(img).css({
      width: canvas.width / 2 + 'px',
      height: canvas.height / 2 + 'px',
    })
  })
}

$(function() {
  // get username in cookie
  const username = getCookies()['USERNAME']
  if (!username) {
    // is a new user
    console.log('Welcome to TiDB Planet! You are not logged in yet.')

    // TiDB Planet welcome page
    if ($('body.tidb-planet').length) {
      // TODO: open video mask and playing video

      // TODO: after playing video, show login box
      // show login button and form card
      $('.j-login-btn').show()
    } else {
      // not the welcome page
      console.log('Not the TiDB Planet Welcome Page')
      // show login button in every pages
      $('.j-login-btn').show()
    }
  } else if (isAuthContributor()) {
    // is a contributor
    console.log(
      `Congratulations! You are the ${
        getCookies()['CONTRIBUTOR_NUM']
      }th landing on TiDB Planet!`
    )
    showUserInfo('contributor')
  } else {
    // is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
    showUserInfo('visitor')
  }

  // control buttons
  // TODO: Modal controls
  $('.close-modal').click(function() {
    $('.modal-overlay').fadeOut()
    $('.modal-overlay, .modal').removeClass('active')
  })
  $('.j-menu-btn').click(function() {
    if ($('.menu').css('display') === 'block') $('.menu').fadeOut()
    else $('.menu').fadeIn()
  })
  $('.j-login-btn').click(function() {
    $('.j-login-overlay').fadeIn()
    $('.j-login-overlay, .modal').addClass('active')
  })
  $('.j-contributors-btn').click(function() {
    $('.j-contributors-overlay').fadeIn()
    $('.j-contributors-overlay, .modal').addClass('active')
  })
  $('.j-video-btn').click(function() {
    $('.j-video-overlay').fadeIn()
    $('.j-video-overlay, .modal').addClass('active')
  })

  // form validation
  $('.form .input').blur(function() {
    if (!usernameValidation($(this).val())) {
      $('.input-container').append(
        '<span class="inner" >' + 'Please enter a valid username.' + '</span>'
      )
      setTimeout(() => {
        $('.input-container .inner').addClass('error')
      }, 100)
    }
  })
  $('.form .input').focus(function() {
    $('.input-container .inner').removeClass('error')
    $('.input-container .inner').remove()
  })

  // login authentication
  $('.form').submit(function(e) {
    $('.form .input').blur()
    const inputName = $('.form .input').val()

    if (usernameValidation(inputName)) {
      $('.modal-login').addClass('landing')

      authenticateContributor(inputName)
      // create a cookie about username
      Cookies.set(cookiesKeyMap['USERNAME'], inputName)

      setTimeout(() => {
        location.href = '/tidb-planet/user/'
      }, 2000)
    }

    e.preventDefault()
  })

  //TODO: save picture button
  $('.j-save').click(function() {
    // TODO: polish qr code container dom element
    $('body').append(
      '<div class="qr-code-container">Test QRCode <img src="https://download.pingcap.com/images/wechat-qrcode.jpg" alt="" /></div>'
    )
    convert2image()
  })
})
