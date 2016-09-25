/* global module:true */

"use strict";

var React = require("react"),
	injectIntl = require("react-intl").injectIntl,
	Dropzone = require("react-dropzone"),
	_ = require("lodash"),
	Masonry = require("react-masonry-component"),
	Request = require("superagent"),
	Uuid = require("node-uuid");

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
		user: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			files: []
		};
	},
	onDrop: function(files) {
		this.setState({
			files: this.state.files.concat(files)
		});

		_.forEach(files, _.bind(function(file) {
			file.uuid = Uuid.v1();
			this.uploadFile(file);
		}, this));
	},
	moveLeft: function(key) {
		if (key > 0) {
			this.state.files.splice(key - 1, 0, this.state.files.splice(key, 1)[0]);
			this.forceUpdate();
		}
	},
	handleDelete: function(key) {
		var file = this.state.files[key];
		file.id = "changing";
		file.icon = "fa-trash";
		this.forceUpdate();
		Request.del("/api/upload/?subbucket=" + this.context.user._id + "&key=" + file.name)
			.end(function(err) {
				if (err) {
					console.log(err);
				} else {
					_.pullAt(this.state.files, key);
					this.forceUpdate();
				}
			}.bind(this));
	},
	uploadFile: function(file) {
		file.id = "changing";
		file.icon = "fa-refresh";
		this.forceUpdate();
		Request.post("/api/upload/?subbucket=" + this.context.user._id + "&key=" + file.name)
			.set("Content-Type", "application/octet-stream")
			.send(file)
			.end(function(err) {
				if (err) {
					console.log(err);
				} else {
					file.id = "";
					this.forceUpdate();
				}
			}.bind(this));
	},
	moveRight: function(key) {
		this.state.files.splice(key + 1, 0, this.state.files.splice(key, 1)[0]);
		this.forceUpdate();
	},
	handleValidate: function() {
      this.props.callback(this.state.files);
    },
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
			id: this.props.id,
			className: "layout"
		}, React.DOM.h4({
			className: "card-title"
		}, formatMessage({
			id: "postapt-pics-title"
		})), React.DOM.div({
			className: "thumbnail-pics"
		}, React.createElement(Masonry, {
			className: "masonry",
			options: {
				gutter: 14
			},
			disableImagesLoaded: false
		}, _.map(this.state.files, _.bind(function(file, key) {
			return React.DOM.div({
				className: "grid-item card",
				key: key
			}, React.DOM.div({
				className: "thumbnail-img-container",
				id: file.id || ""
			}, React.DOM.img({
				className: "thumbnail-img",
				src: file.preview
			}), React.DOM.a({
				className: "thumbnail-img-options"
			}, React.DOM.span({
				className: "fa " + file.icon + " fa-spin fa-2x"
			})), React.DOM.div({
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
			})), React.DOM.div({
				className: "thumbnail-option"
			}, React.DOM.i({
				className: "fa fa-arrow-right",
				onClick: this.moveRight.bind(this, key)
			}))))));
		}, this)), React.createElement(Dropzone, {
			onDrop: this.onDrop,
			accept: "image/*"
		}))), React.DOM.div(null, React.DOM.button({
			className: "btn btn-success",
			onClick: this.handleValidate
		}, formatMessage({
			id: "postapt-button"
		}))));
	}
}));
