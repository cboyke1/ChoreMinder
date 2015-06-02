'use strict';

// Families controller
angular.module('families').controller('FamiliesController', ['$scope', '$stateParams', '$resource', '$http', '$location', 'Authentication', 'Families', 'Users',
	function($scope, $stateParams, $resource, $http, $location, Authentication, Families, Users) {
		$scope.authentication = Authentication;

		// Create child user - add to current family
		$scope.addChild = function() {
			var child = new Users({
				firstName: this.credentials.firstName,
				displayName: this.credentials.firstName,
				email: this.credentials.email,
				username: this.credentials.email,
				password: this.credentials.password
			});
			console.log(child);
			$http.post('/familyAddChild',{child: child})
			.success(function() {
				console.log('success');
				$location.path('/');
			})
			.error(function() {
				console.log('error');
			});
		};

		// Create new Family
		$scope.create = function() {
			// Create new Family object
			var family = new Families ({
				name: this.name,
				parents: [$scope.authentication.user._id]
			});

			// Redirect after save
			family.$save(function(response) {
				// Reload user as values have changed.
				var user = $resource('/users/me');
				Authentication.user = user.get();

				$location.path('families/addChildren');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Family
		$scope.remove = function(family) {
			if ( family ) {
				family.$remove();

				for (var i in $scope.families) {
					if ($scope.families [i] === family) {
						$scope.families.splice(i, 1);
					}
				}
			} else {
				$scope.family.$remove(function() {
					$location.path('families');
				});
			}
		};

		// Update existing Family
		$scope.update = function() {
			var family = $scope.family;

			family.$update(function() {
				$location.path('families/' + family._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Families
		$scope.find = function() {
			$scope.families = Families.query();
		};

		// Find existing Family
		$scope.findOne = function() {
			console.log('family - findOne');
			var familyId = $stateParams.familyId;
			if(!familyId) {
				familyId = $scope.authentication.user.family;
			}
			console.log('family id: ' + familyId);
			$scope.family = Families.get({familyId: familyId });
		};
	}
]);
