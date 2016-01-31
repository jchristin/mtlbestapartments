/* jshint expr: true */
/* global describe, it */

"use strict";

var _ = require("lodash"),
	boroughs = require("../boroughs");

describe("boroughs", function() {
	it("should have 33 boroughs", function() {
		_.size(boroughs).should.be.equal(33);
	});

	it("should have closed boroughs", function() {
		_.forEach(boroughs, function (value) {
			_.head(value.coord).should.be.eql(_.last(value.coord));
		});
	});
});
