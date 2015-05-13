'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Chore = mongoose.model('Chore'),
	_ = require('lodash');

/**
 * Create a Chore
 */
exports.create = function(req, res) {
	var chore = new Chore(req.body);
	chore.user = req.user;

	chore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chore);
		}
	});
};

/**
 * Show the current Chore
 */
exports.read = function(req, res) {
	res.jsonp(req.chore);
};

/**
 * Update a Chore
 */
exports.update = function(req, res) {
	var chore = req.chore ;

	chore = _.extend(chore , req.body);

	chore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chore);
		}
	});
};

/**
 * Delete an Chore
 */
exports.delete = function(req, res) {
	var chore = req.chore ;

	chore.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chore);
		}
	});
};

/**
 * List of Chores
 */
exports.list = function(req, res) {
	Chore.find().sort('-created').populate('user', 'displayName').exec(function(err, chores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chores);
		}
	});
};

/**
 * Chore middleware
 */
exports.choreByID = function(req, res, next, id) {
	Chore.findById(id).populate('user', 'displayName').exec(function(err, chore) {
		if (err) return next(err);
		if (! chore) return next(new Error('Failed to load Chore ' + id));
		req.chore = chore ;
		next();
	});
};

/**
 * Chore authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf('admin') == -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
