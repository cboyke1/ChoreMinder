'use strict';

//Setting up route
angular.module('chores').config(['$stateProvider',
	function($stateProvider) {
		// Chores state routing
		$stateProvider.
		state('listChores', {
			url: '/chores',
			templateUrl: 'modules/chores/views/list-chores.client.view.html'
		}).
		state('createChore', {
			url: '/chores/create',
			templateUrl: 'modules/chores/views/create-chore.client.view.html'
		}).
		state('viewChore', {
			url: '/chores/:choreId',
			templateUrl: 'modules/chores/views/view-chore.client.view.html'
		}).
		state('addChoreIntro', {
			url: '/chore/addChoreIntro',
			templateUrl: 'modules/chores/views/addChoreIntro.html'
		}).
		state('editChore', {
			url: '/chores/:choreId/edit',
			templateUrl: 'modules/chores/views/edit-chore.client.view.html'
		});
	}
]);
