/*
 * File: values.js
 * Factories
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

// possible values: 'CHROMEAPP', 'WEB', 
det.constant('PLATFORM', 'CHROMEAPP');

det.value('APP_VERSION', chrome.runtime.getManifest().version);

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
