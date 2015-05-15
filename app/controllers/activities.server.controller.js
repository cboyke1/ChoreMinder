'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Activity = mongoose.model('Activity'),
	Chore = mongoose.model('Chore'),
	Family = mongoose.model('Family'),
	User = mongoose.model('User'),
	_ = require('lodash');

function sendError(err,res) {
	res.status(400).send({ message: errorHandler.getErrorMessage(err) });
}

var verbose=true;


/* Recalculate points for one user */
function updateUserPoints(userId) {

	User.findById(userId, '-salt -password',function(err,user) {
			if(err) {
				console.log(err);
				return;
			}
			console.log('updating points for ' + user.displayName);
			Activity.find({'users': user._id, 'status': 'approved'},function(err,res) {
				if(err) return;
				var points=0;
				console.log(res.length + ' activities for ' + user.displayName);
				for(var i=0; i<res.length; i++) {
					points = points + res[i].points;
				}
				console.log('Total: ' + points);
				user.points=points;
				user.save(function(err) {
					if(err) console.log(err);
				});
			});
	});
}

/* Update points for an array of users */
function updatePoints(users) {
	for(var i=0; i < users.length ; i++) {
		updateUserPoints(users[i]);
	}
}


/**
 * Prepare data for the form
 */
exports.initForm = function(req, res) {
	// Get all chores (for this family)

	Chore.find().exec(function(err, chores) {
		if (err) {
			return sendError(err,res);
		} else {
			Family.findById(req.user.family)
				.populate({path: 'children',
									 select: '_id displayName points'})
				.exec(function(err, family) {
				if (err) {
					return sendError(err,res);
				} else {
					var data={'chores' : chores, 'family' : family};
					res.jsonp(data);
				}
			});
		}
	});
};

/**
 * Create an Activity
 */
exports.create = function(req, res) {
	var activity = new Activity(req.body);
	activity.createdBy = req.user;
	activity.family = req.user.family;

	if(req.user.child) {
		activity.status='pending';
	}
	if(verbose) console.log(activity);

	activity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			updatePoints(activity.users);
			res.jsonp(activity);
		}
	});
};

/**
 * Show the current Activity
 */
exports.read = function(req, res) {
	res.jsonp(req.activity);
};

/**
 * Update an Activity
 */
exports.update = function(req, res) {
	var activity = req.activity ;

	activity = _.extend(activity , req.body);

	activity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			updatePoints(activity.users);
			res.jsonp(activity);
		}
	});
};

/**
 * Delete an Activity
 */
exports.delete = function(req, res) {
	var activity = req.activity ;
	var users = activity.users;
	console.log('In remove');
	activity.remove(function(err) {
		if (err) {
			console.log(err);
		} else {
			updatePoints(users);
			console.log('delete successful');
			res.jsonp({});
		}
	});
};

/**
 * List of Activities
 */
exports.list = function(req, res) {
	var criteria={};
	if(req.user.child) {
		criteria={users: req.user._id};
	} else {
		criteria={family: req.user.family};
	}
	Activity.find(criteria).sort('-created').populate('chore users').exec(function(err, activities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activities);
		}
	});
};

/**
 * List of Activities
 */
exports.listMine = function(req, res) {
	Activity.find({users: req.user }).sort('-created').populate('chore users').exec(function(err, activities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activities);
		}
	});
};

/**
 * Activity middleware
 */
exports.activityByID = function(req, res, next, id) {
	Activity.findById(id).populate('createdBy users chore').exec(function(err, activity) {
		if (err) return next(err);
		console.log(activity);
		if (! activity) return next(new Error('Failed to load Activity ' + id));
		req.activity = activity ;
		next();
	});
};

/**
 * Activity authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	console.log('authorization activity');

	console.log('user roles:' + req.user.roles);

	var auth2 = (req.activity.family.toString() === req.user.family.toString());
	if(req.user.parent && auth2) {
		next();
	} else {
		return res.status(403).send('User is not authorized');
	}
};
