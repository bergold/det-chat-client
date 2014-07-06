/*
 * File: chat.js
 * Chat module
 *
 * @author: Emil Bergold
 * @version: 2.0
 *
 * 
 * chatAPI           100%
 * chatAuth          100%
 * chatUser          100%
 * chatFriends       100%
 * chatGroups          0% (not implemented, milestone v2.1)
 * chatConversations 100%
 * chatBgWorker      100%
 * notifier          100%
 * settings          100%
 * storage           100%
 *
 */


var chat = angular.module('chat', ['ng']);

chat.constant('API_URL', 'http://cubinator.bplaced.com/dev-chat/');
chat.value('ONLINE_TOLERANCE', 10);

// api-factory
chat.factory('chatAPI', ['$q', '$http', 'API_URL' , function($q, $http, API_URL) {
    var cmds = [];
    var addCmd = function(cmd) {
        var deferred = $q.defer();
        cmd.$deferred = deferred;
        cmds.push(cmd);
        return deferred.promise;
    };
    var flush = function(sid) {
        var pending = angular.copy(cmds);
        cmds = [];
        $http.post(API_URL, pending, {
            headers: {
                auth: sid
            },
            transformRequest: function(data) {
                return angular.toJson(data);
            },
            transformResponse: function(data) {
                return angular.fromJson(data);
            }
        }).success(function(response) {
            angular.forEach(pending, function(c, i) {
                c.$deferred.resolve(response[i]);
            });
        }).error(function(error) {
            angular.forEach(pending, function(c) {
                c.$deferred.reject(error);
            });
        });
    };
    
    return {
        add: addCmd,
        flush: flush
    };
}]);


// auth-factory
chat.factory('chatAuth', ['$q', 'chatAPI', 'notifier', 'ONLINE_TOLERANCE', function($q, chatAPI, notifier, ONLINE_TOLERANCE) {
    return {
        
        sid: null,
        username: "",
        
        logedin: function(sid, username) {
            this.sid = sid;
            this.username = username;
            notifier.trigger('logedin', sid);
        },
        
        login: function(un, pw) {
            var thiz = this;
            pw = _.sha256(pw);
            var promise = chatAPI.add({
                cmd: 'login',
                name: un,
                pw: pw
            }).then(function(res) {
                if (false===res)
                    return $q.reject(false);
                else {
                    thiz.sid = res;
                    thiz.username = un;
                    notifier.trigger('logedin', res);
                    return res;
                }
            });
            chatAPI.flush();
            return promise;
        },
        
        logout: function(sid) {
            var thiz = this;
            sid = sid || this.sid;
            var promise = chatAPI.add({
                cmd: 'logout',
                sid: sid
            }).then(function(res) {
                if (false===res)
                    return $q.reject(false);
                else {
                    thiz.sid = null;
                    thiz.username = "";
                    notifier.trigger('logedout');
                    return res;
                }
            });
            chatAPI.flush(this.sid);
            return promise;
        },
        
        changepw: function(oldpw, newpw) {
            var promise = chatAPI.add({
                cmd: '',
                sid: this.sid,
                name: this.username,
                oldpw: oldpw,
                newpw: newpw
            }).then(function(response) {
            	if (false===response) return $q.reject(false);
                else return response;
            });
            chatAPI.flush(this.sid);
            return promise;
        },
        
        ping: function() {
            return chatAPI.add({
                cmd: 'ping',
                sid: this.sid,
                tolerance: ONLINE_TOLERANCE
            }).then(function(res) {
                if (false===res[1]) return $q.reject(false);
                else return res[0];
            });
        }
        
    };
}]);


// user-factory
chat.factory('chatUser', ['$q', 'chatAPI', 'chatAuth', 'storage', function($q, chatAPI, chatAuth, storage) {
    
    var buffer = {};
    
    var coreUser = function(id) {
        if (angular.isDefined(buffer[id || 'me'])) return $q.when(buffer[id || 'me']);
        else {
            var cmd = {
                cmd: 'getdata'
            };
            if (angular.isDefined(id)) cmd.id = id;
            var promise = chatAPI.add(cmd);
            chatAPI.flush(chatAuth.sid);
            return promise.then(function(response) {
                if (false===response) return $q.reject(false);
                else {
                    response.ping = function() {
                        var pingcmd = {
                            cmd: 'getdata'
                        };
                        if (angular.isDefined(id)) pingcmd.id = id;
                        var pingpromise = chatAPI.add(pingcmd);
                        chatAPI.flush(chatAuth.sid);
                        return pingpromise.then(function(res) {
                            return res.ping;
                        });
                    };
                    buffer[id || 'me'] = response;
                    return response;
                }
            });
        }
    };
    
    coreUser.img = function(id) {
        var cacheid = "chatIMG_" + (id || 'me')
         ,  cacheexpire = cacheid + '_expire';
        if (angular.isDefined(buffer[id]) && angular.isDefined(buffer[id || 'me'].image)) return $q.when(buffer[id || 'me'].image);
        else {
            return storage.get([cacheid, cacheexpire]).then(function(cache) {
                if (angular.isDefined(cache[cacheid])
                    && angular.isDefined(cache[cacheexpire])
                    && cache[cacheexpire] > moment().unix()) {
                    return cache[cacheid];
                } else {
                    var cmd = {
                        cmd: 'getdata',
                        getimage: true
                    };
                    if (angular.isDefined(id)) cmd.id = id;
                    var promise = chatAPI.add(cmd);
                    chatAPI.flush(chatAuth.sid);
                    return promise.then(function(response) {
                        if (false===response) return $q.reject(false);
                        else {
                            storage.set(cacheid, response.image);
                            storage.set(cacheexpire, moment().add('w', 1).unix());
                            if (angular.isDefined(buffer[id || 'me'])) buffer[id || 'me'].image = response.image;
                            return response.image;
                        }
                    });
                }
            });
        }
    };
    
    return coreUser;
}]);


// friends-factory
chat.factory('chatFriends', ['$q', 'chatAuth', 'chatAPI', function($q, chatAuth, chatAPI) {
    return {
        add: function(friend) {
            var promise = chatAPI.add({
                cmd: 'addfriend',
                friend: friend
            }).then(function(res) {
                if (false===res)
                    return $q.reject(false);
                else
                    return res;
            });
            chatAPI.flush(chatAuth.sid);
            return promise;
        },
        
        remove: function(friend) {
            var promise = chatAPI.add({
                cmd: 'removefriend',
                friend: friend
            }).then(function(res) {
                if (false===res)
                    return $q.reject(false);
                else
                    return res;
            });
            chatAPI.flush(chatAuth.sid);
            return promise;
        },
        
        list: function() {
            var promise = chatAPI.add({
                cmd: 'getfriends'
            }).then(function(res) {
                if (false===res)
                    return $q.reject(false);
                else
                    return res;
            });
            chatAPI.flush(chatAuth.sid);
            return promise;
        },
        
        isFriend: function(friend) {
            var promise = chatAPI.add({
                cmd: 'isfriend',
                friend: friend
            }).then(function(res) {
                if (false===res)
                    return $q.reject(false);
                else
                    return res;
            });
            chatAPI.flush(chatAuth.sid);
            return promise;
        }
    }
}]);


// conversations-factory
chat.factory('chatConversations', ['$q', 'chatAuth', 'chatAPI', 'storage', 'notifier', function($q, chatAuth, chatAPI, storage, notifier) {
    
    function classConversation (target, group) {
        this.ready = false;
    	this.msgs = [];
        this.target = target;
        this.type = group ? 'group' : 'user';
    };
    (function() {
        
        this.send = function(text) {
            text = _.encode(text);
            var msg = {
                sender: chatAuth.username,
                edited: moment().unix(),
                msg: text
            };
            this.msgs.push(msg);
            var promise = chatAPI.add({
                cmd: 'sendmsg',
                target: this.target,
                type: this.type,
                msg: text
            }).then(function(response) {
                if (false===response) return $q.reject(false);
                else return response;
            });
            chatAPI.flush(chatAuth.sid);
            return promise;
        };
        this.receive = function(msg) {
            if (this.findMsg(msg.uid)) return;
            this.msgs.push(msg);
            notifier.trigger('newmsg', this, msg);
        };
        this.findMsg = function(msgid) {
            var match = false;
            angular.forEach(this.msgs, function(msg) {
                if (msg.uid == msgid) match = true;
            });
            return match;
        };
        this.load = function() {
            var name = this.target
             ,  type = this.type
             ,  thiz = this
             ,  promise = chatAPI.add({
                cmd: 'filtermsgs',
                name: name,
                type: type,
                min: moment().subtract('months', 1).unix()
            }).then(function(res) {
                if (false === res) {
                    return $q.reject(false);
                } else {
                    thiz.msgs = res;
                    thiz.ready = true;
                    return res;
                }
            });
            chatAPI.flush(chatAuth.sid);
            return promise;
        };
        
    }).call(classConversation.prototype);
    
    var convs = {
        _buffer: {},
        lastMsg: moment().unix(),
        
        get: function(target, group) {
            var id = (group ? 'g' : 'u') + target
             ,  con;
            if (angular.isDefined(this._buffer[id])) con = this._buffer[id];
            else {
                con = new classConversation(target, group);
            	this._buffer[id] = con;
            }
            return con;
        }
    };
    
    function dirtyChecker() {
        var thiz  = this;
        var promise = chatAPI.add({
            cmd: 'filtermsgs',
            name: null,
            type: "user",
            min: thiz.lastMsg
        }).then(function(res) {
            if (false === res)
                return $q.reject(false);
            else {
                var newlastmsg = thiz.lastMsg;
                angular.forEach(res, function(msg) {
                    if (msg.edited >= thiz.lastMsg && msg.sender != chatAuth.username) {
                        newlastmsg = Math.max(thiz.lastMsg, msg.edited);
                        convs.get(msg.type == 'group' ? msg.target : msg.sender, msg.type == 'group').receive(msg);
                    }
                });
                thiz.lastMsg = newlastmsg;
                storage.set("lastMsg", newlastmsg);
                return res;
            }
        });
        chatAPI.flush(chatAuth.sid);
        return promise;
    }
    
    return {
        convs: convs,
        get: convs.get.bind(convs),
        dirtyChecker: dirtyChecker.bind(convs)
    };
}]);


// bgworker-service
chat.factory('chatBgWorker', ['$q', '$timeout', 'chatAuth', 'chatConversations', 'notifier', 'settings',
                      function($q,   $timeout,   chatAuth,   chatConversations,   notifier,   settings) {
    var running = false;
    var delay = settings('recieve_delay');
    
    var onlineUser = [];
    
    var checkOnlineUser = function(newonlineuser) {
        var nouarr = [];
        var online = [];
        var offline = [];
        angular.forEach(newonlineuser, function(nick, name) {
            if (onlineUser.indexOf(name) < 0) online.push(name);
            nouarr.push(name);
        });
        angular.forEach(onlineUser, function(name) {
            if (!newonlineuser[name]) offline.push(name);
        });
        onlineUser = nouarr;
        notifier.trigger('onlinestatuschange', onlineUser, online, offline);
    };
    
    function tick() {
        if (!running) return;
        var ping = chatAuth.ping().then(function(response) { checkOnlineUser(response); return response; });
        var msgs = chatConversations.dirtyChecker();
        $q.all([ping, msgs]).finally(function() {
            if (delay && delay > 0) {
                $timeout(tick, delay, false);
            } else tick();
        });
    }
    
    var start = function() {
        running = true;
        tick();
    };
    var stop  = function() {
        running = false;
    };
    
    return {
        start: start,
        stop:  stop,
        getOnlineUser: function() { return onlineUser; }
    };
}]);


// notifier-factory
chat.factory('notifier', [function() {
    
    return {
        
        _events: {
            logedin: [],
            logedout: [],
            onlinestatuschange: [],
            newmsg: []
        },
        
        on: function(evt, fn) {
            if (!angular.isArray(this._events[evt])) return false;
            this._events[evt].push(fn);
        },
        trigger: function(evt) {
            var args = arguments;
            if (!angular.isArray(this._events[evt])) return false;
            angular.forEach(this._events[evt], function(fn) {
                fn.apply(null, Array.prototype.slice.call(args, 1));
            });
            return true;
        }
        
    };
    
}]);


// settings-factory
chat.factory('settings', ['storage', 'SETTINGS_DEFAULT', function(storage, SETTINGS_DEFAULT) {
    
    var settings = SETTINGS_DEFAULT;
    var core = function(key, val) {
        if (angular.isDefined(val)) {
            settings[key] = val;
            // storage.set("settings", settings); // [if:platform==CHROMEAPP]
            storage.set("settings", angular.toJson(settings));
        } else {
            return settings[key];
        }
    }
    core.load = function() {
        return storage.get("settings").then(function(result) {
        	return settings = angular.extend(SETTINGS_DEFAULT, angular.fromJson(result.settings));
        });
    };
    
    return core;
    
}]);


// storage-factory
chat.factory('storage', ['$q', function($q) {

    return {
        get: function(keys) {
            if (_.platform.isWeb()) {
                var ret = {};
                if (angular.isString(keys)) keys = [keys];
                var isArr = angular.isArray(keys);
                angular.forEach(keys, function(v, k) {
                    var key = isArr ? v : k;
                    ret[key] = localStorage.getItem(key);
                });
                return $q.when(ret);
            }
            if (_.platform.isChromeapp()) {
                var defered = $q.defer();
                chrome.storage.local.get(keys, function(val) {
                    defered.resolve(val);
                });
                return defered.promise;
            }
        },
        
        set: function(keys, vals) {
            if (_.platform.isWeb()) {
                var obj = {};
                if (angular.isDefined(vals) && angular.isString(keys)) {
                    obj[keys] = vals;
                } else if (angular.isObject(keys)) {
                    obj = keys;
                } else throw "Invalid arguments";
                angular.forEach(obj, function(v, k) {
                    localStorage.setItem(k, v);
                });
                return $q.when(true);
            }
            if (_.platform.isChromeapp()) {
                var obj = {};
                if (angular.isDefined(vals) && angular.isString(keys)) {
                    obj[keys] = vals;
                } else if (angular.isObject(keys)) {
                    obj = keys;
                } else throw "Invalid arguments";
                var defered = $q.defer();
                chrome.storage.local.set(obj, function() {
                    defered.resolve(true);
                });
                return defered.promise;
            }
        },
        
        remove: function(keys) {
            if (_.platform.isWeb()) {
                if (angular.isString(keys)) keys = [keys];
                var isArr = angular.isArray(keys);
                angular.forEach(keys, function(v, k) {
                    var key = isArr ? v : k;
                    localStorage.removeItem(key);
                });
                return $q.when(true);
            }
            if (_.platform.isChromeapp()) {
                var deferred = $q.defer();
                chrome.storage.local.remove(keys, function() {
                    deferred.resolve(true);
                });
                return deferred.promise;
            }
        },
        
        clear: function() {
            if (_.platform.isWeb()) localStorage.clear();
            if (_.platform.isChromeapp()) chrome.storage.local.clear();
        }
    };
}]);

