"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		user: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			apartments: null
		};
	},
	componentWillMount: function() {
		request
			.get("/api/posted/" + this.context.user._id)
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						apartments: res.body
					});
				}
			}.bind(this));
	},
	createLoading: function() {
		if (this.state.apartments === null) {
			return React.DOM.i({
				className: "fa fa-refresh fa-spin"
			});
		}

		return null;
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
				className: "row"
			},
			React.DOM.h1({
					className: "m-t-1"
				},
				formatMessage({
					id: "posted-apt"
				}),
				this.createLoading()
			),
			React.createElement(Layout, {
				apartments: this.state.apartments
			})
		);
	}
}));
