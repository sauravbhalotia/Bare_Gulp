/* globals require, exports */
(function() {
    /*jshint node:true*/
    'use strict';

    //required gulp modules are
    /*
     * gulp-load-plugins, gulp-task-listing, gulp-connect,
     * gulp-autoprefixer, gulp-browsersync,
     * del, gulp-sass, gulp-plumber
     * and so on ..
     */

    var args, browserSync, config, del, gulp, $, wiredep;

    args = require('yargs').argv;
    browserSync = require('browser-sync');
    config = require('./gulp.config')();
    del = require('del');
    gulp = require('gulp');
    wiredep = require('wiredep').stream;
    $ = require('gulp-load-plugins')({
        lazy: true // gets plugins only when needed
    });

    gulp.task('ValidateJS', ['CleanJS'], function() {
        $.util.log($.util.colors.white(JSON.stringify(config.input.js, null, '    ')));
        gulp
            .src(config.input.js) // change to config.alljsFiles
            .pipe($.plumber())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {
                verbose: true
            }))
            .pipe($.jshint.reporter('fail'))
            .pipe($.jscs()) //;
            .pipe(gulp.dest(config.temp));
    });

    gulp.task('CleanJS', function(done) {
        return cleanOldFiles(config.temp + '**/*.js');
    });

    gulp.task('ValidateCSS', ['CleanCSS'] , function() {
        $.util.log($.util.colors.white(JSON.stringify(config.input.scss, null, '    ')));
        gulp
            .src(config.input.scss)
            .pipe($.plumber())
            .pipe($.sass({
                style: 'expanded'
            }))
            .pipe($.autoprefixer({
                browsers: ['last 3 version', 'safari 5', 'ie 9', '> 5%']
            }))
            // not using the following build deps as I want CSS to be Neat & Clean
            // .pipe($.rename({suffix: '.min'}))
            // .pipe($.minifyCss())
            .pipe(gulp.dest(config.temp));
    });

    gulp.task('CleanCSS', function(done) {
        return cleanOldFiles(config.temp + '**/*.css');
    });

    gulp.task('refresh', ['ValidateJS', 'ValidateCSS']);

    //////////////////////////////////////////////////////////////////////
    //                        WIRING DEPENDENCIES                       //
    //    WIRE - it wires up all the bower Dependencies                 //
    //    INJECT - it wires up all the Custon App files for the app     //
    //////////////////////////////////////////////////////////////////////

    // gulp WireUp
    gulp.task('WireUp', function() {
        $.util.log($.util.colors.yellow('Wiring up Dependencies & Custom Files to App!'));
        return gulp
            .src(config.dependencies.wireTo)
            .pipe(wiredep(config.dependencies.wireDep))
            .pipe($.inject(gulp.src(config.dependencies.inject.source), config.dependencies.inject.options))
            .pipe(gulp.dest(config.temp));
    });

    //////////////////////////////////////////////////////////////////////
    //                             WATCHERS                             //
    //////////////////////////////////////////////////////////////////////

    // gulp watchSCSS
    gulp.task('watchSCSS', function() {
        $.util.log($.util.colors.yellow('Watching all CSS files!'));
        gulp.watch([config.input.scss], ['ValidateCSS']);
    });

    // gulp watchJS
    gulp.task('watchJS', function() {
        $.util.log($.util.colors.yellow('Watching all JavaScript files!'));
        gulp.watch([config.input.js], ['ValidateJS']);
    });

    //////////////////////////////////////////////////////////////////////
    //                         NODEMON App Serve                        //
    //////////////////////////////////////////////////////////////////////

    // gulp Serve --debug
    gulp.task('Serve', function() {
        return $.nodemon(config.dependencies.nodemon)
            .on('start', ['refresh', 'WireUp'], function() {
                $.util.log('Starting...');
                startBrowserSync();
            })
            .on('restart', ['refresh', 'WireUp'], function(event) {
                $.util.log('Restarting...');
                $.util.log('Files Changed :-' + event);
                setTimeout(function() {
                    $.util.log('Restarting Browser-Sync...');
                    browserSync.notify('Restarting Browser-Sync...');
                    browserSync.reload({
                        stream: false
                    });
                }, 1000); // Delay browserSync by 1s on restarting
            })
            .on('crash', function(event) {
                $.util.log('Oh No! Something went wrong!!');
            })
            .on('exit', function(event) {
                $.util.log('Exiting...');
            });
    });

    //////////////////////////////////////////////////////////////////////
    //                         help & default                           //
    //////////////////////////////////////////////////////////////////////

    // gulp help
    gulp.task('help', $.taskListing);

    // gulp --displayConfig
    gulp.task('default', ['help'], function() {
        // I like to see all the config that comes in from gulp.config.js file here.
        // for tab seperated config display use JSON.stringify(config, null, '\t'));
        if (args.displayConfig) {
            $.util.log('Configuration Detail:- ');
            $.util.log(JSON.stringify(config, null, '    '));
        }
    });

    //////////////////////////////////////////////////////////////////////
    //                      CLEAN FILES & FOLDERS                       //
    //////////////////////////////////////////////////////////////////////

    function cleanOldFiles(filePath, done) {
        $.util.log('Deleting Files in ' + $.util.colors.yellow(filePath));
        /*jshint esnext: true */
        return del([filePath]).then(paths => {
            $.util.log('Deleted files:\n', $.util.colors.red(paths.join('\n ')));
        });
    }

    //////////////////////////////////////////////////////////////////////
    //                                                                  //
    //////////////////////////////////////////////////////////////////////

    function changeEvent(event) {
        var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
        $.util.log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    }

    //////////////////////////////////////////////////////////////////////
    //                          BROWSERSYNC                             //
    //                        uses Socket.io                            //
    //////////////////////////////////////////////////////////////////////

    function startBrowserSync() {
        // gulp Serve --debug
        if(args.debug){
            config.browserSync.logFileChanges = true;
            config.browserSync.logLevel = 'debug';
            config.browserSync.logPrefix = 'browserSync';
        }
        if (browserSync.active) { return; }
        $.util.log('Starting browser-sync on port: ' + config.browserSync.port);
        gulp.watch([config.input.scss], ['ValidateCSS'])
            .on('change', function(event) {
                changeEvent(event);
        });
        browserSync(config.browserSync);
    }

}());