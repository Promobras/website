/* global google */
var map = []
var marker = []
/* eslint-disable no-unused-vars */
function initMaps () {
  /* eslint-enable no-unused-vars */
  $('.map').each(function (index) {
    var coords = {lat: -12.6346871, lng: -58.2792325}
    var displayMarker = false
    var zoom = 4
    var lat = parseFloat($(this).attr('data-lat'))
    var lng = parseFloat($(this).attr('data-lng'))
    var zoomAttr = parseInt($(this).attr('data-zoom'))
    var showMarker = $(this).attr('data-showmarker')
    if (lat && lng) {
      coords = {lat: lat, lng: lng}
      displayMarker = true
      if (zoomAttr) {
        zoom = zoomAttr
      }
    }

    var mapTypeId = $(this).attr('data-maptype')
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
    if (showMarker && displayMarker) {
      marker[index] = new google.maps.Marker({
        position: coords,
        map: map[index]
      })
    }

    var placeId = $(this).attr('data-placeid')
    if (placeId) {
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode({'placeId': placeId}, function (results, status) {
        if (status === 'OK' && results[0]) {
          if (zoomAttr) {
            map[index].setZoom(zoomAttr)
          }
          map[index].setCenter(results[0].geometry.location)
          if (showMarker) {
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
        }
      })
    }
    var mapId = $(this).attr('data-mapid')
    if (mapId) {
      var preserveViewport = (showMarker || placeId)
      var kmlLayer = new google.maps.KmlLayer({
        url: 'https://www.google.com/maps/d/u/0/kml?mid=' + mapId,
        suppressInfoWindows: false,
        map: map[index],
        preserveViewport: preserveViewport
      })
    }
  })
}
