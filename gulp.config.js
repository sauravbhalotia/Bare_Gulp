(function() {
    /*jshint node:true*/
    'use strict';

    // 'require gulp.config in gulpfile.js as
    // config = require('./gulp.config')();

    module.exports = function() {

        /*
         *  /source
         *  +--- /client
         *       +--- /styles
         *       +--- /scripts
         *            +--- app.js
         *            +--- /controllers
         *                 +--- *.js
         *            +--- /directives
         *                 +--- *.js
         *            +--- /services
         *                 +--- *.js
         *            +--- /models { static models }
         *                 +--- *.js
         *
         *       +--- /assets
         *            +--- /fonts
         *            +--- /images
         *            +--- favicon.ico
         *
         *  +--- /server
         *       +--- appServer.js
         *       +--- /dataModels {dynamic data models}
         *       +--- /webServices
         *
         *  +--- /.tmp/
         *
         */

        var config = {},
            hidden = '.',

            _port = 2015,

            root = {
                test: './test/',
                client: './source/client/',
                server: './source/server/'
            },

            build = 'build/',
            production = 'production/',

            // ideally should always be hidden and at the root level - '/.tmp'
            tmp = hidden + 'tmp/',

            test = {
                unit: root.test + 'unit/',
                end2end: root.test + 'e2e/',
            },

            //////////////////////////////////////////////////////////////////////////
            //                 ALL CLIENT SIDE STUFF CONFIGURATION                  //
            //////////////////////////////////////////////////////////////////////////
            client = {
                styles: root.client + 'styles/',
                scripts: root.client + 'scripts/',
                templates: 'templates/',
                assets: {
                    images: {
                        thumbnails: root.client + 'assets/images/thumbnails/',
                        img: root.client + 'assets/images/'
                    },
                    fonts: root.client + 'assets/fonts/'
                }
            },

            browserSync = {
                files: [
                    'source/client/**/*.*',
                    '!'+'source/client/**/*.scss',
                    './.tmp/**/*.css'
                ],
                port: _port,
                proxy: 'localhost:' + _port,
                ghostMode: {
                    clicks: true,
                    location: false,
                    forms: true,
                    scroll: true
                },
                // change the browser here or add an array for list of browsers
                // browser: ['safari', 'google chrome', 'firefox'],
                browser: 'safari',
                injectChanges: true, // injects only the file changed when true
                notify: true,
                reloadDelay: 1000,
            },

            options = {
                nodemon: {
                    script: './source/server/appServer.js',
                    delayTime: 1,
                    env : {
                        'PORT' : _port,
                        'NODE_ENV': 'dev'
                    },
                    watch: './source/client/**/*.js'
                },
                wireDep : {
                    bowerJson : require('./bower.json'), // makes sure that bower.json is available
                    directory: './bower_components', // where all the stuff is located
                    // ignorePath: '../..' // ignore the path which is binded on injection
                },
                inject : {
                    options : {
                        ignorePath: '.tmp/'
                    },
                    source : ['.tmp/**/*.css', '.tmp/**/*.js']
                },
                // Figure out which file to bindTo! either rawFiles.index or processedFiles
                wireTo : root.client +'index.html'
            },

            rawFiles = {
                js: client.scripts + '**/*.js',
                scss: client.styles + '**/*.scss',
                fonts: [
                    client.assets.fonts + '**/*.woff',
                    client.assets.fonts + '**/*.otf',
                    client.assets.fonts + '**/*.ttf'
                ],
                images: [
                    client.assets.images.img + '**/*.png',
                    client.assets.images.img + '**/*.jpeg',
                    client.assets.images.img + '**/*.gif'
                ],
                templates: client.scripts + client.templates + '**/*.html',
                index: root.client + 'index.html'
            }

        ; // End of VAR (one var does it all)

        //////////////////////////////////////////////////////////////////////////
        //               Attach to CONFIG object for gulpfile.js                //
        //////////////////////////////////////////////////////////////////////////

        config.browserSync = browserSync;
        config.dependencies = options;
        config.input = rawFiles;
        config.test = test;
        config.temp = tmp;

        return config;
    };

}());