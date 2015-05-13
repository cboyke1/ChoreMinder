'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var chores = require('../../app/controllers/chores.server.controller');

	// Chores Routes
	app.route('/chores')
		.get(chores.list)
		.post(users.requiresLogin, chores.create);

	app.route('/chores/:choreId')
		.get(chores.read)
		.put(users.requiresLogin, chores.hasAuthorization, chores.update)
		.delete(users.requiresLogin, chores.hasAuthorization, chores.delete);

	// Finish by binding the Chore middleware
	app.param('choreId', chores.choreByID);
};
