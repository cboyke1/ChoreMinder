'use strict';

//Chores service used to communicate Chores REST endpoints
angular.module('chores').factory('Chores', ['$resource',
	function($resource) {
		return $resource('chores/:choreId', { choreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);