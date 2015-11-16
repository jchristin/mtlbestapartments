"use strict";

module.exports = function(criterion, apartment) {
	if (apartment.room >= criterion.min && apartment.room <= criterion.max) {
		return 5;
	}

	return 0;
};
