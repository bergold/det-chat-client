/*
 * File: service.js
 * Factories
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


// api-service
chat.factory('api', ['$q' , function($q) {
    return function() {
        var defered = $q.defer();
        chrome.runtime.getBackgroundPage(function(win) {
            defered.resolve(win['api']);
        });
        return defered.promise;
    };
}]);


// auth-service
chat.factory('auth', ['$q', 'api', function($q, api) {
    return {
        
        login: function(un, pw) {
            var defered = $q.defer();
            pw = _.sha256(pw);
            api().then(function(req) {
                req({
                    error: function(res, xhr) {
                        defered.reject(xhr);
                    }
                }).cmd({
                    cmd: 'login',
                    name: un,
                    pw: pw
                }, function(res) {
                    defered.resolve(res);
                }).send();
            });
            return defered.promise;
        },
        
        logout: function(sid) {
            
        }
        
    };
}]);
