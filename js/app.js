/*
 * File: app.js
 * Main entry point
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


var chat = angular.module('chat', ['ngRoute', 'ngSanitize', 'ngTouch', 'ngAnimate']);

chat.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'html/splash.html',
        controller: 'SplashCtrl'
	})
	.when('/login', {
		templateUrl: 'html/login.html',
        controller: 'LoginCtrl'
	})
	.when('/home', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        args: {
            title: 'Chats',
            default: true
        }
	})
    
	.when('/chat/:chatId*', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        args: {
            subview: 'chat.html',
            default: false
        }
	})
    .when('/addfriend', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        args: {
            subview: 'addfriend.html', 
            title: 'Freund hinzuf\xfcgen',
            default: false
        }
	})
    .when('/creategroup', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        args: {
            subview: 'creategroup.html', 
            title: 'Neue Gruppe',
            default: false
        }
	})
	.when('/group/:groupId', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        args: {
            subview: 'group.html',
            default: false
        }
	})
	.when('/:userId/profile', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        args: {
            subview: 'profile.html',
            default: false
        }
	})
    
	.when('/settings', {
		templateUrl:'html/settings.html',
        controller: 'SettingsCtrl'
	})
	.when('/media/:mediaId', {
        template: null,
		handler: ['$rootScope', '$routeParams', function($rootScope, $routeParams) {
            console.log($routeParams);
        }]
	})
    
	.otherwise({ redirectTo: '/'});
    
    $locationProvider.hashPrefix('!');
    moment.lang("de");
}]);

chat.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$locationChangeSuccess', function() {
        console.log($location.path());
    })
    $rootScope.goto = function(path) {
        $location.path(path);
    };
}]);
