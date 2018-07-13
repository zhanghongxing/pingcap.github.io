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

$(function() {
  // Handle hash change
  $(window).on('hashchange', function() {
    const hash = decodeURIComponent(location.hash)
    if (hash) smoothScroll(hash)
  })

  // Process Typed terminal
  var sqlTyped = new Typed('#typedSelect', {
    strings: ['mysql> select * from pingcap.milestones;'],
    typeSpeed: 50, // typing speed
    backSpeed: 0,
    showCursor: false,
    loop: false,
    onComplete: function(self) {
      setTimeout(function() {
        $('.table-content').show()
        $('.terminal').animate({ scrollTop: $('.terminal').height() }, 'slow')
      }, 500)
    },
  })

  // Handle hide message click event
  $('.hider').click(function() {
    $(this)
      .parent('.message')
      .removeClass('blur')
  })
})
