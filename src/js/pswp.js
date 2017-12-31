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
    var abr = [
      150,
      400,
      800,
      1280,
      1920
    ]
    var dpr = window.devicePixelRatio
    let item = {
      msrc: value.src
    }
    let srcwidth = parseInt($(value).attr('data-srcwidth'))
    let srcheight = parseInt($(value).attr('data-srcheight'))
    let ratio = srcheight / srcwidth
    for (let i = 0; i < abr.length; i++) {
      let versionWidth = Math.min(srcwidth, abr[i] * dpr)
      let itemInfo = {
        src: src.replace('w_auto', 'w_' + versionWidth).replace(',dpr_auto', ''),
        w: versionWidth,
        h: versionWidth * ratio
      }
      item['w_' + (abr[i] * dpr)] = itemInfo
    }
    item['w_' + srcwidth] = {
      src: src.replace('w_auto', 'w_' + srcwidth).replace(',dpr_auto', ''),
      w: srcwidth,
      h: srcwidth * ratio
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
    realViewportWidth = gallery.viewportSize.x * dpr

    // Code below is needed if you want image to switch dynamically on window.resize

    // Find out if current images need to be changed
    for (let i = 0; i < abr.length; i++) {
      let j = i - 1
      let widthLabel = abr[i] * dpr
      let upperWidth = 99999999
      if (i < (abr.length - 1)) {
        upperWidth = abr[i] * dpr
      }
      let lowerWidth = 0
      if (i > 0) {
        lowerWidth = abr[j] * dpr
      }
      if (useImages !== 'w_' + widthLabel && realViewportWidth >= lowerWidth && realViewportWidth < upperWidth) {
        useImages = 'w_' + widthLabel
        imageSrcWillChange = true
      }
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
