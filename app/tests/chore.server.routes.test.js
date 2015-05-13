'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Chore = mongoose.model('Chore'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, chore;

/**
 * Chore routes tests
 */
describe('Chore CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Chore
		user.save(function() {
			chore = {
				name: 'Chore Name'
			};

			done();
		});
	});

	it('should be able to save Chore instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chore
				agent.post('/chores')
					.send(chore)
					.expect(200)
					.end(function(choreSaveErr, choreSaveRes) {
						// Handle Chore save error
						if (choreSaveErr) done(choreSaveErr);

						// Get a list of Chores
						agent.get('/chores')
							.end(function(choresGetErr, choresGetRes) {
								// Handle Chore save error
								if (choresGetErr) done(choresGetErr);

								// Get Chores list
								var chores = choresGetRes.body;

								// Set assertions
								(chores[0].user._id).should.equal(userId);
								(chores[0].name).should.match('Chore Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Chore instance if not logged in', function(done) {
		agent.post('/chores')
			.send(chore)
			.expect(401)
			.end(function(choreSaveErr, choreSaveRes) {
				// Call the assertion callback
				done(choreSaveErr);
			});
	});

	it('should not be able to save Chore instance if no name is provided', function(done) {
		// Invalidate name field
		chore.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chore
				agent.post('/chores')
					.send(chore)
					.expect(400)
					.end(function(choreSaveErr, choreSaveRes) {
						// Set message assertion
						(choreSaveRes.body.message).should.match('Please fill Chore name');
						
						// Handle Chore save error
						done(choreSaveErr);
					});
			});
	});

	it('should be able to update Chore instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chore
				agent.post('/chores')
					.send(chore)
					.expect(200)
					.end(function(choreSaveErr, choreSaveRes) {
						// Handle Chore save error
						if (choreSaveErr) done(choreSaveErr);

						// Update Chore name
						chore.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Chore
						agent.put('/chores/' + choreSaveRes.body._id)
							.send(chore)
							.expect(200)
							.end(function(choreUpdateErr, choreUpdateRes) {
								// Handle Chore update error
								if (choreUpdateErr) done(choreUpdateErr);

								// Set assertions
								(choreUpdateRes.body._id).should.equal(choreSaveRes.body._id);
								(choreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Chores if not signed in', function(done) {
		// Create new Chore model instance
		var choreObj = new Chore(chore);

		// Save the Chore
		choreObj.save(function() {
			// Request Chores
			request(app).get('/chores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Chore if not signed in', function(done) {
		// Create new Chore model instance
		var choreObj = new Chore(chore);

		// Save the Chore
		choreObj.save(function() {
			request(app).get('/chores/' + choreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', chore.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Chore instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chore
				agent.post('/chores')
					.send(chore)
					.expect(200)
					.end(function(choreSaveErr, choreSaveRes) {
						// Handle Chore save error
						if (choreSaveErr) done(choreSaveErr);

						// Delete existing Chore
						agent.delete('/chores/' + choreSaveRes.body._id)
							.send(chore)
							.expect(200)
							.end(function(choreDeleteErr, choreDeleteRes) {
								// Handle Chore error error
								if (choreDeleteErr) done(choreDeleteErr);

								// Set assertions
								(choreDeleteRes.body._id).should.equal(choreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Chore instance if not signed in', function(done) {
		// Set Chore user 
		chore.user = user;

		// Create new Chore model instance
		var choreObj = new Chore(chore);

		// Save the Chore
		choreObj.save(function() {
			// Try deleting Chore
			request(app).delete('/chores/' + choreObj._id)
			.expect(401)
			.end(function(choreDeleteErr, choreDeleteRes) {
				// Set message assertion
				(choreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Chore error error
				done(choreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Chore.remove().exec();
		done();
	});
});