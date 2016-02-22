/* global module:true */

"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getResult: function() {
		request.get("/api/search/result").end(function(err, res) {
			if (err) {
				if (err.status === 404) {
					this.context.router.push("/search/new");
				} else {
					console.log(err);
				}
			} else {
				if (this.isMounted) {
					if (res.body === null) {
						// Refresh every seconds to check if matching is done.
						this.timer = setTimeout(this.getResult(), 1000);
					} else {
						// Refresh every 5 seconds to check for new result.
						this.timer = setTimeout(this.getResult(), 5000);
					}

					this.setState({apartments: res.body});
				}
			}
		}.bind(this));
	},
	handleLayoutChange: function(type) {
		this.setState({layoutType: type});
	},
	getInitialState: function() {
		return {apartments: null, layoutType: "card"};
	},
	componentDidMount: function() {
		this.isMounted = true;
		this.getResult();
	},
	componentWillUnmount: function() {
		clearTimeout(this.timer);
		this.isMounted = false;
	},
	render: function() {
		var content;

		if (this.state.apartments === null) {
			content = React.createElement("div", null, "Finding matches...");
		} else if (this.state.apartments.length === 0) {
			content = React.createElement("div", null, "No match found.");
		} else {
			content = React.createElement(Layout, {
				apartments: this.state.apartments,
				type: this.state.layoutType
			});
		}

		return React.createElement("div", null, React.createElement(Link, {
			to: "/search/edit"
		}, "Edit"), React.createElement("i", {
			className: "fa fa-square-o",
			onClick: this.handleLayoutChange.bind(this, "card")
		}), React.createElement("i", {
			className: "fa fa-map",
			onClick: this.handleLayoutChange.bind(this, "map")
		}), content);
	}
});
