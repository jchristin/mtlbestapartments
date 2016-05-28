/* global module:true */

"use strict";

var React = require("react"),
injectIntl = require("react-intl").injectIntl,
Dropzone = require('react-dropzone');

module.exports = injectIntl(React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  onDrop: function (files) {
    console.log('Received files: ', files);
  },
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
      id: this.props.id
    },
      React.DOM.div(null, formatMessage({
				id: "postapt-pics-title"
			})),
      React.createElement(Dropzone, {
        onDrop: this.onDrop
  	  })
    );
	}
}));
