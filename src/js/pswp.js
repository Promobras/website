/* global PhotoSwipe, PhotoSwipeUI_Default */
var openPhotoSwipe = () => {
  var pswpElement = document.querySelectorAll('.pswp')[0]

  // build items array
  var items = [
    {
      src: '/uploads/2828.jpg',
      w: 800,
      h: 600
    },
    {
      src: '/uploads/2831.jpg',
      w: 800,
      h: 600
    },
    {
      src: '/uploads/2534.jpg',
      w: 800,
      h: 600
    }
  ]

  // define options (if needed)
  var options = {
  // optionName: 'option value'
  // for example:
    index: 0, // start at first slide
    mainClass: 'pswp--minimal--dark',
    barsSize: {top: 0, bottom: 0},
    captionEl: false,
    fullscreenEl: true,
    shareEl: false,
    bgOpacity: 0.95,
    tapToClose: true,
    tapToToggleControls: false
  }

  // Initializes and opens PhotoSwipe
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
  gallery.listen('destroy', () => {
    $('#header').css('display', '')
  })
  gallery.init()
  $('#header').css('display', 'none')
}

document.getElementById('btn').onclick = openPhotoSwipe
