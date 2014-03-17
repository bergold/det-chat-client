var api = (function () {
    
    var domain = "http://cubinator.bplaced.net/dev-chat/?";
    var http = function (path, data, callbacks) {
        
        data = data || {};
        
        callbacks.progress = callbacks.progress || function () {};
        callbacks.complete = callbacks.complete || function () {};
        callbacks.failed = callbacks.failed || function () {};
        callbacks.canceled = callbacks.canceled || function () {};
        
        callbacks.upload = callbacks.upload || {};
        callbacks.upload.progress = callbacks.upload.progress || function () {};
        callbacks.upload.complete = callbacks.upload.complete || function () {};
        callbacks.upload.failed = callbacks.upload.failed || function () {};
        callbacks.upload.canceled = callbacks.upload.canceled || function () {};
        
        var req = new XMLHttpRequest();
        
        req.addEventListener("progress", callbacks.progress, false);
        req.addEventListener("load", callbacks.complete, false);
        req.addEventListener("error", callbacks.failed, false);
        req.addEventListener("abort", callbacks.canceled, false);
        
        req.upload.addEventListener("progress", callbacks.upload.progress, false);
        req.upload.addEventListener("load", callbacks.upload.complete, false);
        req.upload.addEventListener("error", callbacks.upload.failed, false);
        req.upload.addEventListener("abort", callbacks.upload.canceled, false);
        
        req.open("post", path, true);
        
        req.send(data);
        
        return req;
        
    };
    
    var apicore_ = function() {
        if (this instanceof apicore_) {
            this.buffer_ = [];
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
        this.cmd = add;
        
        this.send = function() {
            var d = [], i;
            for (i = 0; i < this.buffer_.length; i++) {
                d.push(this.buffer_[i].cmd);
            }
            http(domain, JSON.stringify(d), {
                complete: function() {
                    
                }
            });
        };
        
    }).call(apicore_.prototype);
    
    apicore_.http = http;
    
    return apicore_;
    
})();

window['api'] = api;
