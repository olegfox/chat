var express = require('express');
var config = require('config');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('lib/mongoose');
var expressSession = require('express-session');
var errorHandler = require('express-error-handler');
var MongoStore = require('connect-mongo/es5')(expressSession);

var routes = require('./routes/index');
var HttpError = require('error').HttpError;

var app = express();

app.engine('ejs', require('ejs-locals'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    "secret": config.get('session:secret'),
    "key": config.get('session:key'),
    "cookie": config.get('session:coookie'),
    "store": new MongoStore({mongooseConnection: mongoose.connection})
})); ;

app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
