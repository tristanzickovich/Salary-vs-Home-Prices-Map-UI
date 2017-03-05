<html>
  <head>
    <title>Salary & Home Prices</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="map.js"></script>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <meta http-equiv="Expires" content="0"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
  </head>
  <body>
      <div id="floating-panel">
        <input id="address" type="textbox" value="Park City, Utah">
        <input id="submit" type="button" value="Submit Location">
        <input type="button" value="reset zoom" id="resetZoom"></input>
        <input type="checkbox" name="useMouseCoords" id="mouseLocEnable" checked> Use Mouse Pointer</input>
      </div>
      <div id="infobox" >
        <div id="hideBox">
        <input type="button" id="closeBox" value="close" onclick="hideBox('infobox')"></input>
        </div>
        <div id="changingInfo">
          Choose Location for Information.
        </div>
      </div>
      <div id="map"></div>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap">
    </script>
    <script src="dragBox.js"></script>
  </body>
</html> 
