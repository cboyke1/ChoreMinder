'use strict';

// Activities controller
angular.module('activities').controller('ActivitiesController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Activities',
	function($scope, $resource, $stateParams, $location, Authentication, Activities) {
		$scope.authentication = Authentication;

		$scope.init = function() {
			var FormData = $resource('/acInitForm');
			$scope.initData = FormData.get();
			$scope.points=0;
			$scope.child='';
			$scope.chore='';
		};


		$scope.setChild = function(elt) {
			$scope.child=elt.c._id;
			console.log($scope.chore);
		};


		$scope.setPoints = function(elt) {
			$scope.chore=elt.c._id;
			$scope.points=elt.c.points;
			console.log($scope.chore);
		};


		// Create new Activity
		$scope.create = function() {
			
			// Create new Activity object
			var activity = new Activities ({
				chore: this.chore,
				points: this.points,
				user: this.child,
				notes: this.notes
			});
			console.log('CREATE');
			console.log(activity);


			// Redirect after save
			activity.$save(function(response) {
				$location.path('/');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Activity
		$scope.remove = function(activity) {
			if ( activity ) {
				activity.$remove();
				$location.path('/');
			} else {
				$scope.activity.$remove(function() {
					$location.path('/');
				});
			}
		};

		// Update existing Activity
		$scope.update = function() {
			var activity = $scope.activity;

			activity.$update(function() {
				$location.path('activities/' + activity._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Activities
		$scope.find = function() {
			$scope.activities = Activities.query();
		};

		// Find existing Activity
		$scope.findOne = function() {
			$scope.activity = Activities.get({
				activityId: $stateParams.activityId
			});
		};
	}
]);
