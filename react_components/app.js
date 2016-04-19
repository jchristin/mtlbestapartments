/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	Sidebar = require("./sidebar"),
	LogMenu = require("./logmenu"),
	ReactIntl = require("react-intl"),
	addLocaleData = ReactIntl.addLocaleData,
	IntlProvider = ReactIntl.IntlProvider;

module.exports = React.createClass({
	getInitialState: function() {
		return {expanded: false};
	},
	toggle: function(event) {
		event.stopPropagation();

		this.setState({
			expanded: !this.state.expanded
		});
	},
	collapse: function() {
		this.setState({expanded: false});
	},
	componentDidMount: function() {
		global.jQuery = require("jquery");
		require("../node_modules/bootstrap/dist/js/umd/dropdown");
	},
	getLocalizationProps: function() {
		switch (this.props.params.lang) {
			case "en":
				addLocaleData(require("react-intl/locale-data/en"));
				return {locale: "en", messages: require("../localization/en/pages")};
			case "fr":
				addLocaleData(require("react-intl/locale-data/fr"));
				return {locale: "fr", messages: require("../localization/fr/pages")};
			default:
				addLocaleData(require("react-intl/locale-data/en"));
				return {locale: "en", messages: require("../localization/en/pages")};
		}
	},
	render: function() {
		return React.createElement(IntlProvider, this.getLocalizationProps(), React.DOM.div({
			className: "app",
			onClick: this.collapse
		}, React.createElement(Sidebar), React.DOM.div({
			className: "main" + (this.state.expanded ? " expanded" : "")
		}, React.DOM.nav({
			className: "navbar"
		}, React.DOM.a({
			className: "navbar-brand",
			onClick: this.toggle
		}, React.DOM.i({className: "fa fa-bars"})), React.createElement(Link, {
			to: "/",
			className: "navbar-brand"
		}, "Fleub"), React.createElement(LogMenu)), React.DOM.div({
			className: "container"
		}, this.props.children))));
	}
});
