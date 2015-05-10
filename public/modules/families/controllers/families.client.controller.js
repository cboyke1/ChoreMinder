'use strict';

// Families controller
angular.module('families').controller('FamiliesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Families',
	function($scope, $stateParams, $location, Authentication, Families) {
		$scope.authentication = Authentication;

		// Create new Family
		$scope.create = function() {
			// Create new Family object
			var family = new Families ({
				name: this.name
			});

			// Redirect after save
			family.$save(function(response) {
				$location.path('families/' + response._id);

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
			$scope.family = Families.get({ 
				familyId: $stateParams.familyId
			});
		};
	}
]);