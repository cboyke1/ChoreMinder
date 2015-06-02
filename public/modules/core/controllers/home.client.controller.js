'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.init = function() {
			console.log('homeInit');
			if(!$scope.authentication.user) {
					$state.go('anonymousHome');
					return;
			}
			if($scope.authentication.user.admin) {
				$state.go('adminHome');
			}
			if($scope.authentication.user.parent) {
				$state.go('parentHome');
			}
			if($scope.authentication.user.child) {
				$state.go('childHome');
			}
		};


	}
]);
