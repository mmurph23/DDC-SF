var jsforce = require('jsforce');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var http = require('http');
var app = express();
var router = express.Router();

var oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : '<Your org>',
    clientId : '<Your clientId>',
    clientSecret : '242430930269556811',
    //redirectUri : 'http://localhost:' + port +'/token'
    redirectUri : 'http://fast-mountain-8443.herokuapp.com/token'
});
app.set('port', process.env.PORT || 5000);
app.locals.title = 'sfdc app';
app.locals.emails = '<myemail@gmail.com>';
app.use(logger('dev'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

router.get('/', function (req, res) {
  res.render('pages/index', { title: 'ejs'});
});
router.get('/oauth2/auth', function(req, res) {
  console.log('calling oauth2..');
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});
//
router.get('/token', function(req, res) {
	console.log('token is'+req.query.code);
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
//deprecated req.param(name): Use req.params, req.body, or req.query instead
  var code = req.query.code;
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log("accessToken " + conn.accessToken);
    console.log("refreshToken: " + conn.refreshToken);
    console.log("instanceUrl: " + conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
    res.render('pages/user', { title: 'SFDC User Information',
						 UserId: userInfo.id });
  });
});//end app.get('/token')
// about page
router.get('/about',function(req, res) {
    res.render('pages/about');
  });
app.use('/',router);
//app.listen(port, function() {
//    console.log('The server is running, ' + ' please open your browser at http://locahost:%s', port)
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express Server is listening on port '+ app.get('port'));
//end of server
});

module.exports app
