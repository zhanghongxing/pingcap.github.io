// JS Goes here - ES6 supported

// Global JS

// Say hello
console.log('🦊 Hello! @PingCAP website')

import '../../dist/css/main.css'

$(document).ready(function() {
  // Process release banner
  if ($('.homepage')) {
    var version = $('.release-banner').data('release')

    if (typeof Storage !== 'undefined') {
      // Code for localStorage/sessionStorage.
      var releaseVerInStorage = localStorage.getItem(
        `release-version-${version}`
      )
      if (!releaseVerInStorage) $('.homepage').addClass('banner-active')
    } else {
      // Sorry! No Web Storage support..
      $('.homepage').addClass('banner-active')
    }
  }
  // Handle window scroll event
  $(window).scroll(function() {
    var scrollVal = $(this).scrollTop(),
      y = $('header').height()
    if ($('body.banner-active') && scrollVal >= y) {
      $('body.banner-active').addClass('banner-active--scrolled')
    }
    if ($('body.banner-active--scrolled') && scrollVal < y) {
      $('body').removeClass('banner-active--scrolled')
    }
  })

  $('.release-banner__close').click(function(e) {
    if ($('body.banner-active')) $('body').removeAttr('class')
    // set localStorage to record release banner version
    if (typeof Storage !== 'undefined') {
      var version = $('.release-banner').data('release')
      localStorage.setItem(`release-version-${version}`, version)
    }
    e.preventDefault()
  })

  // Footer: Toggle wechat qr code
  $('#wechat').on('click', e => {
    e.preventDefault()
    $('#wechat .qr_code_outer').toggleClass('f-hide')
  })
  $('#wechat-mobile').on('touchstart', e => {
    e.preventDefault()
    $('#wechat-mobile .qr_code_outer').toggleClass('f-hide')
  })

  // Hide search suggestions dropdown menu on focusout
  $('#search-input').focusout(function() {
    $('.ds-dropdown-menu').hide()
  })
  // Show search suggestions dropdown menu on focus
  $('#search-input').focus(function(e) {
    e.preventDefault()
    if (e.target && e.target.value) $('.ds-dropdown-menu').show()
  })

  // Toggle mobile sidebar
  $('.nav-btn.nav-slider').on('click', function() {
    $('.overlay').show()
    $('nav').toggleClass('open')
  })
  $('.overlay').on('click', function() {
    if ($('nav').hasClass('open')) {
      $('nav').removeClass('open')
    }
    $(this).hide()
  })
})
