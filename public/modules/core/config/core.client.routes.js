'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		//$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('anonymousHome', {
			url: '/anonymousHome',
			templateUrl: 'modules/core/views/homeAnonymousView.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('parentHome', {
			url: '/parentHome',
			templateUrl: 'modules/core/views/homeParentView.html'
		}).
		state('childHome', {
			url: '/childHome',
			templateUrl: 'modules/core/views/homeChildView.html'
		}).
		state('adminHome', {
			url: '/adminHome',
			templateUrl: 'modules/core/views/homeAdminView.html'
		});
	}
]);
