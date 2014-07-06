/*
 * File: directive.js
 * Directives
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

det.directive('fromNow', ['$interval', function($interval) {
    return {
        restrict: 'A',
        scope: {
            fromNow: '='
        },
        template: '{{parsedfromnow}}',
        link: function(scope, element, attrs) {
            var d = new Date(scope.fromNow);
            scope.parsedfromnow = moment.unix(d).fromNow();
            $interval(function() {
                scope.parsedfromnow = moment.unix(d).fromNow();
            }, 5000);
        }
    };
}]);

det.directive('dropdown', ['$window', '$animate', function($window, $animate) {
    return {
        link: function(scope, element, attrs) {
            var content = element.find(".dropdown-menu").addClass("hide");
            element.find(".dropdown-trigger").on('click', function(evt) {
                $animate.removeClass(content, "hide");
                evt.preventDefault();
                evt.stopPropagation();
            });
            angular.element($window).on('click', function(evt) {
                $animate.addClass(angular.element(".dropdown-menu"), "hide");
            });
        }
    }
}]);

det.directive('enter', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('keypress', function(evt) {
                if (evt.which == 13 && !evt.shiftKey) {
                    evt.preventDefault();
                    scope.$apply(attrs.enter);
                }
            });
        }
    }
}]);

det.directive('scrollDown', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (scope.$last) $timeout(function() {
                var cont = angular.element(".scroll-container");
                cont.scrollTop(cont[0].scrollHeight - cont[0].clientHeight);
            }, 1);
        }
    }
}]);
