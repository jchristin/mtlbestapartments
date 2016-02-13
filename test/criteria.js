/* global describe, it */

"use strict";

var _ = require("lodash"),
	criteria = require("../criteria");

describe("criteria", function() {
	it("should implement all required functions", function() {
		var functions = [
			"Card",
			"LargeCard",
			"computeScore",
			"default"
		];

		_.forEach(criteria, function(criterion) {
			criterion.should.have.properties(functions);
		});
	});
});
