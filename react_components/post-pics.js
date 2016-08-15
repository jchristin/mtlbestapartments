/* global module:true */

"use strict";

var React = require("react"),
	injectIntl = require("react-intl").injectIntl,
	Dropzone = require('react-dropzone'),
	_ = require("lodash"),
	Masonry = require("react-masonry-component");

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
	handleClick: function (key) {
		_.pullAt(this.state.files, key);
		this.forceUpdate();
	},
	render: function () {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
			id: this.props.id,
			className: "layout"
		}, React.DOM.h4({
			className: "card-title"
		}, formatMessage({id: "postapt-pics-title"})),
		React.createElement(Dropzone, {onDrop: this.onDrop}), React.DOM.div({
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
				key: key
			}, React.DOM.div({
				className: "thumbnail-img-container"
			}, React.DOM.img({className: "thumbnail-img", src: file.preview}),
			React.DOM.a({
				className: "thumbnail-img-options"
			}, React.DOM.span({
				className: "fa fa-trash-o fa-2x",
				onClick: this.handleClick.bind(this, key)
			}))));
		}, this)))));
	}
}));
