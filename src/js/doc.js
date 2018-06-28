// JS Goes here - ES6 supported

// Process doc-liked pages

import './vendor/jquery.SimpleTree.js'
import { run as toc_run } from './vendor/toc'

var blogRegex = /\/blog(-cn)?\//gi

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

$(document).ready(function() {
  // Process Sticky Tree
  if ($('.st_tree').length) {
    // Sticky tree fade in
    $('.st_tree').fadeIn()
    // Handle click events
    $('.st_tree').SimpleTree({
      click: a => {
        if ($(a).attr('href') != '#') {
          $(a)
            .parent()
            .parent()
            .find('.active')
            .removeClass('active')
          $(a)
            .parent()
            .addClass('active')
          window.location.href = $(a).attr('href')
        }
      },
    })
  }

  // Handle hash change
  $(window).on('hashchange', function() {
    const hash = decodeURIComponent(location.hash)
    if (
      location.pathname.match(blogRegex) &&
      $('.nav-tags').data('type') !== 'single'
    )
      return
    if (hash) smoothScroll(hash)
  })

  // Create TOC for article in docs module
  const $tocWrap = $('.article-toc')
  if ($tocWrap.length) {
    toc_run()
  }

  // Process tags
  const hash = decodeURIComponent(location.hash)
  if (location.pathname.match(blogRegex) && hash) {
    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${hash.slice(1)}"]`).addClass('sel')
    $('.article-list .article').each(function() {
      const $this = $(this)
      if ($this.data('tag').includes(hash.slice(1))) {
        $this.show()
      } else {
        $this.hide()
      }
    })
  } else {
    const pageType = $('.nav-tags').data('type')
    if (pageType !== 'single') {
      $('.tag.all').addClass('sel')
    }
    if (hash) {
      smoothScroll(hash)
    }
  }

  // Filter tags on frontend
  $('.nav-tags .tag, .anchor-tag').click(function(e) {
    const $this = $(this)
    const isInlineTag = $this.hasClass('anchor-tag')
    const isAll = $this.hasClass('all')
    const filter = isInlineTag ? $this.text().trim() : $this.data('tag')

    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${filter}"]`).addClass('sel')
    isAll && $('.tag.all').addClass('sel')

    const pageType = $('.nav-tags').data('type')

    if (pageType && pageType === 'single') {
      if (isAll) window.location.href = '../'
      else window.location.href = `../#${encodeURIComponent(filter)}`
    } else {
      $('.article-list .article').each(function() {
        const $this = $(this)
        if (isAll) {
          $this.show()
        } else {
          if ($this.data('tag').includes(filter)) {
            $this.show()
          } else {
            $this.hide()
          }
        }
      })
      if (isAll) window.location.href = `./`
      else window.location.href = `./#${encodeURIComponent(filter)}`
    }

    e.preventDefault()
    return false
  })

  // Open the first item in docs/docs-cn/weekly/recruit-cn list page
  const openFolder = li => {
    if (li.hasClass('has-child')) {
      li.addClass('open')
      const $firstUL = li.find('ul')[0]
      const $LI = $($firstUL)
        .attr('style', 'display: block;')
        .find('li:first-child')
      return openFolder($LI)
    }
    li.addClass('active')
    return false
  }
  const $firstLI = $('#list_page .st_tree > ul > li:first-child')
  if (!hash && $firstLI.length) openFolder($firstLI)

  // Replace the relative href in markdown-body
  function replaceHref(a) {
    var href = $(a).attr('href')
    var absUrlExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
      mdSuffixExp = /\.md/

    var absUrlRegex = new RegExp(absUrlExp),
      mdSuffixRegex = new RegExp(mdSuffixExp)

    if (!href.match(absUrlRegex) && href.match(mdSuffixRegex)) {
      var newHref = '../' + href.replace(/\.md/, '')
      $(a).attr('href', newHref)
    }
  }
  $('.markdown-body')
    .find('a')
    .each(function() {
      var $this = $(this)
      // click event
      $this.click(function(e) {
        replaceHref(this)
      })
      // right click event for open in new window or copy link url
      $this.contextmenu(function(e) {
        replaceHref(this)
      })
    })
})
