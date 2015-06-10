"use strict";

// Converts from degrees to radians.
var radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
var degrees = function(radians) {
	return radians * 180 / Math.PI;
};

// Earth radius at a given latitude, according to the WGS-84 ellipsoid [m]
var earthradius = function(lat) {
	// http://en.wikipedia.org/wiki/Earth_radius
	var An = 6378137.0 * 6378137.0 * Math.cos(lat);
	var Bn = 6356752.3 * 6356752.3 * Math.sin(lat);
	var Ad = 6378137.0 * Math.cos(lat);
	var Bd = 6356752.3 * Math.sin(lat);

	return Math.sqrt((An * An + Bn * Bn) / (Ad * Ad + Bd * Bd));
};

var distanceMeter = function(latdeg1, lngdeg1, latdeg2, lngdeg2) {
	var φ1 = radians(latdeg1);
	var λ1 = radians(lngdeg1);
	var φ2 = radians(latdeg2);
	var λ2 = radians(lngdeg2);
	var Δφ = φ2 - φ1;
	var Δλ = λ2 - λ1;

	var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) *
		Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = earthradius(latdeg1) * c;

	return d;
};

var destinationPoint = function(latdeg, lngdeg, distInMeter, angleDeg) {

	// see http://williams.best.vwh.net/avform.htm#LL
	var θ = radians(Number(angleDeg));
	var δ = Number(distInMeter / earthradius(latdeg));

	var φ1 = radians(latdeg);
	var λ1 = radians(lngdeg);

	var φ2 = Math.asin(
		Math.sin(φ1) * Math.cos(δ) +
		Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
	var λ2 = λ1 + Math.atan2(
		Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
		Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

	// Normalise to -180..+180°.
	λ2 = (λ2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

	return [degrees(φ2), degrees(λ2)];
};

var coodinatesAngle = function(latdeg1, lngdeg1, latdeg2, lngdeg2) {
	var φ1 = radians(latdeg1);
	var λ1 = radians(lngdeg1);
	var φ2 = radians(latdeg2);
	var λ2 = radians(lngdeg2);
	var Δλ = λ2 - λ1;

	var y = Math.sin(Δλ) * Math.cos(φ2);
	var x = Math.cos(φ1) * Math.sin(φ2) -
		Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

	var brng = degrees(Math.atan2(y, x));

	return ((brng + 360) % 360);
};

exports.radians = radians;
exports.degrees = degrees;
exports.earthradius = earthradius;
exports.distanceMeter = distanceMeter;
exports.destinationPoint = destinationPoint;
exports.coodinatesAngle = coodinatesAngle;
