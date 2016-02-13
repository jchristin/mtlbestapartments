/* global describe, it */

"use strict";

var _ = require("lodash"),
	criteriaManagers = require("../criteria-managers");

describe("criteria managers", function() {
	it("should implement all required properties", function() {
		var functions = [
			"Card",
			"LargeCard",
			"computeScore",
			"default",
			"icon"
		];

		_.forEach(criteriaManagers, function(manager) {
			manager.should.have.properties(functions);
		});
	});
});
