/*
 * File: app.js
 * Main entry point
 *
 * @author: Emil Bergold
 * @version: 2.0
 *
 */


var det = angular.module('det', ['ngRoute', 'ngSanitize', 'ngTouch', 'ngAnimate', 'chat']);

det.config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider', function($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'app/partials/splash.html',
        controller: 'SplashCtrl'
	})
	.when('/login', {
		templateUrl: 'app/partials/login.html',
        controller: 'LoginCtrl'
	})
	.when('/home', {
		templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl'
	})
    
	.when('/chat/:chatId*', {
		templateUrl: 'app/partials/chat.html',
        controller: 'ChatCtrl'
	})
    .when('/addfriend', {
		templateUrl: 'app/partials/addfriend.html',
        controller: 'AddFriendCtrl'
	})
    .when('/creategroup', {
		templateUrl: 'app/partials/creategroup.html',
        controller: 'CreateGroupCtrl'
	})
	.when('/group/:groupId', {
		templateUrl: 'app/partials/group.html',
        controller: 'GroupCtrl'
	})
	.when('/:userId/profile', {
		templateUrl: 'app/partials/profile.html',
        controller: 'ProfileCtrl'
	})
    .when('/media/:mediaId', {
        templateUrl: 'app/partials/media.html',
        controller: 'MediaCtrl'
    })
    
	.when('/settings', {
		templateUrl:'app/partials/settings.html',
        controller: 'SettingsCtrl'
	})
    
	.otherwise({ redirectTo: '/'});
    
    $locationProvider.hashPrefix('!');
    moment.lang("de");
    
    $httpProvider.defaults.headers.post = {};
    
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(chrome-extension):/);
}]);

det.run(['$location', 'notifier', 'chatBgWorker', function($location, notifier, chatBgWorker) {
    
    $location.path('/');
    
    notifier.on('logedin', function() {
        chatBgWorker.start();
    });
    notifier.on('logedout', function() {
        chatBgWorker.stop();
    });
    
    notifier.on('newmsg', function(con, msg) {
        // [todo] notify user
    });
    
    window.bgworker = chatBgWorker;
    
}]);
