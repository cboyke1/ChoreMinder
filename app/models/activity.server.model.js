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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
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
