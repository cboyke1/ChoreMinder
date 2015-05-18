'use strict';

// Activities controller
angular.module('activities').controller('ActivitiesController', ['$scope', '$resource', '$stateParams', '$location', 'Authentication', 'Activities',
	function($scope, $resource, $stateParams, $location, Authentication, Activities) {

		var verbose=true;
		$scope.authentication = Authentication;

		$scope.selectAllChanged = function(elt) {
			var children=$scope.initData.family.children;
			var isChecked=document.getElementById('selectAll').checked;
			for(var i=0 ; i < children.length ; i++ ) {
				document.getElementById(children[i]._id).checked=isChecked;
			}
			console.log(elt);
		};

		$scope.init = function() {
			if($location.search().type === 'request') {
				$scope.type='request';
			} else {
				$scope.type='complete';
			}
			console.log($scope.type);
			var FormData = $resource('/acInitForm');
			$scope.initData = FormData.get();
			$scope.points=0;
			$scope.chore='';

			if($scope.authentication.user.child) {
				$scope.users=[$scope.authentication.user._id];
			} else {
				$scope.users=[];
			}
			console.log($scope.users);

		};

		$scope.minus = function() {
			$scope.points = $scope.points - 1;
		};

		$scope.plus = function() {
			$scope.points = $scope.points + 1;
		};


		$scope.isChecked = function(elt) {
			console.log('is checked');
			console.log(elt);
		};

		$scope.pendingFilter = function(a) {
			if($scope.showPending) {
				return (a.status==='pending');
			}
			return true;
		};


		// FILTERS - should go in own file?

		// Is this activity assigned to me?
		$scope.myAssigned = function(a) {
			var userId = $scope.authentication.user._id;
			if(a.status==='assigned') {
				for(var i=0;i<a.users.length;i++) {
					if(a.users[i]._id === userId)
						return true;
				}
			}
			return false;
		};

		// Is this activity assigned to me?
		$scope.myAssigned = function(a) {
			return a.status==='assigned' && $scope.mine(a);
		};

		// Is this activity assigned to me?
		$scope.myPending = function(a) {
			return a.status==='pending' && $scope.mine(a);
		};

		// Is this activity assigned to me?
		$scope.myApproved = function(a) {
			return a.status==='approved' && $scope.mine(a);
		};

		$scope.mine = function(a) {
			var userId = $scope.authentication.user._id;
			for(var i=0;i<a.users.length;i++) {
				if(a.users[i]._id === userId)
					return true;
			}
			return false;
		};


		// Is this activity open, and I'm one of the assignees?
		$scope.myOpen = function(a) {
			return a.status==='open' && $scope.mine(a);
		};


		$scope.setPoints = function(elt) {
			$scope.chore=elt.c._id;
			$scope.points=elt.c.points;
			console.log($scope.chore);
		};


		// Create new Activity
		$scope.create = function() {

			if(this.users.length===0) {
				// Look at checkboxes to see which users to select
				var children=$scope.initData.family.children;
				for(var i=0 ; i < children.length ; i++ ) {
					var id = children[i]._id;
					if(document.getElementById(id).checked) {
						this.users.push(id);
					}
				}
				console.log('USERS:' + this.users);
			}

			if(this.users.length===0) {
				$scope.errorNoChild=true;
				return;
			} else {
				$scope.errorNoChild=false;
			}

			if(this.chore==='') {
				$scope.errorNoChore=true;
				return;
			} else {
				$scope.errorNoChore=false;
			}

			console.log('USERS');
			console.log(this.users);

			// Create new Activity object
			var activity = new Activities ({
				chore: this.chore,
				points: this.points,
				notes: this.notes
			});
			activity.users = this.users;

			// If it's a "REQUEST", then if only one user chosen, then activity status is Assigned, otherwise it's Open
			if($scope.type==='request') {
				if(activity.users.length === 1) {
					activity.status='assigned';
				} else {
					activity.status='open';
				}
			}

			// If it's a COMPLETED task, then depending on who's inputting the data, it's either Pending or Approved
			if($scope.type==='complete') {
				// Set users to chosen users, or current user if not parent
				if($scope.authentication.user.parent) {
					activity.status = 'approved';
				} else {
					activity.status='pending';
				}
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
			if(confirm('Are you sure you want to delete this activity?')) {
				if ( activity ) {
					console.log('1');
					activity.$remove();
					$location.path('/');
				} else {
					console.log('2');
					$scope.activity.$remove(function() {
						$location.path('/');
					});
				}
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
			console.log('find');
			$scope.activities = Activities.query();
		};

		// Mark this activity complete
		$scope.markComplete = function() {
			console.log('Complete');
			if($scope.myAssigned($scope.activity)) {
				$scope.activity.status='pending';
				$scope.activity.$update(function(response) {
					$location.path('/');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
		};

		// Find existing Activity
		$scope.findOne = function() {
			$scope.activity = Activities.get({
				activityId: $stateParams.activityId
			});
		};


	}
]);
