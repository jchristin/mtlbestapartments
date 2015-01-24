/*global $, google, document */
/*exported addSearchLocation */

var searchpolygong = null;

/**************************************************************************\

Object:       	Markerobj

Description:    Base marker object.

Parameters:     latitude.
longitude
map

Return Value:   None.

Comments:       None.

\**************************************************************************/
function Markerobj(latitude, longitude, map) {
	"use strict";

	this.map = map;

	// Create the marker.
	this.mapMarker = new google.maps.Marker();
	this.mapMarker.setAnimation(google.maps.Animation.DROP);
	this.mapMarker.setPosition(new google.maps.LatLng(latitude, longitude));

	this.getmarker = function() {
		return this.mapMarker;
	};

	this.show = function() {
		return this.mapMarker.setMap(this.map);
	};

	this.hide = function() {
		return this.mapMarker.setMap(null);
	};
}

/**************************************************************************\

Object:       	Markerflatobj

Description:    Flat marker object.

\**************************************************************************/
function Markerflatobj(lat, lng, map, source, price, infowindow, url, image) {
	"use strict";

	this.source = source;
	this.price = price;
	this.distancevalid = true;
	this.pricevalid = true;
	this.markerbase = new Markerobj(lat, lng, map);

	google.maps.event.addListener(this.markerbase.getmarker(), 'click', function() {
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

	this.getmarker = function() {
		return this.markerbase.getmarker();
	};

	this.getprice = function() {
		return this.price;
	};

	this.show = function() {
		return this.markerbase.show();
	};

	this.hide = function() {
		return this.markerbase.hide();
	};

	this.setdistancevalid = function(distancevalid) {
		this.distancevalid = distancevalid;
	};

	this.setpricevalid = function(pricevalid) {
		this.pricevalid = pricevalid;
	};

	this.isvalid = function() {
		return ((this.distancevalid === true) && (this.pricevalid === true));
	};
}

/**************************************************************************\

Object:       	Markersearchobj

Description:    Search marker object.

\**************************************************************************/
function Markersearchobj(lat, lng, map, traveltype, radiusDelay, updateCallBack) {
	"use strict";

	this.lat = lat;
	this.lng = lng;
	this.map = map;
	this.traveltype = traveltype;
	this.radiusDelay = radiusDelay;
	this.updateCallBack = updateCallBack;
	this.searchpolygon = null;

	// Create the marker.
	var pinImage = new google.maps.MarkerImage(
		"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "B8B8B8",
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34)
	);

	this.markerbase = new Markerobj(lat, lng, map);
	this.markerbase.getmarker().setDraggable(true);
	this.markerbase.getmarker().setTitle('Drag me !! ');
	this.markerbase.getmarker().setIcon(pinImage);
	this.markerbase.getmarker().setMap(map);

	var radiusDelay_ = radiusDelay;
	var traveltype_ = traveltype;
	var updateCallBack_ = updateCallBack;

	// this.drawpolygon(lat, lng, radiusDelay_, traveltype_, updateCallBack_);

	// var drawPolygonEvent = this.drawpolygon;

	google.maps.event.addListener(this.markerbase.getmarker(), 'dragend', function(event) {

		if (searchpolygong !== null) {
			// Delete previous polygon.
			searchpolygong.getPath().clear();
			searchpolygong.setMap(null);
		}

		this.drawpolygon(event.latLng.lat(), event.latLng.lng(), radiusDelay_, traveltype_, updateCallBack_);
	});

	this.getsearchpolygon = function() {
		return this.searchpolygon;
	};

	this.updatetraveltype = function(traveltype) {
		this.traveltype = traveltype;
		this.drawpolygon();
	};

	this.drawpolygon = function(lat, lng, radiusDelay, traveltype, updateCallBack) {

		var request = "/api/polygon?" + $.param({
			lat: lat,
			long: lng,
			timeinmin: radiusDelay,
			traveltype: traveltype
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
					searchpolygong = new google.maps.Polygon({
						path: apath,
						strokeColor: "#FF0000",
						strokeOpacity: 0.1,
						strokeWeight: 2,
					});

					if (callback !== null) {
						callback(searchpolygong);
					}
				}
			});
		});
	};

	this.init = function() {
		this.drawpolygon(
			this.lat,
			this.lng,
			this.radiusDelay,
			this.traveltype,
			this.updateCallBack);
	};
}

/**************************************************************************\

Object:       	flatfinder

Description:    Flat finder object.

\**************************************************************************/
var flatfinder = function flatfinderlib(city) {
	"use strict";

	var map;

	var infowindow;
	var flatmarkersObj = [];

	var searchmarkers = [];

	var uiInputPriceMin = 0;
	var uiInputPriceMax = 0;

	var uiFlatFiltered = 0;
	var uiFlatShown = 0;

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

						var flatMarker = new Markerflatobj(
							data[i].latitude,
							data[i].longitude,
							map,
							null,
							data[i].price,
							infowindow,
							data[i]._id,
							data[i].image
						);

						flatMarker.show();
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
		traveltype,
		radiusTime) {

		var searchmarker = new Markersearchobj(
			latitude,
			longitude,
			map,
			traveltype,
			radiusTime,
			updatedistance);

		searchmarker.init();
		searchmarkers.push(searchmarker);
	}

	/**************************************************************************\

	Function:       updatedistance

	Description:    Adds a search marker.

	Parameters:     latidude	Latitude of the search marker.
	longitude	Longitude of the search marker.

	Return Value:   None.

	Comments:       None.

	\**************************************************************************/
	function updatedistance() {

		if (searchpolygong !== null) {

			searchpolygong.setMap(map);

			for (var flatIdx = 0; flatIdx < flatmarkersObj.length; flatIdx++) {
				flatmarkersObj[flatIdx].setdistancevalid(
					google.maps.geometry.poly.containsLocation(
						flatmarkersObj[flatIdx].getmarker().getPosition(),
						searchpolygong));
			}

			updateDisplay();
		}
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

			if ((flatmarkersObj[flatIdx].getprice() >= minPrice) &&
				(flatmarkersObj[flatIdx].getprice() <= maxPrice)) {
				flatmarkersObj[flatIdx].setpricevalid(true);
			} else {
				flatmarkersObj[flatIdx].setpricevalid(false);
			}
		}

		updateDisplay();
	}

	function updateTravelMode(traveltype) {
		var searchpolygon = searchmarkers[0].getsearchpolygon();

		if (searchpolygon !== null) {
			searchpolygon.updateTravelMode(traveltype);
		}
	}

	/**************************************************************************\

	Function:       updateDisplay

	\**************************************************************************/
	function updateDisplay() {

		uiFlatFiltered = 0;
		uiFlatShown = 0;

		for (var flatIdx = 0; flatIdx < flatmarkersObj.length; flatIdx++) {
			if (flatmarkersObj[flatIdx].isvalid()) {
				flatmarkersObj[flatIdx].show();
				uiFlatShown++;
			} else {
				flatmarkersObj[flatIdx].hide();
				uiFlatFiltered++;
			}
		}

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
