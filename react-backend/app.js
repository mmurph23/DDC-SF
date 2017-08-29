var jsforce = require('jsforce');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var http = require('http');
var app = express();
var session = require('express-session');
var router = express.Router();


/*app.set(d'port', process.env.PORT || 8001);*/
app.locals.title = 'sfdc app';
app.locals.emails = 'patrick.murphy@coxautoinc.com';
app.use(logger('dev'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(session({secret: 'S3CRE7', resave: true, saveUninitialized: true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
/*
SF URL:
SF Consumer Key: 3MVG9szVa2RxsqBZjh_k.RvJXDUONto6617zQuwcaGLwh_E8jSnT2Vw8u1Trf3.gqNNP44UmnGDdDDtSQDhGs
SF Consumer Secret: 73500702797681914
SF Security Token: fOOOmidtcFLcMIpAAxqmqI94
Authorization Code: aPrxSV6UAcNrPElTkQw.WI1hMwRJHS9Q1nga9luWeVx_aIrz8VptUbHIlrv5iMQeVUCAdZPHKw%3D%3D
User ID: 00541000001r285AAA
Org ID: 00D41000000UQkTEAW
*/

var oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://bspoke-dev-ed.my.salesforce.com',
    clientId : '3MVG9szVa2RxsqBZjh_k.RvJXDUONto6617zQuwcaGLwh_E8jSnT2Vw8u1Trf3.gqNNP44UmnGDdDDtSQDhGs',
    clientSecret : '73500702797681914',
    //redirectUri : 'http://localhost:' + port +'/token'
    redirectUri : 'http://localhost:8001/token'
});

app.get('/', function(req, res) {
    res.send('Hello');
});


/* SF OAuth request, redirect to SF login */
app.get('/oauth/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web'}));
});

/* OAuth callback from SF, pass received auth code and get access token */
app.get('/token', function(req, res) {
    var conn = new jsforce.Connection({oauth2: oauth2});
    var code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error(err); }

        console.log('Access Token: ' + conn.accessToken);
        console.log('Instance URL: ' + conn.instanceUrl);
        console.log('User ID: ' + userInfo.id);
        console.log('Org ID: ' + userInfo.organizationId);

        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        res.redirect('/user');
    });
});

app.get('/user', function(req, res) {

    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }

    var query = 'SELECT id, name FROM account LIMIT 10';
    // open connection with client's stored OAuth details
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
   });

    conn.query(query, function(err, result) {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        console.log(result.records);
        res.render('pages/user', {title: 'Accounts List', accounts: result.records});
    });
});

/*
//Index page
router.get('/', function (req, res) {
  res.render('pages/index', { title: 'ejs'});
});

//redirect to SF
router.get('/oauth2/auth', function(req, res) {
  console.log('calling oauth2..');
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});


router.get('/accounts', function(req, res) {
    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }

    var query = 'SELECT id, name FROM account LIMIT 10';
    // open connection with client's stored OAuth details
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    conn.query(query, function(err, result) {
        if (err) {
            console.error(err);
            res.redirect('/');
       }
       res.render('accounts', {title: 'Accounts List', accounts: result.records });
    });
});

//get token
router.get('/token', function(req, res) {
	console.log('token is '+req.query.code);
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

    req.session.accessToken = conn.accessToken;
    req.session.instanceUrl = conn.instanceUrl;
    res.redirect('/accounts');
    // ...
    /*res.render('pages/user', { title: 'SFDC User Information',
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

/* http.createServer(app).listen(app.get('port'), function(){
  console.log('Express Server is listening on port '+ app.get('port'));
//end of server
}); */

module.exports = app;
