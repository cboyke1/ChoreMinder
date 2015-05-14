'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var activities = require('../../app/controllers/activities.server.controller');

	// Activities Routes
	app.route('/activities')
		.get(activities.list)
		.post(users.hasAuthorization(['parent']), activities.create);

	app.route('/activities-mine')
		.get(activities.listMine);
		
	app.route('/activities/:activityId')
		.get(activities.read)
		.put(users.requiresLogin, activities.hasAuthorization, activities.update)
		.delete(users.requiresLogin, activities.hasAuthorization, activities.delete);

	app.route('/acInitForm')
		.get(activities.initForm);

	// Finish by binding the Activity middleware
	app.param('activityId', activities.activityByID);
};
