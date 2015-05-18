'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
	// for compatibility
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	users: [{type: Schema.ObjectId, ref: 'User'}],
	family: {
		type: Schema.ObjectId,
		ref: 'Family'
	},
	chore: {
		type: Schema.ObjectId,
		ref: 'Chore'
	},
	points: {
		type: Number
	},
	notes: {
		type: String
	},
	status: {
		type: String,
		enum: ['open','assigned','pending','approved','rejected']
	},
	created: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
});

mongoose.model('Activity', ActivitySchema);
