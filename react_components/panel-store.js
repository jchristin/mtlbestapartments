"use strict";

var Reflux = require("reflux"),
	actions = require("./actions.js");

module.exports = Reflux.createStore({
	init: function() {
		this.isActivated = false;
		this.listenTo(actions.togglePanel, this.handleTogglePanel);
	},

	handleTogglePanel: function() {
		this.isActivated = !this.isActivated;
		this.trigger(this.isActivated);
	}
});
