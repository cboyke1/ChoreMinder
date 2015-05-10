'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Family = mongoose.model('Family'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, family;

/**
 * Family routes tests
 */
describe('Family CRUD tests', function() {
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

		// Save a user to the test db and create new Family
		user.save(function() {
			family = {
				name: 'Family Name'
			};

			done();
		});
	});

	it('should be able to save Family instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Family
				agent.post('/families')
					.send(family)
					.expect(200)
					.end(function(familySaveErr, familySaveRes) {
						// Handle Family save error
						if (familySaveErr) done(familySaveErr);

						// Get a list of Families
						agent.get('/families')
							.end(function(familiesGetErr, familiesGetRes) {
								// Handle Family save error
								if (familiesGetErr) done(familiesGetErr);

								// Get Families list
								var families = familiesGetRes.body;

								// Set assertions
								(families[0].user._id).should.equal(userId);
								(families[0].name).should.match('Family Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Family instance if not logged in', function(done) {
		agent.post('/families')
			.send(family)
			.expect(401)
			.end(function(familySaveErr, familySaveRes) {
				// Call the assertion callback
				done(familySaveErr);
			});
	});

	it('should not be able to save Family instance if no name is provided', function(done) {
		// Invalidate name field
		family.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Family
				agent.post('/families')
					.send(family)
					.expect(400)
					.end(function(familySaveErr, familySaveRes) {
						// Set message assertion
						(familySaveRes.body.message).should.match('Please fill Family name');
						
						// Handle Family save error
						done(familySaveErr);
					});
			});
	});

	it('should be able to update Family instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Family
				agent.post('/families')
					.send(family)
					.expect(200)
					.end(function(familySaveErr, familySaveRes) {
						// Handle Family save error
						if (familySaveErr) done(familySaveErr);

						// Update Family name
						family.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Family
						agent.put('/families/' + familySaveRes.body._id)
							.send(family)
							.expect(200)
							.end(function(familyUpdateErr, familyUpdateRes) {
								// Handle Family update error
								if (familyUpdateErr) done(familyUpdateErr);

								// Set assertions
								(familyUpdateRes.body._id).should.equal(familySaveRes.body._id);
								(familyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Families if not signed in', function(done) {
		// Create new Family model instance
		var familyObj = new Family(family);

		// Save the Family
		familyObj.save(function() {
			// Request Families
			request(app).get('/families')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Family if not signed in', function(done) {
		// Create new Family model instance
		var familyObj = new Family(family);

		// Save the Family
		familyObj.save(function() {
			request(app).get('/families/' + familyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', family.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Family instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Family
				agent.post('/families')
					.send(family)
					.expect(200)
					.end(function(familySaveErr, familySaveRes) {
						// Handle Family save error
						if (familySaveErr) done(familySaveErr);

						// Delete existing Family
						agent.delete('/families/' + familySaveRes.body._id)
							.send(family)
							.expect(200)
							.end(function(familyDeleteErr, familyDeleteRes) {
								// Handle Family error error
								if (familyDeleteErr) done(familyDeleteErr);

								// Set assertions
								(familyDeleteRes.body._id).should.equal(familySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Family instance if not signed in', function(done) {
		// Set Family user 
		family.user = user;

		// Create new Family model instance
		var familyObj = new Family(family);

		// Save the Family
		familyObj.save(function() {
			// Try deleting Family
			request(app).delete('/families/' + familyObj._id)
			.expect(401)
			.end(function(familyDeleteErr, familyDeleteRes) {
				// Set message assertion
				(familyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Family error error
				done(familyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Family.remove().exec();
		done();
	});
});