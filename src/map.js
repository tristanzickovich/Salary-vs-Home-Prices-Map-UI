//runs when mouse pointer click enabled
function geocodeLatLng(geocoder, map, infowindow, coords) {
  var latlngStr = coords.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        var address = results[1].formatted_address;
        updateInfo(address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

//returns mouse coords
function retrieveCoordinates(pnt) {
    var lat = pnt.lat();
    lat = lat.toFixed(8);
    var lng = pnt.lng();
    lng = lng.toFixed(8);
    return lat + ',' + lng;
}

function initMap() {
  //defines google map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 39.8282, lng: -98.5795}, //set to center of U.S.
    clickableIcons: false //disable clickable landmarks
  });

  //defines geocoder
  var geocoder = new google.maps.Geocoder();
  //defines infowindow
  var infowindow = new google.maps.InfoWindow;

  //reset map zoom
  document.getElementById('resetZoom').addEventListener('click', function() {
    map.setZoom(5);
    map.setCenter({lat: 39.8282, lng: -98.5795});
  });

  //click map actions
  google.maps.event.addListener(map, 'click', function(event) {
    var useMouse = document.getElementById("mouseLocEnable").checked;
    if(useMouse){
      var coords = retrieveCoordinates(event.latLng);
      geocodeLatLng(geocoder, map, infowindow, coords);
      revealBox('infobox');
    } 
  });

  //if location is submit with button
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
    revealBox('infobox');
  });

  /*//if box checked, use mouse lat & long
  google.maps.event.addListener(map, 'mousemove', function (event) {
    var useMouse = document.getElementById("mouseLocEnable").checked;
    if(useMouse){
      var coords = retrieveCoordinates(event.latLng);
      geocodeLatLng(geocoder, map, infowindow, coords);
    }             
  });*/
}

//runs if location typed/submitted in search box
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setZoom(11);
      resultsMap.setCenter(results[0].geometry.location);
      /*var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
        title: address
      });
      //message for marker hover
      var markerMessage = '<div class="infomsg">This is '+address+'</div>';
      //define hover message window
      var infowindow = new google.maps.InfoWindow({});
      //if cursor hovers over marker
      google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(markerMessage);
        infowindow.open(map,marker);
      });
      //if cursor leaves marker
      google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close(map,marker.title);
        infowindow.setContent('');
      });*/
      updateInfo(address);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

//changes infobox data displayed
function updateInfo(address){
  var elem = document.getElementById('changingInfo');
  elem.innerHTML = "Salary & Housing Data For " + address + "<br>";
  elem.innerHTML += "Average Salary: <br/>";
  elem.innerHTML += "Average Home Cost: <br/>";
}