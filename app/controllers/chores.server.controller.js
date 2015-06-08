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
	chore.family = req.user.family;

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
	chore.family = req.user.family;

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
	Chore.find({family: req.user.family}).sort('order').exec(function(err, chores) {
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
 * List of Chores
 */
exports.listByFamily = function(req, res) {
	console.log('listByFamily');
	var id = req.params.familyId;
	console.log('family ID: ' + id);
	Chore.find({family: id}).sort('order').exec(function(err, chores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp({chores:chores});
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

function handleErr(err, res) {
		if(err) {
			console.log(err);
			return res.status(400).send({ message: errorHandler.getErrorMessage(err)});
		}
	}

function setOrder(id,i,res) {
	console.log('order: ' + id + '= ' + i);
	Chore.findById(id).exec(function(err, chore) {
		if(err) return handleErr(err,res);
		if(chore) {
			chore.order = i;
			chore.save();
		}
	});
}

exports.reorder = function(req,res) {
	if (!(req.user.parent && req.user.family.toString() === req.body.chores[0].family.toString() )) {
		return res.status(403).send('User is not authorized');
	}

	console.log(req.body.chores);
	var chores = req.body.chores;

	for(var i=0 ; i < chores.length ; i++) {
		var choreId = chores[i]._id;
		setOrder(choreId,i,res);
	}
};

/**
 * Chore authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!(req.user.parent && req.user.family.toString() === req.chore.family.toString() )) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
