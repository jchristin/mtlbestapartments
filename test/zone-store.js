/* jshint expr: true */
/* global describe, it */

"use strict";

var _ = require("lodash"),
	zoneStore = require("../react_stores/zone-store");

describe("zoneStore", function() {
	it("should have 33 boroughs", function() {
		_.size(zoneStore.boroughs).should.be.equal(33);
	});
});
