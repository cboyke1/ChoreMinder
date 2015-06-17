'use strict';

//Families service used to communicate Families REST endpoints
angular.module('families').factory('Child', ['$resource',
	function($resource) {
		return $resource('child/:childId', { childId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
