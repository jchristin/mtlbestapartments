/* global module:true */

"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	moment = require("moment"),
	LogMenu = require("./logmenu"),
	ReactIntl = require("react-intl"),
	criteriaManagers = require("../criteria-managers"),
	addLocaleData = ReactIntl.addLocaleData,
	IntlProvider = ReactIntl.IntlProvider,
	locales = {
		en: require("../locale/en"),
		fr: require("../locale/fr")
	};

module.exports = React.createClass({
	childContextTypes: {
		lang: React.PropTypes.string
	},
	componentDidMount: function() {
		global.jQuery = require("jquery");
		require("../node_modules/bootstrap/dist/js/bootstrap");
	},
	getChildContext: function() {
		return {
			lang: this.props.params.lang
		};
	},
	getLocaleMessages: function(lang) {
		return _.merge(locales[lang], _.reduce(criteriaManagers, function(result, criterionManager) {
			return _.merge(result, criterionManager.locale[lang]);
		}, {}));
	},
	getLocalizationProps: function() {
		switch (this.props.params.lang) {
			case "en":
				moment.locale("en");
				addLocaleData(require("react-intl/locale-data/en"));
				return {locale: "en", messages: this.getLocaleMessages("en")};
			default:
			case "fr":
				require("moment/locale/fr");
				moment.locale("fr");
				addLocaleData(require("react-intl/locale-data/fr"));
				return {locale: "fr", messages: this.getLocaleMessages("fr")};
		}
	},
	render: function() {
		return React.createElement(IntlProvider, this.getLocalizationProps(),
			React.DOM.div({
					className: "app"
				},
				React.DOM.nav({
						className: "navbar"
					},
					React.createElement(Link, {
						to: "/" + this.props.params.lang + "/",
						className: "navbar-brand"
					}, "Fleub"),
					React.createElement(LogMenu, {
						lang: this.props.params.lang
					})
				),
				React.DOM.div({
					className: "container"
				}, this.props.children)
			)
		);
	}
});
