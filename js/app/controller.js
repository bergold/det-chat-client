/*
 * File: controller.js
 * Controller
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


chat.controller('SplashCtrl', ['$scope', '$rootScope', '$location', 'settings', function($scope, $rootScope, $location, settings) {
    $scope.loading = true;
    $scope.label = "Laden";
    
    settings.get("sid").then(function(res) {
        if (res.sid) {
            $rootScope.sid = res.sid;
            $location.path("/home");
        } else {
            $location.path("/login");
        }
    });
}]);

chat.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'settings', 'auth', function($scope, $rootScope, $location, settings, auth) {
    $scope.state = "pending";
    $scope.un = '';
    $scope.pw = '';
    
    $scope.login = function(un, pw) {
        $scope.state = "loading";
        auth.login(un, pw).then(function(sid) {
            $rootScope.sid = sid;
            settings.set({sid:sid});
            $location.path("/home");
        }, function(ex) {
            $scope.un = '';
            $scope.pw = '';
            $scope.errMsg = "Anmeldung fehlgeschlagen!";
            $scope.state = "error";
        });
    };
    
}]);

chat.controller('MainCtrl', ['$scope', '$rootScope', '$route', '$routeParams', '$location', function($scope, $rootScope, $route, $routeParams, $location) {
    
    $rootScope.$on('$routeChangeSuccess', function(evt) {
        if (angular.isDefined($routeParams.subview)) {
            $scope.subview = "html/partials/" + $routeParams.subview;
        }
        if (angular.isDefined($routeParams.default)) {
            $scope.actionbar.back = $scope.mainview = !$routeParams.default;
        }
        if (angular.isDefined($routeParams.title)) {
            $scope.actionbar.title = $routeParams.title;
        }
    });
    
    $scope.subview = "html/partials/chat.html";
    $scope.actionbar = {
        back: false,
        title: 'Chats',
        actions: []
    };
    
}]);


chat.controller('ChatsCtrl', ['$scope', '$rootScope', 'user', function($scope, $rootScope, user) {
    $scope.groups = [];
    $scope.friends = [];
    user($rootScope.sid).then(function(res) {
        $scope.friends = res.friends;
        $scope.groups = res.groups;
    });
}]);

chat.controller('AddFriendCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    
}]);


chat.controller('SettingsCtrl', ['$scope', function($scope) {
    
}]);

chat.controller('MediaCtrl', ['$scope', function($scope) {
    
}]);
