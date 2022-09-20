// Trying out the inbuilt Javascript navigator object
// declaring global variables for location longitude & latitude
let lat, lon, locate;
const getData = new Promise((resolve, reject) => {
  resolve(
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          position,
          position.coords.latitude,
          position.coords.longitude
        );
        locate = position;
        console.log('locate variable', locate);
      },
      (err) => console.log(err)
    )
  );
  reject((err) => err);
});

getData
  .then(() => {
    console.log('locate let', locate);
  })
  .catch((err) => console.log(err));

// USING AUTOCOMPLETE
function initAutocomplete() {
  let map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 6.5243793, lng: 3.3792057 },
    zoom: 13,
    mapTypeId: 'roadmap',
  });
  // Create the search box and link it to the UI element.
  let input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  const infowindow = new google.maps.InfoWindow({
    content: '<div>This is the map</div>',
  });

  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    let places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry');
        return;
      }
      let icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    infowindow.open({
      anchor: markers,
      map,
      shouldFocus: false,
    });

    map.fitBounds(bounds);
  });
}
window.initAutocomplete = initAutocomplete;
