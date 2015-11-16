/* jshint expr: true */
/* global describe, it */

"use strict";

var match = require("../match"),
	apartment = require("./apartment"),
	criteria = require("./criteria");

describe("match", function() {
	it("should calculate the right score", function() {
		match(criteria, apartment, 1).should.be.equal(100);
		match(criteria, apartment, 3).should.be.equal(100);
	});
});
