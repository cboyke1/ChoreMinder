'use strict';

// Chores controller
angular.module('chores').controller('ChoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Chores',
	function($scope, $stateParams, $location, Authentication, Chores) {
		$scope.authentication = Authentication;

		// Create new Chore
		$scope.create = function() {
			// Create new Chore object
			var chore = new Chores ({
				name: this.name
			});

			// Redirect after save
			chore.$save(function(response) {
				$location.path('chores/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Chore
		$scope.remove = function(chore) {
			if(confirm('Are you sure you want to delete this chore?')) {
				if ( chore ) {
					chore.$remove();

					for (var i in $scope.chores) {
						if ($scope.chores [i] === chore) {
							$scope.chores.splice(i, 1);
						}
					}
				} else {
					$scope.chore.$remove(function() {
						$location.path('chores');
					});
				}
			}
		};

		// Update existing Chore
		$scope.update = function() {
			var chore = $scope.chore;

			chore.$update(function() {
				$location.path('chores');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Chores
		$scope.find = function() {
			$scope.chores = Chores.query();
		};

		// Find existing Chore
		$scope.findOne = function() {
			$scope.chore = Chores.get({
				choreId: $stateParams.choreId
			});
		};
	}
]);
