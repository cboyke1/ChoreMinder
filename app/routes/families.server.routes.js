'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var families = require('../../app/controllers/families.server.controller');

	// Families Routes
	app.route('/families')
		.get(families.list)
		.post(users.requiresLogin, families.create);

	app.route('/families/:familyId')
		.get(families.read)
		.put(users.requiresLogin, families.hasAuthorization, families.update)
		.delete(users.requiresLogin, families.hasAuthorization, families.delete);

	// Finish by binding the Family middleware
	app.param('familyId', families.familyByID);
};
