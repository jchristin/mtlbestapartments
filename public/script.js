/*global $, google, document */
/*global MarkerClusterer */

/*exported addSearchLocation */

var searchPolygon = null;

/**************************************************************************\

Object:       	markerObj

Description:    Base marker object.

Parameters:     latitude.
longitude
map

Return Value:   None.

Comments:       None.

\**************************************************************************/
var markerObj = function(latitude, longitude, map) {
	"use strict";

	this.map_ = map;

	/*jshint validthis:true */

	// Create the marker.
	this.mapMarker = new google.maps.Marker();
	this.mapMarker.setAnimation(google.maps.Animation.DROP);
	this.mapMarker.setPosition(new google.maps.LatLng(latitude, longitude));
};

/**************************************************************************\

Function:       getMarker

Description:    Gets the google map marker.

Parameters:     None.

Return Value:   None.

Comments:       None.

\**************************************************************************/
markerObj.prototype.getMarker = function() {
	"use strict";
	return this.mapMarker;
};

/**************************************************************************\

Function:       Show

Description:    SHow the marker.

Parameters:     None.

Return Value:   None.

Comments:       None.

\**************************************************************************/
markerObj.prototype.show = function() {
	"use strict";
	return this.mapMarker.setMap(this.map);
};

/**************************************************************************\

Function:       hide

Description:    Hides the marker.

Parameters:     None.

Return Value:   None.

Comments:       None.

\**************************************************************************/
markerObj.prototype.hide = function() {
	"use strict";
	return this.mapMarker.setMap(null);
};

/**************************************************************************\

Object:       	markerFlatObj

Description:    Flat marker object.

\**************************************************************************/
var markerFlatObj = function(lat, lng, map, source, price, infowindow, url, image) {
	"use strict";

	this.source = source;
	this.price = price;
	this.isDistanceValid = true;
	this.isPriceValid = true;
	this.markerBase = new markerObj(lat, lng, map);

	google.maps.event.addListener(this.markerBase.getMarker(), 'click', function() {
		infowindow.setContent(
			'<div style="width:300px; height:325px">' +
			'<div align="center">' +
			'<img src="' + image + '" width="225" height="300" ALIGN="middle" />' +
			'</div>' +
			'<div align="center">' +
			'<a href="' + url + '">' + '' + url + '</a> ' +
			'</div>' +
			'</div>'
		);

		infowindow.open(map, this);
	});
};

markerFlatObj.prototype.getMarker = function() {
	"use strict";
	return this.markerBase.getMarker();
};

markerFlatObj.prototype.getSource = function() {
	"use strict";
	return this.source;
};

markerFlatObj.prototype.getPrice = function() {
	"use strict";
	return this.price;
};

markerFlatObj.prototype.show = function() {
	"use strict";
	return this.markerBase.show();
};

markerFlatObj.prototype.setDistanceValid = function(isDistanceValid) {
	"use strict";
	this.isDistanceValid = isDistanceValid;
};

markerFlatObj.prototype.IsDistanceValid = function() {
	"use strict";
	return this.isDistanceValid;
};

markerFlatObj.prototype.setPriceValid = function(isPriceValid) {
	"use strict";
	this.isPriceValid = isPriceValid;
};

markerFlatObj.prototype.IsPriceValid = function() {
	"use strict";
	return this.isPriceValid;
};

markerFlatObj.prototype.IsValid = function() {
	"use strict";
	return ((this.isDistanceValid === true) && (this.isPriceValid === true));
};

/**************************************************************************\

Object:       	markerSearchObj

Description:    Search marker object.

\**************************************************************************/
var markerSearchObj = function(lat, lng, map, travelType, radiusDelay, updateCallBack) {
	"use strict";

	this.lat = lat;
	this.lng = lng;
	this.map = map;

	var pinImage = new google.maps.MarkerImage(
		"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "B8B8B8",
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34)
	);

	this.markerBase = new markerObj(lat, lng, map);
	this.markerBase.getMarker().setDraggable(true);
	this.markerBase.getMarker().setTitle('Drag me !! ');
	this.markerBase.getMarker().setIcon(pinImage);
	this.markerBase.getMarker().setMap(map);

	this.travelType = travelType;
	this.radiusDelay = radiusDelay;
	this.updateCallBack = updateCallBack;

	var radiusDelay_ = radiusDelay;
	var travelType_ = travelType;
	var updateCallBack_ = updateCallBack;

	this.drawPolygon(lat, lng, radiusDelay_, travelType_, updateCallBack_);

	var drawPolygonEvent = this.drawPolygon;

	google.maps.event.addListener(this.markerBase.getMarker(), 'dragend', function(event) {

		if (searchPolygon !== null) {
			// Delete previous polygon.
			searchPolygon.getPath().clear();
			searchPolygon.setMap(null);
		}

		drawPolygonEvent(event.latLng.lat(), event.latLng.lng(), radiusDelay_, travelType_, updateCallBack_);
	});
};

markerSearchObj.prototype.drawPolygon = function(lat, lng, radiusDelay, travelType, updateCallBack) {
	"use strict";

	var request = "/api/polygon?" + $.param({
		lat: lat,
		long: lng,
		timeinmin: radiusDelay,
		traveltype: travelType
	});

	var callback = null;
	if (updateCallBack && typeof(updateCallBack) === "function") {
		callback = updateCallBack;
	}

	// Get the polygon points from the server.
	$(document).ready(function() {
		$.get(request, function(data, status) {
			if (status === 'success') {

				// Build path for the polygone.
				var apath = [];
				for (var i = 0; i < data.length; i++) {
					apath[i] = new google.maps.LatLng(
						data[i].latitude,
						data[i].longitude);
				}

				// Build the polygone.
				searchPolygon = new google.maps.Polygon({
					path: apath,
					strokeColor: "#FF0000",
					strokeOpacity: 0.1,
					strokeWeight: 2,
					// map: this.map,
				});

				if (callback !== null) {
					callback(searchPolygon);
				}
			}
		});
	});
};

markerSearchObj.prototype.getSearchPolygon = function() {
	"use strict";

	return this.searchpolygon;
};

/**************************************************************************\

Object:       	flatfinder

Description:    Flat finder object.

\**************************************************************************/
var flatfinder = function flatfinderlib(city) {
	"use strict";

	var map;
	// var document;

	var infowindow;
	var flatmarkersObj = [];

	var searchmarkers = [];

	var uiInputPriceMin = 0;
	var uiInputPriceMax = 0;

	var uiFlatFiltered = 0;
	var uiFlatShown = 0;
	var markerCluster = null;

	/**************************************************************************\

	Function:       init

	Description:    Initializes the flat finder library :
					- create the map (create the map options)
					- create the windows infowindow
					- get and create the marker

	Parameters:     None.

	Return Value:   None.

	Comments:       None.

	\**************************************************************************/
	function init() {

		//
		// Create a map options.
		//
		var oCityCoord;
		var uiZoom;

		if (city === "montreal") {
			oCityCoord = new google.maps.LatLng(45.506, -73.556);
			uiZoom = 12;
		} else {
			// default
			oCityCoord = new google.maps.LatLng(45.506, -73.556);
			uiZoom = 12;
		}

		var mapOptions = {
			zoom: uiZoom,
			center: oCityCoord,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		//
		// Create the map.
		//
		map = new google.maps.Map(
			document.getElementById('map-canvas'),
			mapOptions);

		//
		// Set markers
		//
		markerCluster = new MarkerClusterer(map);

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

					if ((data[i].latitude !== null) &&
						(data[i].longitude !== null)) {

						var DistanceValid = [];

						DistanceValid[0] = true;

						if (data[i].price === null) {
							data[i].price = 0;
						}

						if (data[i].price < oFlatPrice.Min) {
							oFlatPrice.Min = data[i].price;
						}

						if (data[i].price > oFlatPrice.Max) {
							oFlatPrice.Max = data[i].price;
						}

						var flatMarker = new markerFlatObj(
							data[i].latitude,
							data[i].longitude,
							map,
							null,
							data[i].price,
							infowindow,
							data[i]._id,
							data[i].image
						);

						markerCluster.addMarker(flatMarker.getMarker());
						flatmarkersObj.push(flatMarker);
					}
				}

				document.getElementById("field_available_flat").innerHTML = "Available flats = " + flatmarkersObj.length;
				document.getElementById("field_shown_flat").innerHTML = "Shown flats = " + flatmarkersObj.length;

				document.getElementById("inputMinimumText").value = oFlatPrice.Min;
				document.getElementById("inputMaximumText").value = oFlatPrice.Max;
			});
		});
	}

	/**************************************************************************\

	Function:       addsearchmarker

	Description:    Adds a search marker.

	Parameters:     latidude	Latitude of the search marker.
					longitude	Longitude of the search marker.

	Return Value:   None.

	Comments:       None.

	\**************************************************************************/
	function addsearchmarker(
		latitude,
		longitude,
		travelType,
		radiusTime) {

		var searchmarker = new markerSearchObj(
			latitude,
			longitude,
			map,
			travelType,
			radiusTime,
			updateDistance);

		searchmarkers.push(searchmarker);
	}

	/**************************************************************************\

	Function:       updateDistance

	Description:    Adds a search marker.

	Parameters:     latidude	Latitude of the search marker.
	longitude	Longitude of the search marker.

	Return Value:   None.

	Comments:       None.

	\**************************************************************************/
	function updateDistance(searchPolygon) {

		// var searchPolygon = searchmarkers[0].getSearchPolygon();

		searchPolygon.setMap(map);

		for (var flatIdx = 0; flatIdx < flatmarkersObj.length; flatIdx++) {
			flatmarkersObj[flatIdx].setDistanceValid(
				google.maps.geometry.poly.containsLocation(
					flatmarkersObj[flatIdx].getMarker().getPosition(),
					searchPolygon));
		}

		updateDisplay();
	}

	/**************************************************************************\

	Function:       updatePrice

	Description:    Adds a search marker.

	Parameters:     None.

	Return Value:   None.

	Comments:       None.

	\**************************************************************************/
	function updatePrice() {

		var minPrice = document.getElementById("inputMinimumText").value;
		var maxPrice = document.getElementById("inputMaximumText").value;

		for (var flatIdx = 0; flatIdx < flatmarkersObj.length; flatIdx++) {

			if ((flatmarkersObj[flatIdx].getPrice() >= minPrice) &&
				(flatmarkersObj[flatIdx].getPrice() <= maxPrice)) {
				flatmarkersObj[flatIdx].setPriceValid(true);
			} else {
				flatmarkersObj[flatIdx].setPriceValid(false);
			}
		}

		updateDisplay();
	}

	function updateTravelMode() {

	}

	/**************************************************************************\

	Function:       updateDisplay

	\**************************************************************************/
	function updateDisplay() {

		uiFlatFiltered = 0;
		uiFlatShown = 0;

		for (var flatIdx = 0; flatIdx < flatmarkersObj.length; flatIdx++) {
			if (flatmarkersObj[flatIdx].IsValid()) {
				markerCluster.addMarker(flatmarkersObj[flatIdx].getMarker());
				uiFlatShown++;
			} else {
				markerCluster.removeMarker(flatmarkersObj[flatIdx].getMarker());
				uiFlatFiltered++;
			}
		}

		markerCluster.repaint();

		document.getElementById("field_shown_flat").innerHTML = "Shown flats = " + uiFlatShown;
		document.getElementById("field_filtered_flat").innerHTML = "Filtered flats = " + uiFlatFiltered;
	}

	/**************************************************************************\

	Function:       addsearchmarkerdummy

	Description:    Adds a search marker.

	Parameters:     latidude	Latitude of the search marker.
					longitude	Longitude of the search marker.

	Return Value:   None.

	Comments:       None.

	\**************************************************************************/
	function addsearchmarkerdummy() {

		var strTravelMode = document.getElementById('TravelMode').value;

		return addsearchmarker(
			45.526, -73.564,
			strTravelMode.toLowerCase(),
			document.getElementById("inputMinuteDelayText").value);
	}

	return {
		init: init,
		updatePrice: updatePrice,
		updateTravelMode: updateTravelMode,
		addsearchmarkerdummy: addsearchmarkerdummy
	};
}();

/***************************************************************************************\

Function:       addSearchLocation

Description:    Adds a search marker/location in the map.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function addSearchLocation() {
	"use strict";

	flatfinder.addsearchmarkerdummy();
}

//-----------------------------------------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------------------------------------
var window = null;
google.maps.event.addDomListener(window, 'load', flatfinder.init());
