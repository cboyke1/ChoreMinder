'use strict';

//Families service used to communicate Families REST endpoints
angular.module('families').factory('Families', ['$resource',
	function($resource) {
		return $resource('families/:familyId', { familyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);