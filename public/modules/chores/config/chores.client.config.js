'use strict';

// Configuring the Articles module
angular.module('chores').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Chores', 'chores', 'dropdown', '/chores(/create)?');
		Menus.addSubMenuItem('topbar', 'chores', 'List Chores', 'chores');
		Menus.addSubMenuItem('topbar', 'chores', 'New Chore', 'chores/create');
	}
]);