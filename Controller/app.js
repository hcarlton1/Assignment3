var express = require('express');
var createError = require('http-errors');
var app = express();
var path = require ('path');
var cookieParser = require('cookie-parser');

var catalogController = require('./catalogController.js');
var profileController = require('./profileController.js');

app.set('views', path.join(__dirname, '../Views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/assets', express.static('../assets'));

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: true}));

var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({secret: "nbad sessin secret"}));

// routes and controllers
app.use('/', catalogController);
app.use('/', profileController);



//error
app.use(function(req,res,next){
  next(createError(404));
});
app.use(function(err, req, res, next){
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//session handling


app.listen(9000);
console.log('2000 is the magic port');
