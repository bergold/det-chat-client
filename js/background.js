var Background = function() {};
    
Background.prototype.startup = function() {
    
};

Background.prototype.newWindow = function() {
    var options = {
        id: 'appWindow',
        frame: 'chrome',
        minWidth: 300,
        minHeight: 500,
        width: 500,
        height: 800
    };


    chrome.app.window.create('app.html', options, function(win) {
        win.onClosed.addListener(this.onWindowClosed.bind(this, win));
    }.bind(this));
};

Background.prototype.launch = function(d) {
    this.newWindow();
};

Background.prototype.onWindowClosed = function(win) {
    
};


var bg = new Background();
chrome.runtime.onStartup.addListener(bg.startup.bind(bg));
chrome.app.runtime.onLaunched.addListener(bg.launch.bind(bg));

window['background'] = bg;
