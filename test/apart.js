/* global describe, it */

"use strict";

var Apart = require("../apart");

describe("Apart", function() {
	this.timeout(0);
	it("should normalize apartement", function(done) {
		var apartements = [{
				address: "8303 Rue Louis-Quatorze, St-Léonard H1P3G2 QC",
				formattedAddress: "8303 Rue Louis Xiv, Saint-Léonard, QC H1R 3G2, Canada",
				borough: "saint-leonard"
			}, {
				address: "25xx Av. Mercier, Anjou H1K 3J4 QC",
				formattedAddress: "Avenue Mercier, Anjou, QC H1K, Canada",
				borough: "mercier-hochelaga-maisonneuve"
			}, {
				address: "Rue Saint-Urbain & Avenue du Mont-Royal O, Montréal, QC H2T, Canada",
				formattedAddress: "Rue Saint-Urbain & Avenue du Mont-Royal O, Montréal, QC H2T, Canada",
				borough: "le-plateau-mont-royal"
			}
		];

		var promises = apartements.map(function(apartement) {
			var apart = {address: apartement.address};
			return Apart.normalizeApart(apart).then(function() {
				apart.formattedAddress.should.be.equal(apartement.formattedAddress);
				apart.borough.should.be.equal(apartement.borough);
			});
		});

		Promise.all(promises).then(function(){done();}, done);
	});
});
