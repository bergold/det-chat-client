/*
 * File: controller.js
 * Controller
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


chat.controller('SplashCtrl', ['$scope', function($scope) {
    
}]);

chat.controller('LoginCtrl', ['$scope', function($scope) {
    
}]);

chat.controller('MainCtrl', ['$scope', '$route', '$routeParams', '$location', function($scope, $route, $routeParams, $location) {
    
    $scope.loc = $location;
    $scope.route = $route;
    $scope.params = $routeParams;
    $scope.subview = "html/partials/" + $route.current.locals.subview;
    
}]);


chat.controller('ChatsCtrl', ['$scope', function($scope) {
    
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
    });
    
    $scope.testUser = function() {
        var user_test_2 = test('user', 'pending');
        user('emil', true).then(function(res) {
            update(user_test_2, res);
        });
    };
    
    $scope.testImg = function() {
        var img_test = test('img', 'pending');
        user.getImg('emil').then(function(res) {
            $scope.imgSrc = res;
            update(img_test, true);
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
