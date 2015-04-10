var Reflux = require("reflux");

module.exports = {
	togglePanel: Reflux.createAction(),
	hidePanel: Reflux.createAction(),
	setPrice: Reflux.createAction(),
	setBedroom: Reflux.createAction(),
	addBorough: Reflux.createAction(),
	removeBorough: Reflux.createAction()
};
