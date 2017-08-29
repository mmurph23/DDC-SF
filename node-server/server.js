//dependencies
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
//app declarations
const app = express();
const port = 8001;

//utilize dependencies
app.use(bodyParser.urlencoded({extended: true}));


//connect to db
MongoClient.connect(db.url, (err, database) => {
     if (err) return console.log(err)

     //import routes and start server
     require('./routes')(app, database);
     app.listen(port, () => {
          console.log('We are live on ' + port);
     })
})
