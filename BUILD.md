Build Det-Chat for Web and Chromeapp
====================================

1. update version in `app/values.js`, `chat.appcache` and `manifest.json`
2. compile all `.css.less` files to `.css`

3. deploy for web:
    1. copy all files from `src/` to `build_web/v<version>/`
    2. important: set `platform` to `WEB` in `app/values.js`
    3. optional: remove code where `platform!=WEB`
    4. optional: delete unnecessary files (`lib/less.min.js`, `manifest.json`, `manifest.mobile.json`, `css/style.css.less`)
    5. remove `script<less.js>` from `app.html`
    6. change `stylesheet/less` to `stylesheet` and `style.css.less` to `style.css` in `app.html`
    7. upload
    8. test
    9. add `manifest="chat.appcache"`-attr to `<html>` in `app.html`
    10. change link in `www/index.php`

4. deploy for chrome
    1. copy all files from `src/` to `build_chromeapp/v<version>/`
    2. important: set `platform` to `CHROMEAPP` in `app/values.js`
    3. optional: remove code where `platform!=CHROMEAPP`
    4. optional: delete unnecessary files (`lib/less.min.js`, `chat.appcache`, `manifest.mobile.json`, `css/style.css.less`)
    5. remove `script<less.js>` from `app.html`
    6. change `stylesheet/less` to `stylesheet` and `style.css.less` to `style.css` in `app.html`
    7. pack
    8. test
    9. publish (upload, change `chromeapp/update.xml`)
