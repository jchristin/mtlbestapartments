"use strict";

var React = require("react"),
	LayoutCard = require("./layout-card"),
	LayoutMap = require("./layout-map"),
	LayoutList = require("./layout-list"),
	Layouts = require("./layouts"),
	Modal = require("./modal"),
	Apartment = require("./apartment"),
	_ = require("lodash"),
	request = require("superagent"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	displayName: "Layout",
	contextTypes: {
		track: React.PropTypes.func,
		router: React.PropTypes.object.isRequired,
		lang: React.PropTypes.string
	},
	getInitialState: function() {
		return {
			layoutType: null,
			currentApartmentId: this.props.currentApartmentId
		};
	},
	componentWillMount: function() {
		request.get("/api/layout").end(function(err, res) {
			if (err && err.status !== 404) {
				console.log(err);
			} else if (res.body === null) {
				this.setState({
					layoutType: "card"
				});
			} else {
				this.setState({
					layoutType: res.body
				});
			}
		}.bind(this));
	},
	handleModalClose: function() {
		this.context.router.push("/" + this.context.lang + "/");
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			currentApartmentId: nextProps.currentApartmentId
		});
	},
	storeLayoutType: function(layoutType) {
		request
			.post("/api/layout")
			.send({
				type: "layout",
				layout: layoutType
			})
			.end(function(err) {
				if (err) {
					console.log(err);
				}
			});
	},
	handleClick: function(type) {
		this.context.track("changeLayout", type);
		this.setState({
			layoutType: type
		});
		this.storeLayoutType(type);
	},
	createButton: function(layout, checked) {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.button({
				key: layout.type,
				type: "button",
				onClick: this.handleClick.bind(this, layout.type),
				className: "btn btn-secondary" + (checked ? " active" : "")
			},
			formatMessage({
				id: layout.id
			})
		);
	},
	render: function() {
		var content = null;

		switch (this.state.layoutType) {
			case "card":
				content = React.createElement(LayoutCard, {
					apartments: this.props.apartments
				});
				break;

			case "map":
				content = React.createElement(LayoutMap, {
					apartments: this.props.apartments
				});
				break;

			case "list":
				content = React.createElement(LayoutList, {
					apartments: this.props.apartments
				});
				break;

			default:
				// Not handled yet.
				if (this.state.layoutType) {
					console.log(this.state.layoutType);
				}

				break;
		}

		return React.DOM.div(null,
			React.DOM.div({
					className: "text-xs-right"
				},
				React.DOM.div({
						className: "btn-group layout-selector",
						role: "group"
					},
					_.map(Layouts, _.bind(function(layout) {
						return this.createButton(layout, this.state.layoutType === layout.type);
					}, this))
				)
			),
			content,
			this.state.currentApartmentId ? React.createElement(Modal, {
					onRequestClose: this.handleModalClose
				},
				React.createElement(Apartment, {
					apartmentId: this.state.currentApartmentId
				})
			) : null
		);
	}
}));
