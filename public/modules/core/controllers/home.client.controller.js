'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', '$location','Authentication',
	function($scope, $http, $stateParams, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.init = function() {

			// Call server to get updated user
			$http.get('/users/me').success(function(data) {
				var id=data.family;
				if(id) {
					var url='/#!/families/' + id;
					console.log(url);
					//$location.url(url);
					window.location.href=url;
				}
			});
		};
	}
]);
