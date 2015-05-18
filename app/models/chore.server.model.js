'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Chore Schema
 */
var ChoreSchema = new Schema({
	order: {
		type: Number
	},
	heading: {
		type: Boolean
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Chore name',
		trim: true
	},
	points: {
		type: Number,
		default: 0
	},
	family: {
		type: Schema.ObjectId,
		ref: 'Family'
	},
	template: {
		type: Boolean
	}
});

mongoose.model('Chore', ChoreSchema);
