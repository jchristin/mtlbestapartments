/* global module:true */

"use strict";

var React = require("react");

module.exports = React.createClass({
	getInitialState: function() {
		this.editable = (false || this.props.editable);
		this.stateFinal = [];
		this.stateDisplay = [];

		var initStars = (0 || this.props.stars);

		for (var i = 0; i < 5; i++) {
			if (i < initStars) {
				this.stateFinal.push(true);
				this.stateDisplay.push(true);
			} else {
				this.stateFinal.push(false);
				this.stateDisplay.push(false);
			}
		}

		return {stateFinal: this.stateFinal, stateDisplay: this.stateDisplay};
	},
	handleOnClick: function(starIdx) {
		for (var i = 0; i < 5; i++) {
			if (i == starIdx) {
				this.stateFinal[starIdx] = !this.stateFinal[starIdx];
			} else if (i < starIdx) {
				this.stateFinal[i] = true;
			} else if (i > starIdx) {
				this.stateFinal[i] = false;
			}
		}

		this.setState({stateDisplay: this.stateFinal});
	},
	handleOnMouseOver: function(starIdx) {
		for (var i = 0; i < 5; i++) {
			if (i <= starIdx) {
				this.stateDisplay[i] = true;
			} else {
				this.stateDisplay[i] = false;
			}
		}

		if (this.props.editable) {
			this.setState({stateDisplay: this.stateDisplay});
		}
	},
	handleOnMouseOut: function(starIdx) {
		if (this.props.editable) {
			this.setState({stateDisplay: this.stateFinal});
		}
	},
	render: function() {
		var starsLayout = [];

		for (var i = 0; i < 5; i++) {
			var className = "fa fa-star";

			if (!this.state.stateDisplay[i]) {
				className += "-o";
			}

			var layout = React.createElement("i", {
				key: i,
				className: className,
				onClick: (function(i) {
					this.handleOnClick(i);
				}).bind(this, i),
				onMouseOver: (function(i) {
					this.handleOnMouseOver(i);
				}).bind(this, i),
				onMouseOut: (function(i) {
					this.handleOnMouseOut(i);
				}).bind(this, i)
			});

			starsLayout.push(layout);
		}

		return React.createElement("div", {
			className: "edit-stars"
		}, starsLayout);
	}
});
