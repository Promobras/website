/* global google */
var map = []
var marker = []
/* eslint-disable no-unused-vars */
function initMaps () {
  /* eslint-enable no-unused-vars */
  $('.map').each(function (index) {
    var coords = {lat: -12.6346871, lng: -58.2792325}
    var showMarker = false
    var zoom = 4
    var lat = parseFloat($(this).attr('data-lat'))
    var lng = parseFloat($(this).attr('data-lng'))
    var zoomAttr = parseInt($(this).attr('data-zoom'))
    if (lat && lng) {
      coords = {lat: lat, lng: lng}
      showMarker = true
      if (zoomAttr) {
        zoom = zoomAttr
      }
    }

    var mapTypeId = $(this).attr('data-maptype')
    console.log(mapTypeId)
    if (!mapTypeId) {
      mapTypeId = 'roadmap'
    }

    var id = 'map' + index
    $(this).attr('id', id)

    map[index] = new google.maps.Map(document.getElementById(id), {
      zoom: zoom,
      center: coords,
      mapTypeId: mapTypeId
    })
    if (showMarker) {
      marker[index] = new google.maps.Marker({
        position: coords,
        map: map[index]
      })
    }

    var kmlLayer = new google.maps.KmlLayer({
      url: 'https://www.google.com/maps/d/u/0/kml?mid=1aud-1M9f3UURW3IakSwaY5HU1Tg',
      suppressInfoWindows: false,
      map: map[index]
    })
    console.log(kmlLayer)

    var placeId = $(this).attr('data-placeid')
    if (placeId) {
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode({'placeId': placeId}, function (results, status) {
        console.log(results)
        if (status === 'OK' && status[0]) {
          if (zoomAttr) {
            map[index].setZoom(zoomAttr)
          }
          map[index].setCenter(results[0].geometry.location)
          if (marker[index]) {
            marker[index].setPlace({
              placeId: placeId,
              location: results[0].geometry.location
            })
          } else {
            marker[index] = new google.maps.Marker({
              map: map[index],
              placeId: placeId,
              position: results[0].geometry.location
            })
          }
        }
      })
    }
  })
}
