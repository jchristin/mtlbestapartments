"use strict";

module.exports = function(criterion, apartment) {
	if (apartment.price >= criterion.min && apartment.price <= criterion.max) {
		return 5;
	}

	return 0;
};
