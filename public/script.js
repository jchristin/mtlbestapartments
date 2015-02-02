/*global $, google, document */
/*exported addSearchLocation */

var mapssearchpolygon = [];

/**************************************************************************\

Object:       	Markerobj

Description:    Base marker object.

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
	this.infowindow = new google.maps.InfoWindow();
	this.url = url;
	this.image = image;

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

	this.updateinfowindow = function() {
		var content;

		content = '<div style="width:325px; height:350px">';

		if (this.image !== null) {
			content += '<div align="center">';
			content += '<img src="';
			content += this.image;
			content += '" width="225" height="300" ALIGN="middle" />';
			content += '</div>';
		}

		if (this.url !== null) {
			content += '<div align="center">';
			content += '<a href="';
			content += this.url;
			content += '" target=_blank>';
			content += this.url;
			content += '</a>';
			content += '</div>';
		}

		content += '</div>';

		this.infowindow.setContent(content);
	};

	var this_ = this;

	google.maps.event.addListener(this.markerbase.getmarker(), 'click', function() {
		this_.updateinfowindow();
		this_.infowindow.open(map, this);
	});
}

/**************************************************************************\

Object:       	Searchpolygonobj

Description:    Search polygon object.

\**************************************************************************/
function Searchpolygonobj(index, lat, lng, map, traveltype, radiusdelay, updatecallback) {
	"use strict";

	this.index = index;
	this.lat = lat;
	this.lng = lng;
	this.map = map;
	this.traveltype = traveltype;
	this.radiusdelay = radiusdelay;
	this.updatecallback = updatecallback;

	this.updatelatlng = function(lat, lng) {
		this.clearpolygon();
		this.lat = lat;
		this.lng = lng;
		this.drawpolygon();
	};

	this.updatetraveltype = function(traveltype) {
		this.clearpolygon();
		this.traveltype = traveltype;
		this.drawpolygon();
	};

	this.updateradiusdelay = function(radiusdelay) {
		this.clearpolygon();
		this.radiusdelay = radiusdelay;
		this.drawpolygon();
	};

	this.clearpolygon = function() {

		// Delete previous polygon if any.
		if (mapssearchpolygon[index] !== null) {

			mapssearchpolygon[index].getPath().clear();
			mapssearchpolygon[index].setMap(null);
		}
	};

	this.drawpolygon = function() {

		var request = "/api/polygon?" + $.param({
			lat: this.lat,
			long: this.lng,
			timeinmin: this.radiusdelay,
			traveltype: this.traveltype.toLowerCase()
		});

		var callback = null;
		if (this.updatecallback && typeof(this.updatecallback) === "function") {
			callback = this.updatecallback;
		}

		var map = this.map;

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

					var mapssearchpolygoncurrent = new google.maps.Polygon({
						path: apath,
						strokeColor: "#FF0000",
						strokeOpacity: 0.1,
						strokeWeight: 2,
						map: map
					});

					mapssearchpolygon[index] = mapssearchpolygoncurrent;

					callback();
				}
			});
		});
	};
}

/**************************************************************************\

Object:       	Markersearchobj

Description:    Search marker object.

\**************************************************************************/
function Markersearchobj(
	index,
	lat,
	lng,
	map,
	traveltype,
	radiusdelay,
	updatecallback) {
	"use strict";

	this.index = index;
	this.lat = lat;
	this.lng = lng;
	this.map = map;
	this.traveltype = traveltype;
	this.radiusdelay = radiusdelay;
	this.updatecallback = updatecallback;
	this.infowindow = new google.maps.InfoWindow();

	this.getsearchpolygon = function() {
		return this.searchpolygon;
	};

	this.updatetraveltype = function(traveltype) {
		this.searchpolygon.updatetraveltype(traveltype);
	};

	this.updateradiusdelay = function(radiusdelay) {
		this.searchpolygon.updateradiusdelay(radiusdelay);
	};

	this.init = function() {
		this.searchpolygon.drawpolygon();
	};

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

	this.updateinfowindow = function() {
		this.infowindow.setContent(
			'<center> Search marker #' + this.index + '</center>' +
			'<table style="width:100%">' +
			'<tr>' +
			'<td>Latitude</td>' +
			'<td> : ' + this.lat + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Longitude</td>' +
			'<td> : ' + this.lng + '</td>' +
			'</tr>' +
			'</table>'
		);
	};

	// Create the polygon.
	this.searchpolygon = new Searchpolygonobj(
		index,
		lat,
		lng,
		map,
		traveltype,
		radiusdelay,
		updatecallback
	);

	var this_ = this;
	google.maps.event.addListener(this.markerbase.getmarker(), 'dragend', function(event) {

		this_.lat = event.latLng.lat();
		this_.lng = event.latLng.lng();

		this_.updateinfowindow();

		this_.searchpolygon.updatelatlng(
			event.latLng.lat(),
			event.latLng.lng()
		);
	});

	google.maps.event.addListener(this.markerbase.getmarker(), 'click', function() {
		this_.infowindow.open(map, this);
	});

	//
	// Object initialization.
	//
	this_.updateinfowindow();
}

/**************************************************************************\

Object:       	flatfinder

Description:    Flat finder object.

\**************************************************************************/
var flatfinder = function flatfinderlib(city) {
	"use strict";

	var map;

	var infowindow;

	var flatmarkersobj = [];
	var searchmarkersobj = [];

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
						flatmarkersobj.push(flatMarker);
					}
				}

				document.getElementById("field_available_flat").innerHTML = "Available flats = " + flatmarkersobj.length;
				document.getElementById("field_shown_flat").innerHTML = "Shown flats = " + flatmarkersobj.length;

				document.getElementById("inputMinimumText").value = oFlatPrice.Min;
				document.getElementById("inputMaximumText").value = oFlatPrice.Max;
			});
		});
	}

	function addsearchmarker(
		latitude,
		longitude,
		traveltype,
		radiusTime) {

		var index = 0;
		if (typeof mapssearchpolygon[0] !== 'undefined') {
			index = mapssearchpolygon.length;
		}

		var searchmarker = new Markersearchobj(
			index,
			latitude,
			longitude,
			map,
			traveltype,
			radiusTime,
			updatedistance);

		searchmarker.init();
		searchmarkersobj.push(searchmarker);
	}

	function updatedistance() {

		for (var flatIdx = 0; flatIdx < flatmarkersobj.length; flatIdx++) {
			flatmarkersobj[flatIdx].setdistancevalid(
				isdistancevalid(flatmarkersobj[flatIdx]));
		}

		updateDisplay();
	}

	function isdistancevalid(flatmarkersobj) {

		for (var searchmarkeridx = 0; searchmarkeridx < searchmarkersobj.length; searchmarkeridx++) {

			if (!google.maps.geometry.poly.containsLocation(
					flatmarkersobj.getmarker().getPosition(),
					mapssearchpolygon[searchmarkeridx])) {

				return false;
			}
		}

		return true;
	}

	function updatePrice() {

		var minPrice = document.getElementById("inputMinimumText").value;
		var maxPrice = document.getElementById("inputMaximumText").value;

		for (var flatIdx = 0; flatIdx < flatmarkersobj.length; flatIdx++) {

			if ((flatmarkersobj[flatIdx].getprice() >= minPrice) &&
				(flatmarkersobj[flatIdx].getprice() <= maxPrice)) {
				flatmarkersobj[flatIdx].setpricevalid(true);
			} else {
				flatmarkersobj[flatIdx].setpricevalid(false);
			}
		}

		updateDisplay();
	}

	function updateTravelMode(traveltype) {
		var searchpolygon = searchmarkersobj[0].getsearchpolygon();

		if (searchpolygon !== null) {
			searchpolygon.updatetraveltype(traveltype);
		}
	}

	function updateRadiusDelay(radiusdelay) {
		var searchpolygon = searchmarkersobj[0].getsearchpolygon();

		if (searchpolygon !== null) {
			searchpolygon.updateradiusdelay(radiusdelay);
		}
	}

	function updateDisplay() {

		uiFlatFiltered = 0;
		uiFlatShown = 0;

		for (var flatIdx = 0; flatIdx < flatmarkersobj.length; flatIdx++) {
			if (flatmarkersobj[flatIdx].isvalid()) {
				flatmarkersobj[flatIdx].show();
				uiFlatShown++;
			} else {
				flatmarkersobj[flatIdx].hide();
				uiFlatFiltered++;
			}
		}

		document.getElementById("field_shown_flat").innerHTML = "Shown flats = " + uiFlatShown;
		document.getElementById("field_filtered_flat").innerHTML = "Filtered flats = " + uiFlatFiltered;
	}

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
		updateRadiusDelay: updateRadiusDelay,
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
