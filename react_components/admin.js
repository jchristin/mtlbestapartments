/* global module:true, window: true */

"use strict";

var _ = require("lodash"),
	moment = require("moment"),
	React = require("react"),
	Keen = require("keen-js"),
	d3 = require("d3");

var client = new Keen({
	projectId: process.env.KEEN_PROJECT_ID,
	readKey: process.env.KEEN_READ_KEY
});

var typeColors = {
	"setBedroom": "limegreen",
	"setBorough": "limegreen",
	"setKeywords": "limegreen",
	"setPrice": "limegreen",
	"clickKijijiLink": "black",
	"watchApartDetail": "black",
	"watchCriteria": "forestgreen",
	"saveCriteria": "forestgreen",
	"changeLanguage": "gold",
	"changeLayout": "gold",
	"getResult": "gray",
	"updateNotification": "gold",
	"deleteAccount": "darkred",
	"signInFailed": "red",
	"signInSucceeded": "blueviolet",
	"signUpFailed": "red",
	"signUpSucceeded": "blueviolet",
	"signOut": "blueviolet"
};

var drawChart = function() {
	var extraction = new Keen.Query("extraction", {
		event_collection: "app",
		timeframe: "this_7_days"
	});

	var timeOrigin = moment().subtract(7, "days");

	client.run(extraction, function(err, res){
		if (err) {
			console.log(err);
		} else {
			var data = _.groupBy(res.result, "user._id");

			var row = d3.select("#chart")
				.selectAll(".chart-row")
				.data(d3.keys(data))
				.enter().append("div")
				.attr("class", "chart-row");

			row.append("div")
				.attr("class", "chart-header")
				.text(function(d) { return d; });

			row.append("svg")
				.selectAll("circle")
				.data(function(d) { return data[d]; })
				.enter().append("circle")
				.attr("cx", function(d) { return moment(d.keen.created_at).diff(timeOrigin, "seconds") * 3;})
				.attr("cy", 12)
				.attr("r", 3)
				.attr("fill", function(d) { return typeColors[d.type] || "pink"; })
				.append("svg:title")
				.text(function(d) { return d.type + ": " + (typeof d.value === "object" ? JSON.stringify(d.value) : d.value); });
		}
	});
};

module.exports = React.createClass({
	componentDidMount: function() {
		drawChart();
	},
	render: function() {
		return React.DOM.div({
			id: "chart"
		});
	}
});
