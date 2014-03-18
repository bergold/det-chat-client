
var chat = angular.module('chat', ['ngRoute']);

chat.config(['$routeProvider', function($routeProvider) {
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
}]);
