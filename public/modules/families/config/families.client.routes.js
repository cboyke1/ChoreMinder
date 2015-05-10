'use strict';

//Setting up route
angular.module('families').config(['$stateProvider',
	function($stateProvider) {
		// Families state routing
		$stateProvider.
		state('listFamilies', {
			url: '/families',
			templateUrl: 'modules/families/views/list-families.client.view.html'
		}).
		state('createFamily', {
			url: '/families/create',
			templateUrl: 'modules/families/views/create-family.client.view.html'
		}).
		state('viewFamily', {
			url: '/families/:familyId',
			templateUrl: 'modules/families/views/view-family.client.view.html'
		}).
		state('editFamily', {
			url: '/families/:familyId/edit',
			templateUrl: 'modules/families/views/edit-family.client.view.html'
		});
	}
]);