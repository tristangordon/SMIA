var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var morgan       = require('morgan');
var passport	   = require('passport');
var port         = process.env.PORT || 8080;
var request      = require('request');
var Cookies      = require('cookies');
var cookieParser = require('cookie-parser');


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize());

// Serve static 'todo' files
app.use(express.static(__dirname + '/'));
 
// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.sendfile('social.html');
});

// bundle our routes
var apiRoutes = express.Router();

apiRoutes.post('/setHash', function(req, res){

    hashtag = (req.body.name) ? req.body.name : null;

    res.cookie('hashtag', hashtag);

    res.redirect('/');

});
 
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.get('/getSocial', function(req, res) {

var hashtag     = (req.cookies['hashtag']) ? (req.cookies['hashtag']).replace(/^.*#/, '') : 'athlon';

var accessToken = '3678064701.99fdca0.ef182a248bc343b38e27912405be7945',
    tag         = hashtag,
    endpoint    = 'https://api.instagram.com/v1/tags/'+ tag + '/media/recent?access_token=' + accessToken + '&access_token='+ accessToken;
    console.log(tag);
    request(endpoint, function(err, response, body){
        res.send(body);
    });
});
 
// connect the api routes under /api/*
app.use('/', apiRoutes);
 
// Start the server
app.listen(port);
console.log('You got it, Tristan. This server is for the social media integration app: http://localhost:' + port);
