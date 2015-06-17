'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Activity = mongoose.model('Activity'),
	User = mongoose.model('User'),
	_ = require('lodash');

function handleErr(err, res) {
		if(err) {
			console.log(err);
			return res.status(400).send({ message: errorHandler.getErrorMessage(err)});
		}
	}


exports.read = function(req, res) {
	Activity.find({'users': req.child._id}).sort('-created').limit(100).populate('chore users').exec(function(err,acts) {
		if (err) return handleErr(err,res);
		res.jsonp({activities: acts, child: req.child});
	});
};


/**
 * middleware
 */
exports.childByID = function(req, res, next, id) {
	console.log('find child ' + id);
	User.findById(id).exec(function(err, child) {
		if (err) return next(err);
		if (! child) return next(new Error('Failed to load child ' + id));
		req.child = child ;
		next();
	});
};

/**
 * Family authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user.admin) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
