/* global PhotoSwipe, PhotoSwipeUI_Default */
var openPhotoSwipe = (e) => {
  let group = $(e.target).parent().attr('data-lightbox')
  var pswpElement = $('.pswp')[0]

  // build items array
  var items = []
  let images = $('div.img[data-lightbox=' + group + ']>img')
  let startIndex = 0
  for (let i = 0; i < images.length; i++) {
    let value = images[i]
    if ($(value).attr('src') === $(e.target).attr('src')) {
      startIndex = i
    }
    let src = $(value).attr('data-src')
    if (typeof src === 'undefined') {
      src = value.src
    }
    let item = {
      large: {
        src: src.replace('w_auto', 'w_1600').replace(',dpr_auto', ''),
        w: 1600,
        h: 1200
      },
      medium: {
        src: src.replace('w_auto', 'w_800').replace(',dpr_auto', ''),
        w: 800,
        h: 600
      },
      small: {
        src: src.replace('w_auto', 'w_400').replace(',dpr_auto', ''),
        w: 400,
        h: 300
      },
      msrc: value.src
    }
    let srcwidth = parseInt($(value).attr('data-srcwidth'))
    if (srcwidth < 800) {
      item.medium = item.small
    }
    if (srcwidth < 1600) {
      item.large = item.medium
    }
    items.push(item)
  }
  // define options (if needed)
  var options = {
    index: startIndex,
    barsSize: {top: 0, bottom: 0},
    closeOnScroll: false,
    showHideOpacity: true,
    preload: [3, 3],
    captionEl: false,
    fullscreenEl: true,
    shareEl: false,
    bgOpacity: 0.95,
    tapToClose: false,
    pinchToClose: false,
    closeOnVerticalDrag: false,
    tapToToggleControls: false,
    history: false
  }

  // Initializes and opens PhotoSwipe
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
  var realViewportWidth
  var useImages = ''
  var firstResize = true
  var imageSrcWillChange = false

  gallery.listen('beforeResize', function () {
    // gallery.viewportSize.x - width of PhotoSwipe viewport
    // gallery.viewportSize.y - height of PhotoSwipe viewport
    // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
    //                          1 (regular display), 2 (@2x, retina) ...

    // calculate real pixels when size changes
    realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio

    // Code below is needed if you want image to switch dynamically on window.resize

    // Find out if current images need to be changed
    if (useImages !== 'small' && realViewportWidth < 400) {
      useImages = 'small'
      imageSrcWillChange = true
    } else if (useImages !== 'medium' && realViewportWidth >= 400 && realViewportWidth < 800) {
      useImages = 'medium'
      imageSrcWillChange = true
    } else if (useImages !== 'large' && realViewportWidth >= 800) {
      useImages = 'large'
      imageSrcWillChange = true
    }

    // Invalidate items only when source is changed and when it's not the first update
    if (imageSrcWillChange && !firstResize) {
      // invalidateCurrItems sets a flag on slides that are in DOM,
      // which will force update of content (image) on window.resize.
      gallery.invalidateCurrItems()
    }

    if (firstResize) {
      firstResize = false
    }

    imageSrcWillChange = false
  })

  // gettingData event fires each time PhotoSwipe retrieves image source & size
  gallery.listen('gettingData', function (index, item) {
    // Set image source & size based on real viewport width
    item.src = item[useImages].src
    item.w = item[useImages].w
    item.h = item[useImages].h

    // It doesn't really matter what will you do here,
    // as long as item.src, item.w and item.h have valid values.
    //
    // Just avoid http requests in this listener, as it fires quite often
  })
  gallery.init()
  gallery.listen('destroy', () => {
    $('#header').css('display', '')
    $('#navButton').css('display', 'block')
  })
  $('#header').css('display', 'none')
  $('#navButton').css('display', 'none')
}
$('div.img[data-lightbox]>img').click((e) => openPhotoSwipe(e))
