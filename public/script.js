/*global unescape: true */

/*exported addSearchLocation */
/*exported fMinuteTimeChanged */
/*exported fMinPriceChanged */
/*exported fMaxPriceChanged */

var map;

var directionsService;

var FlatMarkers = [];
var aoSearchPointAddress = [];

var uiFlatMarkersIndex = 0;
var uiSearchPointAddressIndex = 0;

// http://localhost:5000/?city=montreal&pricemin=600&travelmode=walking&timemax=30&lat=45.525&long=-73.55

var infowindow;
var uiInputPriceMin = 0;
var uiInputPriceMax = 0;

var document;
var google;
var window;

var aLatLong = [];
var oLatLongCenter;
var uiPointIndex;
var oCurrentLat;
var oCurrentLong;

var oPolyline;
var aoSearchPointAddress;

/***************************************************************************************\

Function:       fUpdateDisplay

Description:    Update

Parameters:     oFlatMarker.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fUpdateDisplay(oFlatMarker) {
	"use strict";

	var bDistanceValid = false;

	for (var a = 0; a < oFlatMarker.IsDistanceValid.length; a++) {
		if (oFlatMarker.IsDistanceValid[a] === true) {
			bDistanceValid = true;
		}
	}

	if (document.getElementById("CheckBoxHide").checked === true) {
		if ((bDistanceValid === true) && (oFlatMarker.IsPriceValid === true)) {
			oFlatMarker.marker.setMap(map);
		} else {
			oFlatMarker.marker.setMap(null);
		}
	} else {
		oFlatMarker.marker.setMap(map);
	}
}

/***************************************************************************************\

Function:       fUpdateDisplayAll

Description:    TODO

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fUpdateDisplayAll() {
	"use strict";

	for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) {
		fUpdateDisplay(FlatMarkers[uiFlatIndex]);
	}
}

/***************************************************************************************\

Function:       fFilterByDistance

Description:    Filter the raw postal array with maximum walking distance.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fFilterByDistance() {
	"use strict";

	console.log("*****************************");
	console.log("fFilterByDistance");
	// console.log(Polyline);
	console.log("length = " + oPolyline.getPath().length);
	console.log("getPath = " + oPolyline.getPath());

	// bermudaTriangle.setMap(map);
	oPolyline.setMap(map);

	for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) {
		console.log("Position = " + FlatMarkers[uiFlatIndex].marker.getPosition());

		var bDistanceValid = google.maps.geometry.poly.containsLocation(
			FlatMarkers[uiFlatIndex].marker.getPosition(),
			oPolyline);
		console.log("uiFlatIndex#" + uiFlatIndex + " - bDistanceValid = " + bDistanceValid);
		FlatMarkers[uiFlatIndex].IsDistanceValid[0] = google.maps.geometry.poly.containsLocation(
			FlatMarkers[uiFlatIndex].marker.getPosition(),
			oPolyline);
	}
}

/***************************************************************************************\

Function:       fDrawSearchPolygon

Description:    TODO

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fDrawSearchPolygon() {
	"use strict";

	var uiRadius = 0.01;
	var uiPrecision = 10; //18
	var uiAngle = (360 * (uiPointIndex / uiPrecision)) * (Math.PI / 180);

	aLatLong[uiPointIndex] = new google.maps.LatLng(
		oCurrentLat + (uiRadius) * Math.sin(uiAngle),
		oCurrentLong + (uiRadius) * Math.cos(uiAngle)
	);

	var selectedMode = document.getElementById('TravelMode').value;

	var request = {
		origin: oLatLongCenter,
		destination: aLatLong[uiPointIndex],
		travelMode: google.maps.TravelMode[selectedMode]
	};

	// Route the directions and pass the response to a function to create markers for each step.
	directionsService.route(request, function(response, status) {
		console.log("*******************************");
		console.log("uiPointIndex = " + uiPointIndex);

		if (status === google.maps.DirectionsStatus.OK) {
			// Compute road duration.
			var Duration = 0;

			var legs = response.routes[0].legs;

			for (var k = 0; k < legs.length; k++) {
				Duration += legs[k].duration.value;
			}

			// Check direction
			var uiMaxTimeS = document.getElementById("inputMinuteDelayText").value * 60;

			console.log("Duration   = " + Duration);
			console.log("uiMaxTimeS = " + uiMaxTimeS);

			var uiNewRadius = 0;

			if (Duration <= uiMaxTimeS) {
				// Need to increase the radius.
				console.log("Duration <= uiMaxTimeS");
				uiNewRadius = (uiRadius * uiMaxTimeS) / Duration;
				console.log("uiNewRadius = " + uiNewRadius);
			} else {
				// Need to reduce the radius.
				console.log("Duration > uiMaxTimeS");
				uiNewRadius = (uiRadius * uiMaxTimeS) / Duration;
				console.log("uiNewRadius = " + uiNewRadius);
			}

			aLatLong[uiPointIndex] = new google.maps.LatLng(
				oCurrentLat + (uiNewRadius) * Math.sin(uiAngle),
				oCurrentLong + (uiNewRadius) * Math.cos(uiAngle)
			);

			uiPointIndex++;

			if (uiPointIndex <= uiPrecision) {
				setTimeout(function() {
					fDrawSearchPolygon();
				}, (350));
			} else {
				// Construct the polygon.
				/* bermudaTriangle = new google.maps.Polygon(
				{
				paths:          aLatLong,
				strokeColor:    '#FF0000',
				strokeOpacity:  0.8,
				strokeWeight:   2,
				fillColor:      '#FF0000',
				fillOpacity:    0.35
			}); */

				oPolyline = new google.maps.Polyline(
					// oPolyline = new google.maps.Polygon(
					{
						path: aLatLong,
						strokeColor: "#FF0000",
						strokeOpacity: 0.8,
						strokeWeight: 2
					});

				// bermudaTriangle.setMap(map);
				// oPolyline.setMap(map);

				fFilterByDistance();

				fUpdateDisplayAll();
			}
		} else {
			if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				console.log("DirectionServiceCallback " + status);
				setTimeout(function() {
					fDrawSearchPolygon();
				}, (600 * 3));
			}
		}
	});
}

/***************************************************************************************\

Function:           fSetAMarkerOnMap

Description:        Set a marker on the map.

Parameters:         address            Given address to place.

Return Value:       None.

Comments:           None.

\***************************************************************************************/
function fBuildMarker(oLatLng, oMarker, url, image, isDragable) {
	"use strict";

	if (isDragable) {
		google.maps.event.addListener(oMarker, 'dragend', function(event) {
			oPolyline.getPath().clear();
			// oPolyline.setPath([]);
			oPolyline.setMap(null);

			oCurrentLat = event.latLng.lat();
			oCurrentLong = event.latLng.lng();

			oLatLongCenter = new google.maps.LatLng(oCurrentLat, oCurrentLong);

			uiPointIndex = 0;

			fDrawSearchPolygon();
		});

		oMarker.setDraggable(isDragable);
		oMarker.setTitle('Drag me !! ');
	}

	oMarker.setAnimation(google.maps.Animation.DROP);
	oMarker.setPosition(oLatLng);
	oMarker.setMap(map);

	if (isDragable === false) {
		if (url !== null) {
			google.maps.event.addListener(oMarker, 'click', function() {
				infowindow.setContent(
					'<div style="width:300px; height:325px">' +
					'<div align="center">' +
					'<img src="' + image + '" width="225" height="300" ALIGN="middle" />' +
					'</div>' +
					'<div align="center">' +
					'<a href="' + url + '">' + '' + url + '</a> ' +
					'</div>' +
					'</div>');
				infowindow.open(map, this);
			});
		}
	}
}

/***************************************************************************************\

Function:       update

Description:    Update

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function update() {
	"use strict";

	uiFlatMarkersIndex = 0;
	uiSearchPointAddressIndex = 0;

	fFilterByDistance();
}

/***************************************************************************************\

Function:       fSetAMarkerOnMapValidFlat

Description:    Set a marker on the map of a flat.

Parameters:     address            Given address to place.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fSetAMarkerOnMapValidFlat(oLatLng, i, url, image) {
	"use strict";

	fBuildMarker(oLatLng, FlatMarkers[i].marker, url, image, false);
}

/***************************************************************************************\

Function:       fSetAllMarkerOnMapFlatFiltered

Description:    Set all marker on the map of the filtered flat.

Parameters:     TODO

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fSetAllMarkerOnMapFlatFiltered(data, oFlatPrice) {
	"use strict";

	for (var i = 0; i < data.length; i++) {
		if (data[i].price < oFlatPrice.Min) {
			oFlatPrice.Min = data[i].price;
		}

		if (data[i].price > oFlatPrice.Max) {
			oFlatPrice.Max = data[i].price;
		}

		var oLatLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);

		fSetAMarkerOnMapValidFlat(oLatLng, i, data[i]._id, data[i].image, data.Price);
	}
}


/***************************************************************************************\

Function:       fFilterByPrice

Description:    Adds a search marker/location in the map.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fFilterByPrice(oFlatMarker) {
	"use strict";

	if (oFlatMarker.Price < uiInputPriceMin) {
		oFlatMarker.IsPriceValid = false;
	} else if (oFlatMarker.Price > uiInputPriceMax) {
		oFlatMarker.IsPriceValid = false;
	} else {
		oFlatMarker.IsPriceValid = true;
	}
}


/***************************************************************************************\

Function:       Initialize

Description:    Initialize all services.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function initialize() {
	"use strict";

	document.getElementById("CheckBoxHide").checked = true;

	//
	// Instantiate a directions service.
	//
	directionsService = new google.maps.DirectionsService();

	var args = document.location.search.substring(1).split('&');

	var argsParsed = {};

	for (var i = 0; i < args.length; i++) {
		var arg = unescape(args[i]);

		if (arg.indexOf('=') === -1) {
			argsParsed[arg.trim()] = true;
		} else {
			var kvp = arg.split('=');
			argsParsed[kvp[0].trim()] = kvp[1].trim();
		}
	}

	var oCityCoord;
	var uiZoom;

	if (argsParsed.city === "montreal") {
		oCityCoord = new google.maps.LatLng(45.506, -73.556);
		uiZoom = 12;
	} else {
		// default
		oCityCoord = new google.maps.LatLng(45.506, -73.556);
		uiZoom = 12;
	}

	//
	// Create a map and center it on the city.
	//
	var mapOptions = {
		zoom: uiZoom,
		center: oCityCoord,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	//
	// Load map
	//
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//
	// Set markers
	//
	infowindow = new google.maps.InfoWindow();

	var oFlatPrice = {
		Min: 99999999,
		Max: 0
	};

	uiInputPriceMin = oFlatPrice.Min;
	uiInputPriceMax = oFlatPrice.Max;

	$(document).ready(function() {
		$.get("api/flats", function(data, status) {

			console.log("Status = " + status);

			for (var i = 0; i < data.length; i++) {
				var DistanceValid = [];

				DistanceValid[0] = true;

				if (data[i].price === null) {
					data[i].price = 0;
				}

				var oMarker = {
					IsPriceValid: true,
					IsDistanceValid: DistanceValid,
					Price: data[i].price,
					marker: new google.maps.Marker(),
					uSource: data[i].source,
					pinColorNotValid: data[i].colornotvalid,
				};

				FlatMarkers.push(oMarker);
			}

			fSetAllMarkerOnMapFlatFiltered(data, oFlatPrice);

			if (argsParsed.pricemin === undefined) {
				document.getElementById("inputMinimumText").value = oFlatPrice.Min;
			} else {
				document.getElementById("inputMinimumText").value = argsParsed.pricemin;
				oFlatPrice.Min = argsParsed.pricemin;
			}

			if (argsParsed.pricemax === undefined) {
				document.getElementById("inputMaximumText").value = oFlatPrice.Max;
			} else {
				document.getElementById("inputMaximumText").value = argsParsed.pricemax;
				oFlatPrice.Max = argsParsed.pricemax;
			}

			uiInputPriceMin = oFlatPrice.Min;
			uiInputPriceMax = oFlatPrice.Max;

			for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) {
				fFilterByPrice(FlatMarkers[uiFlatIndex]);
				fUpdateDisplay(FlatMarkers[uiFlatIndex]);
			}

			if (argsParsed.timemax !== undefined) {
				document.getElementById("inputMinuteDelayText").value = argsParsed.timemax;
			}

			if (argsParsed.travelmode !== undefined) {
				if (argsParsed.travelmode === "driving") {
					document.getElementById('TravelMode').value = "DRIVING";
				} else if (argsParsed.travelmode === "walking") {
					document.getElementById('TravelMode').value = "WALKING";
				} else if (argsParsed.travelmode === "bicycling") {
					document.getElementById('TravelMode').value = "BICYCLING";
				} else if (argsParsed.travelmode === "transit") {
					document.getElementById('TravelMode').value = "TRANSIT";
				}
			}

			if ((argsParsed.long !== undefined) && (argsParsed.lat !== undefined)) {
				var oCustLatLng = new google.maps.LatLng(argsParsed.lat, argsParsed.long);

				var oMarkerSearchPoint = {
					marker: new google.maps.Marker()
				};

				var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "B8B8B8",
					new google.maps.Size(21, 34),
					new google.maps.Point(0, 0),
					new google.maps.Point(10, 34));

				oMarkerSearchPoint.marker.setIcon(pinImage);

				aoSearchPointAddress.push(oMarkerSearchPoint);

				fBuildMarker(oCustLatLng, oMarkerSearchPoint.marker, null, null, true);

				update();
			}

		});
	});
}


/***************************************************************************************\

Function:       addSearchLocation

Description:    Adds a search marker/location in the map.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function addSearchLocation() {
	"use strict";

	oCurrentLat = 45.526;
	oCurrentLong = -73.564;
	oLatLongCenter = new google.maps.LatLng(oCurrentLat, oCurrentLong);

	var oMarkerSearchPoint = {
		marker: new google.maps.Marker()
	};

	var pinImage = new google.maps.MarkerImage(
		"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "B8B8B8",
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34)
	);

	oMarkerSearchPoint.marker.setIcon(pinImage);

	aoSearchPointAddress.push(oMarkerSearchPoint);

	fBuildMarker(oLatLongCenter, oMarkerSearchPoint.marker, null, null, true);

	uiPointIndex = 0;

	fDrawSearchPolygon();

	update();
}

/***************************************************************************************\

Function:       fMinuteTimeChanged

Description:    Adds a search marker/location in the map.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fMinuteTimeChanged() {
	"use strict";

	update();

	for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) {
		fUpdateDisplay(FlatMarkers[uiFlatIndex]);
	}
}

/***************************************************************************************\

Function:       fMinPriceChanged

Description:    Adds a search marker/location in the map.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fMinPriceChanged() {
	"use strict";

	uiInputPriceMin = document.getElementById("inputMinimumText").value;

	for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) {
		fFilterByPrice(FlatMarkers[uiFlatIndex]);
		fUpdateDisplay(FlatMarkers[uiFlatIndex]);
	}
}

/***************************************************************************************\

Function:       fMaxPriceChanged

Description:    Adds a search marker/location in the map.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fMaxPriceChanged() {
	"use strict";

	uiInputPriceMax = document.getElementById("inputMaximumText").value;

	for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) {
		fFilterByPrice(FlatMarkers[uiFlatIndex]);
		fUpdateDisplay(FlatMarkers[uiFlatIndex]);
	}
}

//-----------------------------------------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------------------------------------
google.maps.event.addDomListener(window, 'load', initialize);
