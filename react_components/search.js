/* global module:true */

"use strict";

var React = require("react"),
	Layout = require("./layout"),
	request = require("superagent"),
	Link = require("react-router").Link,
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getResult: function() {
		request.get("/api/search/result").end(function(err, res) {
			if (err) {
				if (err.status === 404) {
					this.context.router.push("/" + this.props.params.lang + "/search/edit");
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
	createLoading: function() {
		if(this.state.apartments === null) {
			return React.DOM.i({
				className: "fa fa-refresh fa-spin"
			});
		}
	},
	getInitialState: function() {
		return {apartments: null};
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
		var content,
			formatMessage = this.props.intl.formatMessage;

		if (this.state.apartments !== null) {
			if (this.state.apartments.length === 0) {
				content = React.DOM.div(null, formatMessage({id: "search-no-match-found"}));
			} else {
				content = React.createElement(Layout, {apartments: this.state.apartments});
			}
		}

		return React.DOM.div(null, React.DOM.h1({
			className: "m-t-1"
		}, formatMessage({id: "search-result"}), this.createLoading()), React.createElement(Link, {
			to: "/" + this.props.params.lang + "/search/edit",
			className: "btn btn-primary",
			role: "button"
		}, formatMessage({id: "search-edit"})), content);
	}
}));
