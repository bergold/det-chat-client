/**
 * File: controller.js
 * Controller
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


det.controller('SplashCtrl', ['$scope', '$location', 'storage', 'settings', 'chatAuth', 'chatUser', 
                      function($scope,   $location,   storage,   settings,   chatAuth,   chatUser) {
    
    settings.load().then(function(s) {
        if (settings('autoLogin')) {
            storage.get("sid").then(function(res) {
                if (res.sid) {
                    chatUser(res.sid).then(function(u) {
                        chatAuth.logedin(res.sid, u.name);
                        $location.path("/home");
                    }, function() {
                        $location.path("/login");
                    });
                } else {
                    $location.path("/login");
                }
            });
        } else $location.path("/login");
    });
    
}]);

det.controller('LoginCtrl', ['$scope', '$location', 'storage', 'chatAuth', 
                     function($scope,   $location,   storage,   chatAuth) {
    $scope.state = "waiting";
    $scope.un = '';
    $scope.pw = '';
    
    $scope.login = function(un, pw) {
        $scope.state = "loading";
        chatAuth.login(un, pw).then(function(sid) {
            storage.set("sid", sid);
            $location.path("/home");
        }, function(ex) {
            $scope.pw = '';
            $scope.state = "error";
        });
    };
    
}]);

det.controller('HomeCtrl', ['$scope', '$q', '$location', 'chatAuth', 'chatUser', 'storage',
                    function($scope,   $q,   $location,   chatAuth,   chatUser,   storage) {
    
    $scope.userimage;
    
    $scope.groups = [];
    $scope.friends = [];
    
    chatUser().then(function(me) {
        angular.forEach(me.friends, function(nick, name) {
            var i = $scope.friends.push({
                name: name, 
                nick: nick
            }) -1;
            chatUser.img(name).then(function(img) {
                $scope.friends[i].image = img;
            });
        });
    	angular.forEach(me.groups, function(title, name) {
            $scope.groups.push({
                name: name, 
                title: title
            });
        });
    });
    
    chatUser.img().then(function(img) {
        $scope.userimage = img;
    });
    
    $scope.logout = function() {
        var pr1 = chatAuth.logout();
        var pr2 = storage.remove("sid");
        $q.all([pr1, pr2]).then(function() {
            $location.path('/login');
        });
    };
    
}]);

det.controller('ChatCtrl', ['$scope', '$routeParams', 'chatAuth', 'chatUser', 'chatConversations', 'notifier', function($scope, $routeParams, chatAuth, chatUser, chatConversations, notifier) {
    
    $scope.newmsg = '';
    // [todo] distinguish between ':chatId' and 'g/:chatId'
    $scope.chatId = $routeParams.chatId;
    $scope.chatUser = {};
    $scope.meUser = {};
    
    chatUser($scope.chatId).then(function(u) {
        $scope.chatUser = angular.extend($scope.chatUser, u);
    });
    chatUser.img($scope.chatId).then(function(img) {
        $scope.chatUser.image = img;
    });
    chatUser.img().then(function(img) {
        $scope.meUser.image = img;
    });
    
    var con = chatConversations.get($scope.chatId);
    con.ready || con.load().then(function(msgs) {
        $scope.msgs = msgs;
    });
    
    $scope.msgs = con.msgs;
    notifier.on('newmsg', function() {
        // $scope.msgs = con.msgs;
    });
    
    $scope.isMe = function(msg) {
        return msg.sender == chatAuth.username;
    };
    
    $scope.send = function() {
        $scope.newmsg.trim() != '' && con.send($scope.newmsg);
        $scope.newmsg = '';
    };
    
}]);

det.controller('AddFriendCtrl', ['$scope', 'chatUser', 'chatFriends', function($scope, chatUser, chatFriends) {
    
    $scope.user = null;
    
    $scope.search = function() {
        var id = $scope.uid;
        chatUser(id).then(function(u) {
            u.name = id;
            $scope.user = u;
            chatUser.img(id).then(function(img) {
                $scope.user.image = img;
            });
        }, function(ex) {
            $scope.user = false;
        });
    };
    $scope.add = function() {
        $scope.user.added = null;
        chatFriends.add($scope.user.name).then(function() {
            $scope.user.added = true;
        }, function() {
            $scope.user.added = false;
        });
    };
    
}]);

det.controller('CreateGroupCtrl', ['$scope', function($scope) {
    // milestone v2.1
}]);

det.controller('ProfileCtrl', ['$scope', function($scope) {
    // milestone v2.1
}]);

det.controller('GroupCtrl', ['$scope', function($scope) {
    // milestone v2.1
}]);


det.controller('SettingsCtrl', ['$scope', 'settings', 'storage', 'platform', 'chatAPI', 'APP_VERSION',
                        function($scope,   settings,   storage,   platform,   chatAPI,   APP_VERSION) {
    $scope.platform = platform;
    
    $scope.settings = settings;
    $scope.appVersion = APP_VERSION;
    $scope.apiVersion = '...';
    
    chatAPI.add({
        cmd: "version",
    }).then(function(version) {
        $scope.apiVersion = version[0];
    });
    chatAPI.flush();
    
    $scope.resetApp = function() {
        storage.clear();
        if (platform.isWeb()) location.reload();
        if (platform.isChromeapp()) chrome.runtime.reload();
    };
    
}]);

det.controller('MediaCtrl', ['$scope', function($scope) {
    // milestone v2.1
}]);
