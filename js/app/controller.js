/*
 * File: controller.js
 * Controller
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


chat.controller('TestCtrl', ['$scope', 'api', 'auth', function($scope, api, auth) {
    
    $scope.validapi = false;
    
    api().then(function(a) {
        $scope.validapi = true;
        
        auth.login("emil", "bergold").then(function() {
            console.log("success", arguments);
        },
        function() {
            console.log("error", arguments);
        });
    });
    
}]);
