<html>
  <head>
    <title>Salary & Home Prices</title>
    <link rel="stylesheet" type="text/css" href="style.css">
	<script src="https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js"></script>
	<script src="https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
    <script src="map.js"></script>
    <meta http-equiv="Pragma" content="no-cache"/>
    <meta http-equiv="Expires" content="0"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
  </head>
  <body>
      <div id="floating-panel" class="row">
        <div class="col-xs-4">
        <div class="input-group">
           <input id="address" type="textbox" value="Park City, Utah" class="form-control">
           <div class="input-group-btn">
           <input id="submit" type="button" value="Find Location" class="btn btn-primary">
           </div>
        </div>
        </div>
        <div class="col-xs-4">
        <input type="button" value="reset zoom" id="resetZoom" class="btn btn-default"></input>
        </div>
        <div class="col-xs-4">
        <input type="checkbox" name="useMouseCoords" id="mouseLocEnable" checked> Use Mouse Pointer</input>
        </div>
      </div>
      <div id="color-scale"></div>
      <div id="clabel" >
         <div class="colorinfo" data-toggle="tooltip" data-placement="left" title="<strong><u>Color Scale</u></strong><br><em>blue</em> = missing county data<br><em>green</em> = most affordable<br><em>red</em> = least affordable">
         <strong>affordability scale</strong>
         </div>
      </div>

      <div id="showinfobox" class="hidden">
        <input type="button" value="show state info" id="showStateInfo" class="btn btn-primary" onclick="revealBox('infobox'); hideBox('showinfobox');"></input>
      </div>
      <div id="infobox" >
        <div id="hideBox">
        <input type="button" id="closeBox" value="close" class="btn btn-outline-danger btn-sm" onclick="hideBox('infobox'); revealBox('showinfobox');"></input>
        </div>
        <div id="changingInfo">
			<table class="table">
            <tr>
               <th id="state" colspan="2">State Info</th>
            </tr>
           <tr>
               <td>Average Salary</td>
               <td id="stateSalary">Salary</td>
				</tr>
				<tr>
					<td>Average Home Cost</td>
					<td id="stateHomeCost">Cost</td> 
				</tr>
			</table>
        </div>
      </div>
      <div id="map"></div>
      <div id="county"></div>
      <div id="state"></div>
      <div id="ctycoords"></div>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKA23rhJflpJuTo_vEydWjjx1p6kWaWKo&callback=initMap">
    </script>
    <script src="dragBox.js"></script>
    <script>
    $(document).ready(function(){
       $('[data-toggle=tooltip]').tooltip({html:true});
    });
   </script>
  </body>
</html> 
