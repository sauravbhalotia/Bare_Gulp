(function() {

    var express, app, port, router, requestLogger;

    //uses default port of 9090 if not provided from gulp.config.js
    port = process.env.PORT || 9090;

    express = require('express');
    requestLogger = require('morgan');
    app = express();
    router = express.Router();

    // HTTP request Logger
    // can be used as 'common' or 'combined' or 'dev'
    app.use(requestLogger('dev'));

    // next encounter to PATH
    // app.use(express.static('PATH'));
    app.listen(port, function(error) {
        if (error) {
            console.log('Errored : ' + error);
            return false;
        }
        console.log('Running Server on Port : ' + port);
    });

    //middleware - used by express before anything else

    // our '.tmp' folder as static.
    app.use(express.static('.tmp'));

    // app.use(express.static('source/client/'));
    app.use(express.static('./'));
    // app.use(express.static('./.tmp'));

    // simple service
    app.get('/', function(request, response) {
        response.send('Hello World!');
    });

}());