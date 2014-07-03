Build Det-Chat for Web and Chromeapp
====================================

1. update version in `chat.appcache` and `manifest.json`
2. compile all `.css.less` files to `.css`

3. deploy for web:
    3.1 copy all files from `src/` to `build_web/v<version>/`
    3.2 optional: remove code where `platform!=WEB`
    3.3 optional: delete unnecessary files (`lib/less.min.js`, `manifest.json`, `manifest.mobile.json`, `css/style.css.less`)
    3.4 remove `script<less.js>` from `app.html`
    3.5 change `stylesheet/less` to `stylesheet` and `style.css.less` to `style.css` in `app.html`
    3.6 upload
    3.7 test
    3.8 change link in `www/index.php`

4. deploy for chrome
    4.1 copy all files from `src` to `build_chromeapp/v<version>/`
    4.2 optional: remove code where `platform!=CHROMEAPP`
    4.3 optional: delete unnecessary files (`lib/less-<less.version>.min.js`, `chat.appcache`, `manifest.mobile.json`, `css/style.css.less`)
    4.4 remove `script<less.js>` from `app.html`
    4.5 change `stylesheet/less` to `stylesheet` and `style.css.less` to `style.css` in `app.html`
    4.6 pack
    4.7 test
    4.8 publish (upload, change `chromeapp/update.xml`)
