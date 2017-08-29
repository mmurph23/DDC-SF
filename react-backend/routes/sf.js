var express = require('express');
var router = express.Router();

//pull js force
var jsforce = require('jsforce');
/*var conn= new jsforce.Connection();*/
var oauth2 = new jsforce.OAuth2({

          loginUrl: 'https://bspoke-dev-ed.my.salesforce.com',
          //SF consumer key
          clientId: '3MVG9szVa2RxsqBZjh_k.RvJXDUONto6617zQuwcaGLwh_E8jSnT2Vw8u1Trf3.gqNNP44UmnGDdDDtSQDhGs',
          //SF consumer secret
          clientSecret: '73500702797681914',
          redirectUri : 'http://localhost:8001/'

});

router.get('/', function(req, res) {

        console.log('token is'+req.query.code);
        var conn = new jsforce.Connection({ oauth2 : oauth2 });
        //deprecated req.param(name): Use req.params, req.body, or req.query instead
        var code = req.query.code;
        conn.authorize(code, function(err, userInfo) {
             if (err) { return console.error(err); }
        });
});

/*
SF Consumer Key: 3MVG9szVa2RxsqBZjh_k.RvJXDUONto6617zQuwcaGLwh_E8jSnT2Vw8u1Trf3.gqNNP44UmnGDdDDtSQDhGs
SF Consumer Secret: 73500702797681914
SF Security Token: fOOOmidtcFLcMIpAAxqmqI94
Authorization Code: aPrxSV6UAcNrPElTkQw.WI1hMwRJHS9Q1nga9luWeVx_aIrz8VptUbHIlrv5iMQeVUCAdZPHKw%3D%3D
*/

//connect to sf




     /* The below code works, but is not oauth
     conn.login('patrick@bspoke.com', 'ddc4ev@123fOOOmidtcFLcMIpAAxqmqI94', function(err, result) {
          //error handling
          if (err) {return console.error(err)}
          //query to sf
          conn.query('SELECT Id, Name FROM Account', function(err, result) {
               if(err) {return console.error(err); }
               console.log(result)
               const sfResponse = result;
               console.log(sfResponse);
               res.send(JSON.stringify(sfResponse));

          });

     }); */

     /*
     conn2.login(username, password, function(err, userInfo) {
          if (err) {return console.error(err); }
          console.log(conn2.accessToken);
          console.log(conn2.instanceUrl);
          console.log('User ID: ' + userInfo.id);
          console.log('Org ID: ' + userInfo.organizationId);
     });

     res.redirect(oauth2.getAuthorizationUrl({scope : 'api web id'})); */






/*router.get('/', function(req, res, next) {
     res.send(sfResponse);
});

 GET users listing.
router.get('/', function(req, res, next) {
  res.JSON([{
          id: 1,
          username: 'mpmurphy4'
     },
     {
          id: 2,
          username: 'stabbychris'
     },

  ]);
}); */

module.exports = router;
