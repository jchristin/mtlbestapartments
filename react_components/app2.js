/* global module:true */

"use strict";

var React = require("react"),
	Ribbon = require("react-ribbon").Ribbon,
	Tile = require("react-ribbon").Tile,
	Canvas = require("./map");

var BrandTile = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("img", {
				src: "/img/logo.svg"
			})
		);
	}
});

var UpTile = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "up"
			},
			React.createElement("i", {
				className: "fa fa-arrow-circle-o-up",
			})
		);
	}
});

var PrevTile = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "prev"
			},
			React.createElement("i", {
				className: "fa fa-arrow-circle-o-left",
			})
		);
	}
});

var NextTile = React.createClass({
	render: function() {
		return React.createElement("div", {
				className: "next"
			},
			React.createElement("i", {
				className: "fa fa-ellipsis-h",
			})
		);
	}
});

var PriceMenuItem = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("i", {
				className: "fa fa-usd"
			}),
			React.createElement("div", null, "Price")
		);
	}
});

var PriceTile = require("./price");

var RoomMenuItem = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("i", {
				className: "fa fa-home"
			}),
			React.createElement("div", null, "Bedroom")
		);
	}
});

var ZoneMenuItem = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("i", {
				className: "fa fa-map-marker"
			}),
			React.createElement("div", null, "Zone")
		);
	}
});

var BedroomTile = require("./bedroom");

module.exports = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(Ribbon, {
					brandTile: BrandTile,
					upTile: UpTile,
					prevTile: PrevTile,
					nextTile: NextTile,
				},
				React.createElement(Tile, {
						component: PriceMenuItem
					},
					React.createElement(Tile, {
						size: 3,
						component: PriceTile
					})
				),
				React.createElement(Tile, {
						component: RoomMenuItem
					},
					React.createElement(Tile, {
						size: 3,
						component: BedroomTile
					})
				),
				React.createElement(Tile, {
					component: ZoneMenuItem
				})
			),
			React.createElement("div", {
					className: "map-container-ribbon"
				},
				React.createElement(Canvas)
			)
		);
	}
});
