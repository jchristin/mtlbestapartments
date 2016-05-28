/* global module:true */

"use strict";

var React = require("react"),
injectIntl = require("react-intl").injectIntl,
_ = require("lodash");

module.exports = injectIntl(React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  getInitialState: function() {
    this.bedrooms = [];

    for (var i = 0; i < 5; i++) {
				this.bedrooms.push(false);
    }

    return {
      checked: this.bedrooms,
      buttondisable: true
    };
 },
  handleChange: function(number, checked) {

    for (var i = 0; i < 5; i++) {
        this.bedrooms[i] = false;
    }

		this.bedrooms[number] = checked;

    var bedSelected = _.some(this.bedrooms, function(bedroom) {
      return bedroom === true;
    });

    this.setState({
      buttondisable: !bedSelected,
      checked: this.bedrooms,
    });

	},
	createButton: function(number, label) {
		var checked = this.state.checked[number];

		return React.DOM.label({
				className: "btn btn-secondary" + (checked ? " active" : "")
			},
			React.DOM.input({
				type: "checkbox",
				autoComplete: "off",
				onChange: this.handleChange.bind(this, number, !checked)
			}), label
		);
	},
  handleValidateBed: function() {
    this.setState({
      buttondisable: true
    });

    this.props.callback();
  },
	render: function() {
    var formatMessage = this.props.intl.formatMessage;
    var disabled = this.state.buttondisable ? " disabled" : "";
    var style = this.state.buttondisable ? " btn-default" : " btn-success";

		return React.DOM.div({
      id: "bedroom"
    },
      React.DOM.div(null, formatMessage({
				id: "postapt-bed-title"
			})), React.DOM.div({
				className: "btn-group",
				"data-toggle": "buttons"
			},
			this.createButton(0, "Studio"),
			this.createButton(1, "1"),
			this.createButton(2, "2"),
			this.createButton(3, "3"),
			this.createButton(4, "4+")
		),
    React.DOM.div(null,
      React.DOM.button({
        className: "btn" + disabled + style,
        onClick: this.handleValidateBed
      }, formatMessage({
          id: "postapt-button"
        })
    )));
	}
}));
