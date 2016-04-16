/* jshint expr: true */
/* global describe, it */

"use strict";

var Apart = require("../apart");

describe("apart", function() {
	it("should normalize address", function() {
		var apart = {adress: "5000"};
		Apart.normalizeApart(apart);
		console.log(apart);
	});
});
