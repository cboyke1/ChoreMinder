'use strict';

// Families controller
angular.module('families').controller('ChildController', ['$scope', '$resource', '$http', '$location', 'Authentication', 'Child', 'Users',
	function($scope, $resource, $http, $location, Authentication, Child, Users) {
		$scope.authentication = Authentication;

		// Get Child details
		$scope.findOne = function() {
			console.log('child - findOne');
			var childId = $location.search().id;
			$scope.childId = childId;
			console.log('child id: ' + childId);
			$scope.data = Child.get({childId: childId });
		};
	}
]);
