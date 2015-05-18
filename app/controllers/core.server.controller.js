'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	console.log('render core index');
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
