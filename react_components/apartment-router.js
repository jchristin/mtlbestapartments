"use strict";

var React = require("react"),
	Apartment = require("./apartment"),
	Search = require("./search");

module.exports = React.createClass({
	componentDidMount: function() {
		this.isMounted = true;
	},
	render: function() {
		if (this.isMounted === true || !this.props.params._id) {
			return React.createElement(Search, {
				apartmentId: this.props.params._id
			});
		}

		return React.DOM.div({
				className: "row"
			},
			React.DOM.div({
					className: "col-xs-12 col-md-10 offset-md-1 col-lg-6 offset-lg-3"
				},
				React.createElement(Apartment, {
					apartmentId: this.props.params._id
				})
			)
		);
	}
});
