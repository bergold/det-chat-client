/*
 * File: bgworker.js
 * Background script for chat-api, storage and bg-checker functionality
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


// util

var extend = function (obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
}

var notify = function(msg) {
    var id = 'newMsg_' + msg.sender + '_' + msg.edited;
    chrome.notifications.create("newMsg", {
        type: "basic",
        title: "Neue Nachricht",
        message: "Von: " + msg.sender + "\n" + msg.msg,
        iconUrl: "../icon/logo-notify-128x128.png"
    }, function() {});
}

var isForeground = function() {
    return bg.activeWin;
}


// api

var api = (function () {
    
    var domain = "http://cubinator.bplaced.net/dev-chat/";
    var http = function (path, data, callbacks) {
        
        data = data || {};
        
        callbacks.progress = callbacks.progress || function () {};
        callbacks.load = callbacks.load || function () {};
        callbacks.error = callbacks.error || function () {};
        callbacks.abort = callbacks.abort || function () {};
        
        callbacks.upload = callbacks.upload || {};
        callbacks.upload.progress = callbacks.upload.progress || function () {};
        callbacks.upload.load = callbacks.upload.load || function () {};
        callbacks.upload.error = callbacks.upload.error || function () {};
        callbacks.upload.abort = callbacks.upload.abort || function () {};
        
        var req = new XMLHttpRequest();
        
        var callback = function(upload, evt) {
            if (upload) {
                callbacks.upload[evt.type](req.response, req);
            } else {
                callbacks[evt.type](req.response, req);
            }
        };
        
        req.addEventListener("progress", callback.bind(req, false), false);
        req.addEventListener("load", callback.bind(req, false), false);
        req.addEventListener("error", callback.bind(req, false), false);
        req.addEventListener("abort", callback.bind(req, false), false);
        
        req.upload.addEventListener("progress", callback.bind(req, true), false);
        req.upload.addEventListener("load", callback.bind(req, true), false);
        req.upload.addEventListener("error", callback.bind(req, true), false);
        req.upload.addEventListener("abort", callback.bind(req, true), false);
        
        req.open("get", encodeURI(path), true);
        
        req.send(data);
        
        return req;
        
    };
    
    var apicore_ = function() {
        if (this instanceof apicore_) {
            this.buffer_ = [];
            this.config_ = [];
        } else
            return new apicore_();
    };
    
    (function() {
        
        this.add = function(cmd, callback) {
            this.buffer_.push({
                cmd: cmd,
                callback: callback
            });
            return this;
        };
        this.cmd = this.add;
        
        this.config = function(a) {
            extend(this.config_, a);
        };
        
        this.send = function() {
            var d = [], i;
            for (i = 0; i < this.buffer_.length; i++) {
                d.push(this.buffer_[i].cmd);
            }
            this.config({
                load: function(res) {
                    try {
                        res = JSON.parse(res);
                    } catch (ex) {
                    }
                    for (var i=0; i<res.length; i++) {
                        this.buffer_[i].callback(res[i]);
                    }
                    this.buffer_ = [];
                }.bind(this)
            });
            http(domain, JSON.stringify(d), this.config_);
            
            return this;
        };
        
    }).call(apicore_.prototype);
    
    apicore_.http = http;
    
    return apicore_;
    
})();

window['api'] = api;


// storage

var storage = {
    sAREA: 'local',
    get: function(keys, cb) {
        chrome.storage[this.sAREA].get(keys, cb);
    },
    set: function(items, cb) {
        cb = cb || function() {};
        chrome.storage[this.sAREA].set(items, cb);
    }
};

window['storage'] = storage;


// alarm

var Alarm = function() {};

(function() {
    
    this.create = function() {
        storage.get("settings", function(res) {
            var bg_delay = (res.settings && res.settings.bg_delay) ? res.settings.bg_delay : 1;
            if (bg_delay >= 1) chrome.alarms.create("chat_bg", {
                'periodInMinutes': bg_delay
            });
        });
    };
    
    this.onFire = function() {
        if (isForeground()) return;
        storage.get(["sid", "lastMsg"], function(val) {
            if (val.sid) {
                var lastMsg = val.lastMsg || 0;
                api().cmd({
                    sid: val.sid,
                    name: null,
                    type: "user",
                    min: lastMsg,
                    max: -1
                }, function(res) {
                    if (false === res) return false;
                    var newlastmsg = lastMsg;
                    for (var i = 0; i < res.length; i++) {
                        var msg = res[i];
                        if (msg.edited >= lastMsg) {
                            newlastmsg = Math.max(lastMsg, msg.edited);
                            notify(msg);
                        }
                    };
                    lastMsg = newlastmsg;
                    storage.set("lastMsg", newlastmsg);
                    return res;
                }).send();
            }
        });
    };
    
}).call(Alarm.prototype);

var alarm = new Alarm();
chrome.alarms.onAlarm.addListener(alarm.onFire.bind(alarm));

window['alarm'] = alarm;
