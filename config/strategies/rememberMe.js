'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	RememberMeStrategy = require('passport-remember-me').Strategy,
	Token = require('../../app/token'),
	User = require('mongoose').model('User');




module.exports = function() {
	console.log('remember me');
	passport.use(new RememberMeStrategy(

		function(token, done) {
			Token.consumeRememberMeToken(token, function(err, uid) {
	      if (err) { return done(err); }
	      if (!uid) { return done(null, false); }

	      User.findById(uid, function(err, user) {
	        if (err) { return done(err); }
	        if (!user) { return done(null, false); }
	        return done(null, user);
	      });
    	});
  	},
  	Token.issueToken
	));
};
