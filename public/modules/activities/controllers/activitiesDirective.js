'use strict';

// Activities controller
angular.module('activities').directive('myDirective', function() {
    return {
        link: function(scope, elem, attrs) {
          console.log('my directive');
          scope.initChildCheckboxes();
        }
    };
});
