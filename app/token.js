'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Token = mongoose.model('Token');


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(len) {
  var buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

function saveRememberMeToken(token, uid, fn) {
  console.log('saving token: ' + token);
  var item = new Token({'token': token,
                         user: uid});

	item.save(function(err) {
		if (err) {
      console.log('Error saving token: ' + uid);
      return null;
		} else {
      return fn();
		}
	});
}

// Read a token from the cookie and look it up in the DB
module.exports.consumeRememberMeToken = function(token, fn) {
  console.log('reading token ' + token);
  Token.findOne({'token': token},function(err,res) {
    if(err) {
      console.log(err);
      return null;
    }
    var uid=null;
    if(res) {
      uid=res.user;
      console.log('found user: ' + uid);
    } else {
      console.log('Token not found');
    }
    // Now delete it
    Token.remove({'token': token},function(err) {
      if(err) {
        console.log(err);
        return null;
      }
    });
    return fn(null,uid);
  });
};


module.exports.issueToken = function(user, done) {
  var token = randomString(64);
  saveRememberMeToken(token, user._id, function(err) {
    if (err) {
      console.log('Error issuing token: ' + err);
      return done(err);
    }
    return done(null, token);
  });
};
