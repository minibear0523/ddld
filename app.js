var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

// database and set q as default promise.
var mongoose = require("mongoose");
mongoose.Promise = require('q').Promise;
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);

// mongoose
mongoose.connect('mongodb://localhost/ddld');


var routes = require('./routes/index');
var users = require('./routes/users');
var news = require('./routes/news');
var products = require('./routes/products');
var dashboard = require('./routes/dashboard');
var uploads = require('./routes/uploads');
var newsletters = require('./routes/newsletters.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(compression());
app.use(bodyParser.json({limit: '5MB'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5MB' }));
app.use(cookieParser());

app.enable('trust proxy');

// Static Files: 静态资源应该前置于路由之前
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// Session处理
app.use(session({
  secret: 'ddld',
  cookie: {
    maxAge: 1000*60*60*24*7
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14*24*60*60
  }),
  resave: false,
  saveUninitialized: true
}));

// Routers
app.use('/', routes);
app.use('/users', users);
app.use('/news', news);
app.use('/products', products);
app.use('/dashboard', dashboard);
app.use('/uploads', uploads);
app.use('/newsletter', newsletters);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
