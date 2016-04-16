/* global window */

"use strict";

var React = require("react"),
	injectIntl = require("react-intl").injectIntl,
	langNames = require("../localization/language-names"),
	languages = ["en", "pt"];

module.exports = injectIntl(React.createClass({

	displayName: "langChooser",

	getInitialState: function() {
		return {
			isDropdownOpen: false
		};
	},

	getTitle: function() {
		var formatMessage = this.props.intl.formatMessage;

		if (langNames[this.props.currentLanguage] !== undefined) {
			return langNames[this.props.currentLanguage];
		}

		return formatMessage({
			id: "lang-chooser-choose-language"
		});
	},

	openDropdown: function() {
		this.setState({
			isDropdownOpen: true
		});
	},

	closeDropdown: function() {
		this.setState({
			isDropdownOpen: false
		});
	},

	componentDidMount: function() {
		global.jQuery = require("jquery");
		global.jQuery(".dropdown").on('show.bs.dropdown', this.openDropdown);
		global.jQuery(".dropdown").on('hide.bs.dropdown', this.closeDropdown);
	},

	changeLanguage: function(lang, e) {
		e.preventDefault();

		var split = window.location.pathname.split("/");
		split[1] = lang;
		window.location.href = split.join("/");
	},

	buildDropdown: function() {
		var list = [];
		languages.forEach(function(language, languageIndex) {
			list.push(
				React.DOM.li({
						key: languageIndex,
						onClick: this.changeLanguage.bind(this, language)
					},
					React.DOM.a({
						href: "#"
					}, langNames[language])
				)
			);
		}.bind(this));

		return React.DOM.ul({
				className: "dropdown-menu"
			},
			list
		);
	},

	render: function() {

		var stateIcon = React.DOM.i({
			className: this.state.isDropdownOpen ? "fa fa-caret-up" : "fa fa-caret-down"
		});

		return React.DOM.div({
				className: "dropdown",
				ref: "dropdownParent"
			},
			React.DOM.a({
					id: "language-chooser",
					"data-toggle": "dropdown",
					className: this.state.isDropdownOpen ? "open" : null,
				},
				this.getTitle(),
				stateIcon
			),
			this.buildDropdown()
		);
	}
}));
