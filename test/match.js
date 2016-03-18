/* jshint expr: true */
/* global describe, it */

"use strict";

var match = require("../match"),
	apartment = require("./apartment.json"),
	criteria = require("./criteria.json");

describe("match", function() {
	it("should calculate the right score", function() {
		var search = {criteria : criteria};
		match.computeScore(search, apartment).should.be.equal(100);
	});
});
