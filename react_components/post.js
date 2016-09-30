/* global module:true */

"use strict";

var React = require("react"),
	PostMap = require("./post-map"),
	PostBed = require("./post-bed"),
	PostPrice = require("./post-price"),
	PostPics = require("./post-pics"),
	_ = require("lodash"),
	Request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
		user: React.PropTypes.object
	},
	componentDidMount: function() {
		this.address = "";
		this.bed = 0;
		this.price = 0;
		this.imageslink = [];
	},
	getInitialState: function() {
		return {
			showMap: true,
			showBed: false,
			showPrice: false,
			showPics: false
		};
	},
	callbackMap: function(address) {
		this.address = address;
		this.setState({
			showBed: true
		});
	},
	callbackBed: function(bed) {
		this.bed = bed;
		this.setState({
			showPrice: true
		});
	},
	callbackPrice: function(price) {
		this.price = price;
		this.setState({
			showPics: true
		});
	},
	callbackPics: function(pictures) {
		_.forEach(pictures, _.bind(function(picture) {
			this.imageslink.push("https://fleub.s3.amazonaws.com/" + picture.uuid);
		}, this));

		// Upload pictures to S3 repo.
		var data = pictures.length;
		_.forEach(pictures, _.bind(function(picture) {
			Request.post("/api/upload/" + picture.uuid)
				.set("Content-Type", "application/octet-stream")
				.send(picture)
				.end(function(err) {
					if (err) {
						console.log(err);
					}

					data -= 1;
					if (data === 0) {
						this.postApt();
					}
				}.bind(this));
		}, this));
	},
	postApt: function() {
		Request.post("/api/apart/")
		.send({
			address: this.address,
			price: this.price,
			room: this.bed,
			images: this.imageslink,
			source: "mtlbestapartments",
			url: null,
			user: this.context.user._id
		})
		.end(function(err) {
			if (err) {
				console.log(err);
			}
		});
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
			className: "post-apt"
		}, React.DOM.strong(null, formatMessage({
			id: "postapt-title"
		})),
		React.DOM.div(null,
			React.DOM.div({
				className: this.state.showMap ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostMap, {
				id: "map",
				callback: this.callbackMap
			})))),
			React.DOM.div({
				className: this.state.showBed ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostBed, {
				id: "bed",
				callback: this.callbackBed
			})))),
			React.DOM.div({
				className: this.state.showPrice ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostPrice, {
				id: "price",
				callback: this.callbackPrice
			})))),
			React.DOM.div({
				className: this.state.showPics ? "post-show" : "post-hide"
			},
			React.DOM.div({
				className: "card"
			}, React.DOM.div({
				className: "card-block"
			}, React.createElement(PostPics, {
				id: "pics",
				callback: this.callbackPics
			})))),
			React.DOM.div({
				className: "post-apt-empty-end"
			}, "")
		));
	}
}));
