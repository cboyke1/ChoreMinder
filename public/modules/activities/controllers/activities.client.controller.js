'use strict';

// Activities controller
angular.module('activities').controller('ActivitiesController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Activities',
	function($scope, $resource, $stateParams, $location, Authentication, Activities) {

		var verbose=true;
		$scope.authentication = Authentication;

		$scope.init = function() {
			var FormData = $resource('/acInitForm');
			$scope.initData = FormData.get();
			$scope.points=0;
			$scope.chore='';
			$scope.users=[];
		};


		$scope.isChecked = function(elt) {
			console.log('is checked');
			console.log(elt);
		};

		// This is terrible!
		$scope.userSelect = function(elt) {
			var id = elt.userCB;
			if(id.indexOf('-')===0) {
				id=id.substring(1);
				var i= $scope.users.indexOf(id);
				if( i != -1) {
					$scope.users.splice(i,1);
				}
			} else {
				// add to array
				$scope.users.push(id);
			}
			console.log($scope.users);
		};

		$scope.pendingFilter = function(a) {
			if($scope.showPending) {
				return (a.status==='pending');
			}
			return true;
		};


		$scope.setPoints = function(elt) {
			$scope.chore=elt.c._id;
			$scope.points=elt.c.points;
			console.log($scope.chore);
		};


		// Create new Activity
		$scope.create = function() {
			if(this.users.length===0) {
				$scope.errorNoChild=1;
				return;
			}

			if(this.chore=='') {
				$scope.errorNoChore=1;
				return;
			}

			console.log('USERS');
			console.log(this.users);

			// Create new Activity object
			var activity = new Activities ({
				chore: this.chore,
				points: this.points,
				notes: this.notes
			});
			// Set users to chosen users, or current user if not parent
			if($scope.authentication.user.parent) {
				activity.users = this.users;
				activity.status = 'approved';
			} else {
				activity.users = [$scope.authentication.user._id];
				activity.status='pending';
			}

			if(verbose) console.log(activity);

			// Redirect after save
			activity.$save(function(response) {
				$location.path('/');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Activity
		$scope.remove = function(activity) {
			console.log('REMOVE');
			if ( activity ) {
				activity.$remove();
				$location.path('activities');
			} else {
				$scope.activity.$remove(function() {
					$location.path('activities');
				});
			}
		};

		// Update existing Activity
		$scope.update = function() {
			console.log('UPDATE');
			var activity = $scope.activity;

			activity.$update(function() {
				$location.path('activities');
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
