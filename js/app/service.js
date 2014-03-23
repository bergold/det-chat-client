/*
 * File: service.js
 * Factories
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


// definitions
chat.constant('online_tolerance', 10);


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
                    if (false===res)
                        defered.reject(false);
                    else
                        defered.resolve(res);
                }).send();
            });
            return defered.promise;
        },
        
        logout: function(sid) {
            var defered = $q.defer();
            api().then(function(req) {
                req({
                    error: function(res, xhr) {
                        defered.reject(xhr);
                    }
                }).cmd({
                    cmd: 'logout',
                    sid: sid
                }, function(res) {
                    if (false===res)
                        defered.reject(false);
                    else
                        defered.resolve(res);
                }).send();
            });
            return defered.promise;
        }
        
    };
}]);


// user-service
chat.provider('user', function() {
    
    this.buffer_ = {};
    this.imgbuffer_ = {};
    
    this.$get = ['$q', 'api', 'online_tolerance', function($q, api, online_tolerance) {
        var self = this;
        var coreuser_ = function(name, force) {
            force = force || false;
            var defered = $q.defer();
            if (!force && self.buffer_[name])
                defered.resolve(self.buffer_[name]);
            else api().then(function(req) {
                req({
                    error: function(res, xhr) {
                        defered.reject(xhr);
                    }
                }).cmd({
                    cmd: 'getdata',
                    id: name,
                    getimage: false
                }, function(res) {
                    if (false===res)
                        defered.reject(false);
                    else {
                        self.buffer_[name] = res;
                        defered.resolve(res);
                    }
                }).send();
            });
            return defered.promise;
        };
        coreuser_.getImg = function(name) {
            var defered = $q.defer();
            if (self.imgbuffer_[name])
                defered.resolve(self.imgbuffer_[name]);
            else api().then(function(req) {
                req({
                    error: function(res, xhr) {
                        defered.reject(xhr);
                    }
                }).cmd({
                    cmd: 'getdata',
                    id: name,
                    getimage: true
                }, function(res) {
                    if (false===res)
                        defered.reject(false);
                    else {
                        self.imgbuffer_[name] = res.image;
                        defered.resolve(res.image);
                    }
                }).send();
            });
            return defered.promise;
        };
        coreuser_.ping = function(sid) {
            var defered = $q.defer();
            api().then(function(req) {
                req({
                    error: function(res, xhr) {
                        defered.reject(xhr);
                    }
                }).cmd({
                    cmd: 'ping',
                    sid: sid,
                    tolerance: online_tolerance
                }, function(res) {
                    defered.resolve(res[0]);
                    if (false===res[1])
                        defered.reject(false);
                }).send();
            });
            return defered.promise;
        };
        return coreuser_;
    }];
    
});
