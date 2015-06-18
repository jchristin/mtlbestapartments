/* jshint expr: true */
/* global describe, it */

"use strict";

var _ = require("lodash"),
	zoneStore = require("../react_stores/zone-store-borough");

describe("zoneStore", function() {
	it("should have 33 boroughs", function() {
		_.size(zoneStore.boroughs).should.be.equal(33);
	});

	it("should have closed boroughs", function() {
		_.forEach(zoneStore.boroughs, function (value) {
			_.first(value).should.be.eql(_.last(value));
		});
	});
});
