'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.init = function() {
			console.log('homeInit');
			var user = $scope.authentication.user;

			if(!user) {
					$state.go('anonymousHome');
					return;
			}
			if(user.admin) {
				$state.go('adminHome');
				return;
			}
			if(user.parent) {
				$state.go('parentHome');
				return;
			}
			if(user.child) {
				$state.go('childHome');
				return;
			}

			if(!user.family) {
				$state.go('signUpStep1');
				return;
			}

		};


	}
]);
