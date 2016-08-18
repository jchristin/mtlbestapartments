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
	moveLeft: function (key) {
		if (key > 0) {
			this.state.files.splice(key - 1, 0, this.state.files.splice(key, 1)[0]);
			this.forceUpdate();
		}
	},
	handleDelete: function (key) {
		_.pullAt(this.state.files, key);
		this.forceUpdate();
	},
	moveRight: function (key) {
		this.state.files.splice(key + 1, 0, this.state.files.splice(key, 1)[0]);
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
		React.DOM.div({
			className: "thumbnail-pics"
		}, React.createElement(Masonry, {
			className: "masonry",
			options: {
				gutter: 14
			},
			disableImagesLoaded: false
		},
		_.map(this.state.files, _.bind(function (file, key) {
			return React.DOM.div({
				className: "grid-item card",
				key: key
			}, React.DOM.div({
				className: "thumbnail-img-container"
			}, React.DOM.img({
				className: "thumbnail-img",
				src: file.preview
			}), React.DOM.div({
				className: "card-block"
			}, React.DOM.div({
				className: "thumbnail-options-container"
			}, React.DOM.div({
				className: "thumbnail-option"
			}, React.DOM.i({
				className: "fa fa-arrow-left",
				onClick: this.moveLeft.bind(this, key)
			})), React.DOM.div({
				className: "thumbnail-option"
			}, React.DOM.i({
				className: "fa fa-times-circle-o",
				onClick: this.handleDelete.bind(this, key)
			})),  React.DOM.div({
				className: "thumbnail-option"
			}, React.DOM.i({
				className: "fa fa-arrow-right",
				onClick: this.moveRight.bind(this, key)
			}))))));
		}, this)),
		React.createElement(Dropzone, {onDrop: this.onDrop})
	)));
	}
}));
