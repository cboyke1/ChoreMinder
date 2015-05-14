'use strict';

// Configuring the Families module
angular.module('families').run(['Menus',
	function(Menus) {

		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Families', 'families', 'dropdown', '/families(/create)?',false,['admin']);
		Menus.addSubMenuItem('topbar', 'families', 'List Families', 'families');
		Menus.addSubMenuItem('topbar', 'families', 'New Family', 'families/create');
	}
]);
