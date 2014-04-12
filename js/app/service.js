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
        
        sid: null,
        
        login: function(un, pw) {
            var defered = $q.defer();
            pw = _.sha256(pw);
            console.log("login", un, pw);
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
chat.factory('user', ['$q', 'api', 'online_tolerance', function($q, api, online_tolerance) {
    var buffer_ = {};
    var imgbuffer_ = {};
    var coreuser_ = function(name, force) {
        force = force || false;
        var defered = $q.defer();
        if (!force && buffer_[name])
            defered.resolve(buffer_[name]);
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
                    buffer_[name] = res;
                    defered.resolve(res);
                }
            }).send();
        });
        return defered.promise;
    };
    coreuser_.getImg = function(name) {
        var defered = $q.defer();
        if (imgbuffer_[name])
            defered.resolve(imgbuffer_[name]);
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
                    imgbuffer_[name] = res.image;
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
}]);


// settings-service
chat.factory('settings', ['$q', 'default_settings', function($q, default_settings) {
    return {
        get: function(keys) {
            var defered = $q.defer();
            chrome.storage.sync.get(keys, function(val) {
                defered.resolve(val);
            });
            return defered.promise;
        },
        
        set: function(pairs) {
            var defered = $q.defer();
            chrome.storage.sync.set(pairs, function() {
                defered.resolve(true);
            });
            return defered.promise;
        },
        
        clear: function() {
            chrome.storage.sync.clear();
        },
        
        setDefault: function() {
            return this.set(default_settings);
        }
    };
}]);

