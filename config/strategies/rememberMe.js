'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	RememberMeStrategy = require('passport-remember-me').Strategy,
	Token = require('../../app/token'),
	User = require('mongoose').model('User');




module.exports = function() {
	passport.use(new RememberMeStrategy(
		function(token, done) {
			Token.consumeRememberMeToken(token, function(err, uid) {
	      if (err) {
					console.log(err);
					return done(err);
				}
	      if (!uid) {
					console.log('No UID found ');
					return done(null, false);
				}

	      User.findById(uid, function(err, user) {
	        if (err) {
						console.log(err);
						return done(err);
					}
	        if (!user) {
						console.log('user not found');
						return done(null, false);
					}
					console.log('Valid User');
					console.log(user);
	        return done(null, user);
	      });
    	});
  	},
  	Token.issueToken
	));
};
