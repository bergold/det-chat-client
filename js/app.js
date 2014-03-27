/*
 * File: app.js
 * Main entry point
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


var chat = angular.module('chat', ['ngRoute']);

/*chat.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'html/splash.html'
	})
	.when('/login', {
		templateUrl: 'html/login.html'
	})
	.when('/chats', {
		templateUrl: 'html/chats.html'
	})
	.when('/addfriend', {
		templateUrl: 'html/addfriend.html'
	})
	.when('/chat/:chatId', {
		templateUrl: 'html/chat.html'
	})
	.when('/group', {
		templateUrl: 'html/group.html'
	})
	.when('/profile', {
		templateUrl: 'html/profile.html'
	})
	.when('/media', {
		templateUrl: 'html/media.html'
	})
	.when('/settings', {
		templateUrl:'html/settings.html'
	})
	.otherwise({ redirectTo: '/'});
}]);*/

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
}]);
