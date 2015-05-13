'use strict';

(function() {
	// Chores Controller Spec
	describe('Chores Controller Tests', function() {
		// Initialize global variables
		var ChoresController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Chores controller.
			ChoresController = $controller('ChoresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Chore object fetched from XHR', inject(function(Chores) {
			// Create sample Chore using the Chores service
			var sampleChore = new Chores({
				name: 'New Chore'
			});

			// Create a sample Chores array that includes the new Chore
			var sampleChores = [sampleChore];

			// Set GET response
			$httpBackend.expectGET('chores').respond(sampleChores);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.chores).toEqualData(sampleChores);
		}));

		it('$scope.findOne() should create an array with one Chore object fetched from XHR using a choreId URL parameter', inject(function(Chores) {
			// Define a sample Chore object
			var sampleChore = new Chores({
				name: 'New Chore'
			});

			// Set the URL parameter
			$stateParams.choreId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/chores\/([0-9a-fA-F]{24})$/).respond(sampleChore);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.chore).toEqualData(sampleChore);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Chores) {
			// Create a sample Chore object
			var sampleChorePostData = new Chores({
				name: 'New Chore'
			});

			// Create a sample Chore response
			var sampleChoreResponse = new Chores({
				_id: '525cf20451979dea2c000001',
				name: 'New Chore'
			});

			// Fixture mock form input values
			scope.name = 'New Chore';

			// Set POST response
			$httpBackend.expectPOST('chores', sampleChorePostData).respond(sampleChoreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Chore was created
			expect($location.path()).toBe('/chores/' + sampleChoreResponse._id);
		}));

		it('$scope.update() should update a valid Chore', inject(function(Chores) {
			// Define a sample Chore put data
			var sampleChorePutData = new Chores({
				_id: '525cf20451979dea2c000001',
				name: 'New Chore'
			});

			// Mock Chore in scope
			scope.chore = sampleChorePutData;

			// Set PUT response
			$httpBackend.expectPUT(/chores\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/chores/' + sampleChorePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid choreId and remove the Chore from the scope', inject(function(Chores) {
			// Create new Chore object
			var sampleChore = new Chores({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Chores array and include the Chore
			scope.chores = [sampleChore];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/chores\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChore);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.chores.length).toBe(0);
		}));
	});
}());