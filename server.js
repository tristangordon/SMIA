var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var morgan       = require('morgan');
var port         = process.env.PORT || 8080;
var request      = require('request');
var Cookies      = require('cookies');
var cookieParser = require('cookie-parser');



app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());
 
// creates console log while server is active
app.use(morgan('dev'));

// Serve static 'todo' files
app.use(express.static(__dirname + '/'));
 
// frontpage request
app.get('/', function(req, res) {
  res.sendfile('social.html');
});

// bundle our routes
var apiRoutes = express.Router();

//storing the requested hashtag within a cookie
apiRoutes.post('/setHash', function(req, res){

    hashtag = (req.body.name) ? req.body.name : null;

    res.cookie('hashtag', hashtag);

    res.redirect('/');

});
 
// instagram object request
apiRoutes.get('/getInsta', function(req, res) {

//grab hashtag value saved in browser cookie, if this doesn't exist, use 'athlon'
var hashtag     = (req.cookies['hashtag']) ? (req.cookies['hashtag']).replace(/^.*#/, '') : 'athlon';

var accessToken = '3678064701.99fdca0.ef182a248bc343b38e27912405be7945',
    tag         = hashtag,
    endpoint    = 'https://api.instagram.com/v1/tags/'+ tag + '/media/recent?access_token=' + accessToken + '&access_token='+ accessToken;
    request(endpoint, function(err, response, body){
        res.send(body);
        console.log(body);
    });
});

apiRoutes.get('/getFacebook', function(req, res) {

var accessToken = 'EAASbZB8ZAYlu0BAHO2t9U0X7HKmkOGA5GMBE0E9iZCk2Mc2dQoRSeB3tnCkj6tjLiXAZCFdvYOJYkPQCRQBqXQuZA07ipCoZAkZAzawTr2VJ3xjaT2eEL9FL8zgdfa7ZCDUyPDkuufyoZAI94R0Lb0ZCWEBt7YvdFGwu9VjgXbCxFzqgZDZD',
    pageId      = '293589274343115',
    endpoint    = 'https://graph.facebook.com/v2.7/' + pageId + '/photos?fields=images,link,from,created_time&type=uploaded&access_token=' + accessToken; 

    request(endpoint, function(err, response, body) {
        res.send(body);
        console.log(body);
    });  
});
 
// will eventually connect the api routes under /sima-api
app.use('/', apiRoutes);
 
// Start the server
app.listen(port);
console.log('You got it, Tristan. This server is for the social media integration app. Found at port:' + port);
