"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent"),
	Link = require("react-router").Link,
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		track: React.PropTypes.func,
		router: React.PropTypes.object.isRequired,
		lang: React.PropTypes.string
	},
	getResult: function() {
		request.get("/api/search/result").end(function(err, res) {
			if (err) {
				if (err.status === 404) {
					this.context.router.push("/" + this.context.lang + "/search/edit");
				} else {
					console.log(err);
				}
			} else if (this.isMounted) {
				if (res.body === null) {
					// Refresh every seconds to check if matching is done.
					this.timer = setTimeout(this.getResult, 1000);
					this.context.track("getResult", null);
				} else {
					// Refresh every 5 seconds to check for new result.
					this.timer = setTimeout(this.getResult, 5000);
					this.context.track("getResult", res.body.length);
				}

				this.setState({
					apartments: res.body.apartments,
					notification: res.body.notification
				});
			}
		}.bind(this));
	},
	handleChangeNotification: function() {
		var state = this.state.notification ? "off" : "on";

		request.post("/api/search/notification/" + state).end(function(err) {
			if (err) {
				console.log(err);
			}
		});

		this.context.track("updateNotification", state);

		this.setState({
			notification: !this.state.notification
		});
	},
	createLoading: function() {
		if (this.state.apartments === null) {
			return React.DOM.i({
				className: "fa fa-refresh fa-spin"
			});
		}

		return null;
	},
	getInitialState: function() {
		return {
			apartments: null,
			notification: false
		};
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
		var content = null,
			formatMessage = this.props.intl.formatMessage;

		if (this.state.apartments !== null) {
			if (this.state.apartments.length === 0) {
				content = React.DOM.div(null, formatMessage({
					id: "search-no-match-found"
				}));
			} else {
				content = React.createElement(Layout, {
					apartments: this.state.apartments,
					currentApartmentId: this.props.apartmentId
				});
			}
		}

		return React.DOM.div(null,
			React.DOM.h1({
				className: "m-t-1"
			}, formatMessage({
				id: "search-result"
			}), this.createLoading()),
			React.createElement(Link, {
				to: "/" + this.context.lang + "/search/edit",
				className: "btn btn-primary",
				role: "button"
			}, formatMessage({
				id: "search-edit"
			})),
			React.DOM.label({
					className: "custom-control custom-checkbox m-l-1"
				},
				React.DOM.input({
					type: "checkbox",
					checked: this.state.notification,
					onChange: this.handleChangeNotification,
					className: "custom-control-input"
				}),
				React.DOM.span({
					className: "custom-control-indicator"
				}),
				formatMessage({
					id: "search-email-notification"
				})
			),
			content
		);
	}
}));
