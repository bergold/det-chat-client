/*
 * File: background.js
 * Background script for window handling
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


var Background = function() {
    this.activeWin = false;
};
    
/*Background.prototype.startup = function() {
    
};*/

Background.prototype.newWindow = function() {
    var options = {
        id: 'appWindow',
        frame: 'chrome',
        minWidth: 300,
        minHeight: 500,
        width: 500,
        height: 500
    };

    chrome.app.window.create('app.html', options, function(win) {
        this.activeWin = true;
        win.onClosed.addListener(this.onWindowClosed.bind(this, win));
    }.bind(this));
};

Background.prototype.launch = function(d) {
    this.newWindow();
};

Background.prototype.onWindowClosed = function(win) {
    this.activeWin = false;
};


var bg = new Background();
//chrome.runtime.onStartup.addListener(bg.startup.bind(bg));
chrome.app.runtime.onLaunched.addListener(bg.launch.bind(bg));

window['background'] = bg;
