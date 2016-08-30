"use strict";

var React = require("react"),
	Link = require("react-router").Link,
	langNames = require("../locale/language-names"),
	langs = Object.keys(langNames);

module.exports = React.createClass({
	displayName: "LanguageChooser",
	contextTypes: {
		track: React.PropTypes.func,
		lang: React.PropTypes.string
	},
	createLink: function() {
		// Find the currently displayed language
		var currentLangIndex = langs.indexOf(this.context.lang);
		// Increment index for the next one
		var nextLangIndex = currentLangIndex + 1;

		// If the currently diplayed language is the last in the list, loop back to the first one
		if (currentLangIndex === langs.length - 1) {
			nextLangIndex = 0;
		}

		// Keep the current page URL, but replace the lang param
		var url = "/" + langs[nextLangIndex] + window.location.pathname.substring(3);
		var title = langs[nextLangIndex].toUpperCase();

		return (
			React.createElement(Link, {
				to: url,
				className: "nav-link",
				onClick: this.context.track.bind(null, "changeLanguage", langs[nextLangIndex])
			}, title)
		);
	},

	render: function() {
		return (
			React.DOM.li({
					className: "nav-item"
				}, this.createLink()
			)
		);
	}
});
