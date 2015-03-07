"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js");

module.exports = Reflux.createStore({
	init: function() {
		this.isActivated = false;
		this.position = -1;

		this.listenTo(actions.togglePanel, this.handleTogglePanel);
		this.listenTo(actions.hidePanel, this.handleHidePanel);
	},
	handleTogglePanel: function(position, content) {
		if (position != this.position) {
			this.isActivated = true;
		} else {
			this.isActivated = !this.isActivated;
		}

		this.position = position;
		this.trigger(this.isActivated, position, content);
	},
	handleHidePanel: function() {
		this.isActivated = false;
		this.trigger(this.isActivated);
	}
});
