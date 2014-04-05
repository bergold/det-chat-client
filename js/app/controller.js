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


chat.controller('SettingsCtrl', ['$scope', function($scope) {
    
}]);

chat.controller('MediaCtrl', ['$scope', function($scope) {
    
}]);


chat.controller('TestCtrl', ['$scope', 'api', 'auth', 'user', function($scope, api, auth, user) {
    
    $scope.tests = [];
    
    var test = function(name, res) {
        console.log("Test : ", name + "(" + $scope.tests.length + ")", res)
        return $scope.tests.push({
            name: name,
            result: res
        }) - 1;
    };
    var update = function(i, res) {
        console.log("Test*: ", i, res);
        if ($scope.tests[i]) $scope.tests[i].result = res;
    }
    
    var api_test = test('api', 'false');
    api().then(function(a) {
        update(api_test, true);
    });
    
    var login_test = test('login', 'pending');
    auth.login("emil", "bergie").then(function(sid) {
        update(login_test, "success " + sid);
        
        $scope.sid = sid;
        
        var user_test_sid = test('user-sid', 'pending');
        user(sid).then(function(res) {
            update(user_test_sid, res);
        }, function(res) {
            update(user_test_sid, false);
        });
        
        var user_test_ping = test('ping', 'pending');
        user.ping(sid).then(function(res) {
            update(user_test_ping, res);
        }, function(res) {
            update(user_test_ping, "error: " + res);
        });
            
    },
    function(reson) {
        update(login_test, "error " + reson);
    });
    
    var user_test = test('user', 'pending');
    user('emil').then(function(res) {
        update(user_test, res);
    }, function(res) {
        update(user_test, false);
    });
    
    $scope.testUser = function() {
        var user_test_2 = test('user', 'pending');
        user($scope.sid, true).then(function(res) {
            update(user_test_2, res);
        }, function(res) {
            update(user_test_2, false);
        });
    };
    
    $scope.testImg = function() {
        var img_test = test('img', 'pending');
        user.getImg('emil').then(function(res) {
            $scope.imgSrc = res;
            update(img_test, true);
        }, function(res) {
            update(img_test, false);
        });
    };
    
    $scope.logout = function() {
        var logout_test = test('logout', 'pending');
        auth.logout($scope.sid).then(function(res) {
            update(logout_test, true);
        }, function(res) {
            update(logout_test, false);
        });
    };
    
}]);
