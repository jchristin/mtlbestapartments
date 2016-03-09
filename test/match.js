/* jshint expr: true */
/* global describe, it */

"use strict";

var match = require("../match"),
	apartment = require("./apartment.json"),
	criteria = require("./criteria.json");

describe("match", function() {
	it("should calculate the right score", function() {
		var search = {criteria : criteria};
		match.computeScore(search, apartment, 1).should.be.equal(100);
		match.computeScore(search, apartment, 3).should.be.approximately(100, 0.0001);
	});
});
