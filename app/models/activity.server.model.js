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
	name: {
		type: String,
		default: '',
		required: 'Please fill Activity name',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
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
