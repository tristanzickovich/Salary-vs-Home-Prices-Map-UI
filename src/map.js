//sets up map
function initMap() {
  //defines google map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 39.8282, lng: -98.5795}, //set to center of U.S.
    clickableIcons: false, //disable clickable landmarks
	 maxZoom: 10,
	 minZoom: 4,
	 disableDoubleClickZoom: true
  });

  //defines geocoder
  var geocoder = new google.maps.Geocoder();

  //defines infowindow
  var infowindow = new google.maps.InfoWindow;
  infowindow.open(map);

  //reset map zoom when button clicked
  document.getElementById('resetZoom').addEventListener('click', function() {
    map.setZoom(5);
    map.setCenter({lat: 39.8282, lng: -98.5795});
  });

  //CURRENTLY NOT USED WITH OVERLAYS 
  //if map clicked, display info for location clicked
  google.maps.event.addListener(map, 'click', function(event) {
    var useMouse = document.getElementById("mouseLocEnable").checked;
    if(useMouse){
      var coords = retrieveCoordinates(event.latLng);
      geocodeLatLng(geocoder, map, infowindow, coords);
    } 
  });

  //if location is submit with button, displays info
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map, infowindow);
  });

  //enables overlay counties & functionality
  parseCounties(infowindow, map);
}

//creates/controls each individual county overlay
function overlayCounties(infowindow, map, ctyname, state, ctycoords, ctySalary, stateSalary, stateHome, countyHome){
   var salary = ctySalary; var home = countyHome; 
   if(isNaN(ctySalary))
      salary = stateSalary+'*';
   if(isNaN(countyHome))
      home = stateHome+'*';
	//content displayed inside info bubble
	var message = '<div id="ctymsg"><strong><u>County Data</u></strong><br>County: '+ctyname+', '+state+' <br>Median Salary: $'+salary+'<br>Home Cost: $'+home+'</div>';

	//swith state abbreviation to full name
	state = abbrState(state);

	//parsed boundary coordinates for polygon
	var countyCoords = overlayCoords(ctycoords);
   
	//caclulate color for overlay
   var color = calcAffordability(ctySalary, countyHome);

	// Construct the polygon of county
	var county = new google.maps.Polygon({
	  paths: countyCoords,
	  strokeColor: color,
	  strokeOpacity: 0,
	  strokeWeight: 2,
	  fillColor: color,
	  fillOpacity: 0
	});

	//draws county overlay on map
	county.setMap(map);

   //if cursor enters county overlay, update state box 
	google.maps.event.addListener(county, 'mousemove', function(event) {
      var useMouse = document.getElementById("mouseLocEnable").checked;
      if(useMouse)
         updateInfo(state, stateSalary, stateHome);
	});


	//if cursor hovers over county overlay
	google.maps.event.addListener(county, 'mousemove', function(event) {
      var useMouse = document.getElementById("mouseLocEnable").checked;
      if(useMouse){
         //make county overlay visible
         county.setOptions({fillOpacity: 0.35, strokeOpacity: 0.8}); 

         //caclulates location for infoWindow based on click location
         var coords = retrieveCoordinates(event.latLng);
         var latlngStr = coords.split(',', 2);
         var latlng = {lat: parseFloat(latlngStr[0])+markerOffset(map), lng: parseFloat(latlngStr[1])};

         //sets infowindow message and position
         infowindow.setContent(message);
         infowindow.setPosition(latlng);
      }
	});

	//if cursor leaves county overlay
	google.maps.event.addListener(county, 'mouseout', function() {
		//make county overlay invisible
      var useMouse = document.getElementById("mouseLocEnable").checked;
      if(useMouse)
         county.setOptions({fillOpacity: 0, strokeOpacity: 0}); 
	});
}

function markerOffset(map){
	var zoom = map.getZoom();
	var mult = 1;
	if(zoom > 8) mult = 2;
	else if(zoom > 6) mult = 1.1;
	else if(zoom > 5) mult = .7;
	else mult = .5;
	return (1/(zoom * mult));
}

//sends each county info to overlayCounties() to be drawn
function parseCounties(infowindow, map){
	//reads county outline lat/long data
	var file = "./finalfile.json";
	var rawFile = new XMLHttpRequest(), json;
	rawFile.onreadystatechange = function ()
	{
		 if(rawFile.readyState === 4)
		 {
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				//parses string, sends county name, stat, and county coords to be drawn: all counties
				json = JSON.parse(rawFile.responseText);
				for(var i = 0;i < json.length; ++i){
					var countyName = json[i].county;
					var countySalary= json[i].medianSalary;
               var countyHome = json[i].countyHomePrice;
					var state = json[i].state;
					var coords = json[i].geometry;
					var stateSalary = json[i].avgStateSalary;
					var stateHome = json[i].avgHomePrice;
               overlayCounties(infowindow, map, countyName, state, coords, countySalary, stateSalary, stateHome, countyHome);	
				}
			}
		 }
	};
	rawFile.open("GET", file, true);
	rawFile.send();
}

//CURRENTLY NOT USED WITH OVERLAYS
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
      resultsMap.setZoom(10);
      resultsMap.setCenter(results[0].geometry.location);
    }
	 else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

//******** Helper Functions ********//

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

//chooses color based on salary to home comparison
function calcAffordability(salary, home){
   if(isNaN(salary) || isNaN(home))
      return '#1FEAED';
   else if((salary * 2.5) > home){
      return '#26F70A';
   }
   else if((salary * 3) > home){
      return '#C8F70A';
   }
   else if((salary * 3.5) > home){
      return '#FFFF12';
   }
   else if((salary * 4) > home){
      return '#FFA600';
   }
   else{
      return '#FF0011';
   }
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
function updateInfo(state, medSalary, avgHomeCost){
  var curState = document.getElementById('state');
  var curStateSalary = document.getElementById('stateSalary');
  var curStateHomeCost = document.getElementById('stateHomeCost');
  curState.innerHTML = "State Data: " + state;
  curStateSalary.innerHTML = "$" + medSalary;
  curStateHomeCost.innerHTML = "$" + avgHomeCost;
}

function abbrState(input){
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

	  input = input.toUpperCase();
	  for(i = 0; i < states.length; i++){
			if(states[i][1] == input){
				 return(states[i][0]);
			}
	  }    
}
