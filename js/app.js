/*
 * File: app.js
 * Main entry point
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


var chat = angular.module('chat', ['ngRoute', 'ngSanitize', 'ngTouch', 'ngAnimate']);

chat.config(['$routeProvider', function($routeProvider) {
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
        resolve: {
            subview: function() { return ['chat.html']; }
        }
	})
    
	.when('/chat/:chatId', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        resolve: {
            subview: function() { return ['chat.html']; }
        }
	})
    .when('/addfriend', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        resolve: {
            subview: function() { return ['addfriend.html', 'Freund hinzuf\xfcgen']; }
        }
	})
	.when('/group/:groupId', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        resolve: {
            subview: function() { return ['group.html']; }
        }
	})
	.when('/:userId/profile', {
		templateUrl: 'html/main.html',
        controller: 'MainCtrl',
        resolve: {
            subview: function() { return ['profile.html']; }
        }
	})
    
	.when('/settings', {
		templateUrl:'html/settings.html',
        controller: 'SettingsCtrl'
	})
	.when('/media/:mediaId', {
		controller: 'MediaCtrl'
	})
    
	.otherwise({ redirectTo: '/'});
    
    moment.lang("de");
}]);
