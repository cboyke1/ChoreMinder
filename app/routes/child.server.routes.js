'use strict';

module.exports = function(app) {
	var child = require('../../app/controllers/child.server.controller');

	console.log('child server route');

	app.route('/child/:childId')
		.get(child.read);

	// Finish by binding the middleware
	app.param('childId', child.childByID);
};
