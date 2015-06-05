'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.getHomePageView = function() {
			var user = $scope.authentication.user;
			if(!user) {
				return('modules/core/views/homeAnonymousView.html');
			}
			if(user.admin) {
				return 'modules/core/views/homeAdminView.html';
			}
			if(user.parent) {
				return('modules/core/views/homeParentView.html');
			}
			if(user.child) {
			return 'modules/core/views/homeChildView.html';
			}
			if(!user.family) {
				return 'modules/families/views/create-family.client.view.html';
			}

		};

		


	}
]);
