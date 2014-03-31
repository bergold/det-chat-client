/*
 * File: directive.js
 * Directives
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

chat.directive('fromNow', ['$interval', function($interval) {
    return {
        restrict: 'A',
        scope: {
            fromNow: '='
        },
        template: '{{parsedfromnow}}',
        link: function(scope, element, attrs) {
            var d = new Date(scope.fromNow);
            scope.parsedfromnow = moment(d).fromNow();
            $interval(function() {
                scope.parsedfromnow = moment(d).fromNow();
            }, 5000);
        }
    };
}]);
