/* global module:true */

"use strict";

var React = require("react"),
	injectIntl = require("react-intl").injectIntl,
  Dropzone = require('react-dropzone'),
  _ = require("lodash"),
	Masonry = require("react-masonry-component");
  // umbnail = require("./thumbnail");

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function () {
		return {files: []};
	},
	onDrop: function (files) {
		this.setState({files: this.state.files.concat(files)});
	},
	handleMouseOver: function(key) {
		console.log("key = " + key);
	},
	render: function () {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
			id: this.props.id,
			className: "layout"
		},
		React.DOM.div(null, formatMessage({id: "postapt-pics-title"})),
		React.createElement(Dropzone, {
        onDrop: this.onDrop
	  }),
		React.DOM.div({
			className: "thumbnail-pics"
		}, React.createElement(Masonry, {
			className: "masonry",
			options: {
				gutter: 14
			},
			disableImagesLoaded: false
		}, _.map(this.state.files, _.bind(function (file, key) {
			return React.DOM.div({
				className: "thumbnail",
				key: key,
				onMouseOver: this.handleMouseOver.bind(this, key)
			}, React.DOM.img({
				className: "thumbnail-img",
				src: file.preview
			}));
		}, this))))
	);
	}
}));
