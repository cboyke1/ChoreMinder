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
	name: {
		type: String,
		default: '',
		required: 'Please fill Chore name',
		trim: true
	},
	points: {
		type: Number,
		default: 0
	}
});

mongoose.model('Chore', ChoreSchema);
