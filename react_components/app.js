/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	LogMenu = require("./logmenu"),
	ReactIntl = require("react-intl"),
	addLocaleData = ReactIntl.addLocaleData,
	IntlProvider = ReactIntl.IntlProvider;

module.exports = React.createClass({
	componentDidMount: function() {
		global.jQuery = require("jquery");
		require("../node_modules/bootstrap/dist/js/umd/dropdown");
	},

	childContextTypes: {
		lang: React.PropTypes.string
	},

    getChildContext: function() {
		return {
			lang: this.props.params.lang
		};
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
			className: "app"
		}, React.DOM.nav({
			className: "navbar"
		}, React.createElement(Link, {
			to: "/" + this.props.params.lang + "/",
			className: "navbar-brand"
		}, "Fleub"), React.createElement(LogMenu, { lang: this.props.params.lang })), React.DOM.div({
			className: "container"
		}, this.props.children)));
	}
});
