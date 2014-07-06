/*
 * File: values.js
 * Factories
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

// possible values: 'CHROMEAPP', 'WEB', 
det.constant('ACTIVE_PLATFORM', 'CHROMEAPP');

det.factory('platform', ['ACTIVE_PLATFORM', function(pltfrm) {
    return {
        isWeb: function () {
            return pltfrm === 'WEB';
        },
        isChromeapp: function () {
            return pltfrm === 'CHROMEAPP';
        }
    };
}]);


det.factory('APP_VERSION', ['platform', function(platform) {
    if (platform.isChromeapp()) return chrome.runtime.getManifest().version;
    else return '2.0.3';
}]);

det.constant('SETTINGS_DEFAULT', {
    autoLogin: true,
    alwaysOnTop: false,
    recieve_delay: 500,
    bg_delay: 1
});

// http://i.icomoon.io/public/temp/a4d3ca8bc3/smiley/style.css
det.constant('smiley_list', {
    'happy': ['(happy)'],
    'smiley': ['(smiley)'],
    'tongue': ['(tongue)'],
    'sad': ['(sad)'],
    'wink': ['(wink)'],
    'grin': ['(grin)'],
    'cool': ['(cool)'],
    'angry': ['(angry)'],
    'evil': ['(evil)'],
    'shocked': ['(shocked)'],
    'confused': ['(confused)'],
    'neutral': ['(neutral)'],
    'wondering': ['(wondering)']
});
