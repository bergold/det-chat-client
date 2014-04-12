/*
 * File: controller.js
 * Controller
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


chat.controller('SplashCtrl', ['$scope', '$location', 'settings', 'auth', 'user', 
                       function($scope,   $location,   settings,   auth,   user) {
    $scope.loading = true;
    $scope.label = "Laden";
    
    settings.get("sid").then(function(res) {
        if (res.sid) {
            user(res.sid).then(function() {
                auth.sid = res.sid;
                $location.path("/home");
            }, function() {
                $location.path("/login/fail");
            });
        } else {
            $location.path("/login");
        }
    });
}]);

chat.controller('LoginCtrl', ['$scope', '$routeParams', '$location', 'settings', 'auth', 
                      function($scope,   $routeParams,   $location,   settings,   auth) {
    $scope.state = "pending";
    $scope.un = '';
    $scope.pw = '';
    
    if ($routeParams.err) {
        $scope.errMsg = "Anmeldung fehlgeschlagen!";
        $scope.state = "error";
    }
    
    $scope.login = function(un, pw) {
        $scope.state = "loading";
        auth.login(un, pw).then(function(sid) {
            auth.sid = sid;
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


chat.controller('ChatsCtrl', ['$scope', '$location', 'user', 'auth', function($scope, $location, user, auth) {
    $scope.groups = [];
    $scope.friends = [];
    user(auth.sid).then(function(res) {
        angular.forEach(res.friends, function(nick, name) {
            var i = $scope.friends.push({
                name: name, 
                nick: nick
            }) -1;
            user.getImg(name).then(function(img) {
                $scope.friends[i].image = img;
            });
        });
        angular.forEach(res.groups, function(title, name) {
            $scope.groups.push({
                name: name, 
                title: title
            });
        });
    });
}]);

chat.controller('ChatCtrl', ['$scope', function($scope) {
    
}]);

chat.controller('AddFriendCtrl', ['$scope', 'user', 'friends', function($scope, user, friends) {
    $scope.user = null;
    $scope.search = function() {
        var id = $scope.uid;
        user(id).then(function(u) {
            u.image = "";
            u.name = id;
            $scope.user = u;
            user.getImg(id).then(function(img) {
                $scope.user.image = img;
            });
        }, function(ex) {
            $scope.user = false;
        });
    };
    $scope.add = function() {
        $scope.user.added = null;
        friends.add($scope.user.name).then(function() {
            $scope.user.added = true;
        }, function() {
            $scope.user.added = false;
        });
    };
}]);


chat.controller('SettingsCtrl', ['$scope', function($scope) {
    
}]);

chat.controller('MediaCtrl', ['$scope', function($scope) {
    
}]);
