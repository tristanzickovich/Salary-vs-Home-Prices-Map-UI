//sets up map
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

  //reset map zoom when button clicked
  document.getElementById('resetZoom').addEventListener('click', function() {
    map.setZoom(5);
    map.setCenter({lat: 39.8282, lng: -98.5795});
  });

  //CURRENTLY NOT USED BECAUSE OF OVERLAYS 
  //if map clicked, display info for location clicked
  google.maps.event.addListener(map, 'click', function(event) {
    var useMouse = document.getElementById("mouseLocEnable").checked;
    if(useMouse){
      var coords = retrieveCoordinates(event.latLng);
      geocodeLatLng(geocoder, map, infowindow, coords);
      revealBox('infobox');
    } 
  });

  //if location is submit with button, displays info
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map, infowindow);
    revealBox('infobox');
  });

  //enables overlay counties & functionality
  parseCounties(infowindow, map);
}

//creates/controls each individual county overlay
function overlayCounties(infowindow, map, ctyname, state, ctycoords){

	//content displayed inside info bubble
	var message = '<div id="ctymsg">'+ctyname+' '+state+'</div>';
	//parseed boundary coordinates for polygon
	var countyCoords = overlayCoords(ctycoords);

	// Construct the polygon of county
	var county = new google.maps.Polygon({
	  paths: countyCoords,
	  strokeColor: '#FF0000',
	  strokeOpacity: 0,
	  strokeWeight: 2,
	  fillColor: '#FF0000',
	  fillOpacity: 0
	});

	//draws county overlay on map
	county.setMap(map);

	//if cursor hovers over county overlay
	google.maps.event.addListener(county, 'mouseover', function(event) {
		//make county overlay visible
		county.setOptions({fillOpacity: 0.35, strokeOpacity: 0.8}); 
	});

	//if cursor leaves county overlay
	google.maps.event.addListener(county, 'mouseout', function() {
		//make county overlay invisible
		county.setOptions({fillOpacity: 0, strokeOpacity: 0}); 
	});

	//if click county overlay 
   google.maps.event.addListener(county, 'click', function(event) {
		//caclulates location for infoWindow based on click location
		var coords = retrieveCoordinates(event.latLng);
		var latlngStr = coords.split(',', 2);
	   var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
		
		//sets info window message, position, and displays on map
		infowindow.setContent(message);
		infowindow.setPosition(latlng);
		infowindow.open(map);
   });
}

//sends each county info to overlayCounties() to be drawn
function parseCounties(infowindow, map){
	//reads county outline lat/long data
	var file = "./cutcounty.json";
	var rawFile = new XMLHttpRequest(), json;
	rawFile.onreadystatechange = function ()
	{
		 if(rawFile.readyState === 4)
		 {
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				//parses string, sends county name, stat, and county coords to be drawn: all counties
				json = JSON.parse(rawFile.responseText);
				for(var i = 1;i < json.length; ++i){
					var countyName = json[i].FIELD1;
					var state = json[i].FIELD2;
					var coords = json[i].FIELD3;
					overlayCounties(infowindow, map, countyName, state, coords);	
				}
			}
		 }
	};
	rawFile.open("GET", file, true);
	rawFile.send();
}

//formats county lat/long for google maps polygon outline
function overlayCoords(curLatLng){
	var indexed = curLatLng.split(" ");	
	var bounds = [];
	for(var i = 0; i < indexed.length; ++i){
		var c = indexed[i].split(",");
		console.log(c);
		bounds.push(new google.maps.LatLng(c[1], c[0]));
	}
	return bounds;
}

//CURRENTLY DOESN'T GET USED BECAUSE OF OVERLAYS
//shows info based on location clicked on map
function geocodeLatLng(geocoder, map, infowindow, coords) {
  var latlngStr = coords.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {

		//if clicked on land
      if (results[1]) {
			//address of location clicked
			var addr = results[1].formatted_address;

			//message displayed in info window
			var markerMessage = '<div class="infomsg">'+addr+'</div>';

			//sets infowindow up and places on map
			infowindow.setContent(markerMessage);
			infowindow.setPosition(results[0].geometry.location);
			infowindow.open(map);
			
			//sends info to info box	
			updateInfo(addr);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

//runs if location typed/submitted in search box
function geocodeAddress(geocoder, resultsMap, infowindow) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      //resultsMap.setZoom(11);
      //resultsMap.setCenter(results[0].geometry.location);
      var markerMessage = '<div class="infomsg">'+address+'</div>';
      infowindow.setContent(markerMessage);
		infowindow.setPosition(results[0].geometry.location);
		infowindow.open(resultsMap);
      updateInfo(address);
    }
	 else {
      alert('Geocode was not successful for the following reason: ' + status);
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

//updates infobox data displayed
function updateInfo(address){
  var elem = document.getElementById('changingInfo');
  elem.innerHTML = "Salary & Housing Data For " + address + "<br>";
  elem.innerHTML += "Average Salary: <br/>";
  elem.innerHTML += "Average Home Cost: <br/>";
}

