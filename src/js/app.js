// JS Goes here - ES6 supported

// Global JS

// Say hello
console.log('🦊 Hello! @PingCAP website')

// import '../../dist/css/main.css'

// Smooth scrolling when the document is loaded and ready
function smoothScroll(hash) {
  const y = $('header').height()
  if (hash && $(hash).offset())
    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top - y - 20,
      },
      1000
    )
}

// Process hash
function processHash() {
  const hash = decodeURIComponent(location.hash)
  if (!hash) return
  if ($('.nav-tags').length && $('.nav-tags').data('type') === 'list') return

  // do not process smoothScroll when url has #access_token
  if (hash.substr(0, 13) != '#access_token') {
    smoothScroll(hash)
  }
}

// initial algolia search
function initialSearch() {
  docsearch({
    apiKey: 'ad5e63b76a221558bdc65ab1abbec7a2',
    indexName: 'pingcap',
    inputSelector: '#search-input',
    debug: true, // Set debug to true if you want to inspect the dropdown
    transformData: function(hits) {
      // filter hits
      function isChinese(s) {
        var pattern = /\/.*-cn\//gi
        return pattern.exec(s)
      }
      // filter 404 results
      function is404(h) {
        var pattern = /404/gi
        return h && h.lvl1 && pattern.exec(h.lvl1)
      }
      var filteredHits = hits.filter(function(hit) {
        if ($('#search-input').data('lang') === 'en')
          return !isChinese(hit.url) && !is404(hit.hierarchy)
        else return isChinese(hit.url) && !is404(hit.hierarchy)
      })
      return filteredHits
    },
  })
}

// process search ui
function processSearch() {
  initialSearch()
  // Hide search suggestions dropdown menu on focusout
  $('#search-input').focusout(function() {
    $('.ds-dropdown-menu').hide()
  })
  // Show search suggestions dropdown menu on focus
  $('#search-input').focus(function(e) {
    e.preventDefault()
    if (e.target && e.target.value) $('.ds-dropdown-menu').show()
  })
}

// Process release banner
function processReleaseBanner() {
  var version = $('.release-banner').data('release')

  if (typeof Storage !== 'undefined') {
    // Code for localStorage/sessionStorage.
    var releaseVerInStorage = localStorage.getItem(`release-version-${version}`)
    if (!releaseVerInStorage) $('.homepage').addClass('banner-active')
  } else {
    // Sorry! No Web Storage support..
    $('.homepage').addClass('banner-active')
  }
  $('.release-banner__close').click(function(e) {
    if ($('body.banner-active')) $('body').removeClass('banner-active')
    // set localStorage to record release banner version
    if (typeof Storage !== 'undefined') {
      var version = $('.release-banner').data('release')
      localStorage.setItem(`release-version-${version}`, version)
    }
    e.preventDefault()
  })
}

// Toggle weChat qr code
function toggleWeChatQRCode() {
  $('#wechat').click(e => {
    e.preventDefault()
    $('#wechat .qr_code_outer').toggleClass('f-hide')
  })
  $('#wechat-mobile').on('touchstart', e => {
    e.preventDefault()
    $('#wechat-mobile .qr_code_outer').toggleClass('f-hide')
  })
}

function handleWindowScroll() {
  var scrollVal = $(this).scrollTop(),
    y = $('header').height()
  var amountScrolled = 200

  //process release banner in homepage
  if ($('body.banner-active') && scrollVal >= y) {
    $('body.banner-active').addClass('banner-active--scrolled')
  }
  if ($('body.banner-active--scrolled') && scrollVal < y) {
    $('body').removeClass('banner-active--scrolled')
  }
  // process back to top button
  if (scrollVal > amountScrolled) {
    $('.back-to-top').addClass('show')
  } else {
    $('.back-to-top').removeClass('show')
  }
}

function processMobileOverlay() {
  $('.nav-btn.nav-slider').click(function() {
    $('.overlay').show()
    $('nav').toggleClass('open')
  })
  $('.overlay').click(function() {
    if ($('nav').hasClass('open')) {
      $('nav').removeClass('open')
    }
    $(this).hide()
  })
}

// function isExpired() {
//   // Check whether the current time is past the
//   // access token's expiry time
//   if (localStorage.getItem('expires_at')) {
//     var expiresAt = JSON.parse(localStorage.getItem('expires_at'))
//     if (new Date().getTime() > expiresAt) {
//       localStorage.removeItem('access_token')
//       localStorage.removeItem('id_token')
//       localStorage.removeItem('expires_at')
//       return true
//     }
//   } else {
//     return false
//   }
// }

$(document).ready(function() {
  processHash()

  // Handle hash change
  $(window).on('hashchange', processHash)

  // Handle window scroll event
  $(window).scroll(handleWindowScroll)

  if ($('.homepage').length) processReleaseBanner()

  processSearch()

  toggleWeChatQRCode()

  processMobileOverlay()

  // Handle click event on Back to top button
  $('.back-to-top').click(function() {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      800
    )
    return false
  })

  // handle tidb academy login authentication
  // $('.tidb-academy').click(function(e) {
  //   console.log('click click clickhhhhhhhhh')
  //   // e.preventDefault() // 阻止页面跳转，先做 auth0 判断
  //   // TO DO: 在这里做 auth0 的判断, 如果状态为 logged in, 不跳转至原 a 标签中的 href, 而是换一个 href
  //   // TO DO: 如果状态为 not logged in, 就做原标签中的 href 跳转
  //   // if (!localStorage.access_token || isExpired()) {
  //   //   // $(this).attr('href', 'http://localhost:3005/tidb-academy')
  //   //   location.href = 'http://localhost:3005/tidb-academy'
  //   // } else {
  //   //   location.href =
  //   //     'http://localhost:3005/tidb-academy/mysql_dbas/introduction/course-overview/'
  //   // }
  // })
})
