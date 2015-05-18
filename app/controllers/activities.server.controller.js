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
	AWS = require('aws-sdk'),
	_ = require('lodash');

AWS.config.loadFromPath('./auth/aws.json');

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

	Chore.find({family: req.user.family}).exec(function(err, chores) {
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

function sendSMSForUser(activity,user) {
	var smsTopic = user.smsTopic;
	if(!smsTopic) {
		console.log('no topic for user: ' + user.displayName);
		return;
	}
	var sns = new AWS.SNS({params: {TopicArn: smsTopic}});
	sns.publish({Message: activity.chore.name + '\n' + activity.notes}, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);           // successful response
	});
}

function sendSMSForActivity(activity) {
	console.log('SEND SMS for activity');

	// Use mongoose to populate all fields.

	Activity.findById(activity._id).populate('users chore').exec(function(err, activity) {
		if(err) {
			console.log(err);
		} else {
			console.log(activity);
			for(var i=0;i<activity.users.length;i++) {
				sendSMSForUser(activity,activity.users[i]);
			}

		}
	});
}

/**
 * Create an Activity
 */
exports.create = function(req, res) {
	console.log('CREATE');
	var activity = new Activity(req.body);
	console.log(activity);
	activity.createdBy = req.user;
	activity.family = req.user.family;

	if(req.user.child) {
		console.log('YES');
		activity.status='pending';
	}
	console.log(activity.users);
	if(verbose) console.log(activity);

	activity.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			updatePoints(activity.users);
			if(activity.status==='assigned') {
				sendSMSForActivity(activity);
			}
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
 * List of Activities - fetch all for family
 */
exports.list = function(req, res) {
	console.log('LIST');
	if(!req.user.family) {
		res.jsonp({});
		return;
	}
	var criteria={family: req.user.family};
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

exports.migrate = function(req, res, next) {
	Activity.find().exec(function(err, activities) {
		for(var i=0; i < activities.length ; i++) {
			var a = activities[i];
			if(a.user && (!a.users || a.users[length]===0)) {
				console.log('Updating activity ' + a._id);

				a.users = [ a.user ];

				a.user = undefined;
				a.save();
			}
		}
	});

	Chore.find().exec(function(err, chores) {
		for(var i=0; i<chores.length; i++) {
			var c = chores[i];
			if(!c.family) {
				c.family = req.user.family;
				console.log('Updating Chore ' + c._id);
				c.save();
			}
		}
	});
	return res.status(200);
};
