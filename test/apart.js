/* global describe, it */

"use strict";

var Apart = require("../apart");

describe.skip("Apart", function() {
	this.timeout(0);
	it("should normalize address", function(done) {
		var addresses = [{
				raw: "8303 Rue Louis-Quatorze, St-Léonard H1P3G2 QC",
				formatted: "8303 Rue Louis Xiv, Saint-Léonard, QC H1R 3G2, Canada"
			}, {
				raw: "25xx Av. Mercier, Anjou H1K 3J4 QC",
				formatted: "Avenue Mercier, Anjou, QC H1K, Canada"
			}, {
				raw: "Rue Saint-Urbain & Avenue du Mont-Royal O, Montréal, QC H2T, Canada",
				formatted: "Rue Saint-Urbain & Avenue du Mont-Royal O, Montréal, QC H2T, Canada"
			}
		];

		var promises = addresses.map(function(address) {
			var apart = {address: address.raw};
			return Apart.normalizeApart(apart).then(function() {
				apart.formattedAddress.should.be.equal(address.formatted);
			});
		});

		Promise.all(promises).then(function(){done();}, done);
	});
});
