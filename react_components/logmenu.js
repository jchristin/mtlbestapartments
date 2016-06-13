/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	injectIntl = require("react-intl").injectIntl,
	LanguageChooser = require("./language-chooser");

module.exports = injectIntl(React.createClass({
	displayName: "Logmenu",
	contextTypes: {
		track: React.PropTypes.func,
		user: React.PropTypes.object,
		lang: React.PropTypes.string
	},
	createLoggedMenu: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.ul({
			className: "nav navbar-nav pull-xs-right"
		}, React.createElement(LanguageChooser),
		React.DOM.li({
			className: "nav-item dropdown"
		}, React.DOM.a({
			id: "account",
			href: "#",
			"data-toggle": "dropdown",
			"aria-haspopup": true,
			"aria-expanded": false,
			className: "nav-link"
		}, formatMessage({
				id: "logmenu-account"
			})), React.DOM.div({
			className: "dropdown-menu dropdown-menu-right",
			"aria-labelledby": formatMessage({
					id: "logmenu-signin"
				})
		}, React.DOM.h6({
			className: "dropdown-header"
		}, this.context.user.name), React.createElement(Link, {
			to: "/" + this.context.lang + "/settings",
			className: "dropdown-item"
		}, "Settings"), React.DOM.a({
			href: "/api/signout",
			className: "dropdown-item",
			onClick: this.context.track.bind(null, "signOut", null)
		}, formatMessage({
				id: "logmenu-signout"
			})))));
	},
	createNotLoggedMenu: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.ul({
				className: "nav navbar-nav pull-xs-right"
			},
			React.createElement(LanguageChooser),
			React.DOM.li({
					className: "nav-item"
				}, React.createElement(Link, {
					to: "/" + this.context.lang + "/signin",
					className: "nav-link"
				}, formatMessage({
					id: "logmenu-signin"
				}))
			)
		);
	},
	render: function() {
		return this.context.user ? this.createLoggedMenu() : this.createNotLoggedMenu();
	}
}));
