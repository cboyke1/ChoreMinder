'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Family Schema
 */
var FamilySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Family name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	children: [{type: Schema.ObjectId, ref: 'User'}],
  parents: [{type: Schema.ObjectId, ref: 'User'}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Family', FamilySchema);
