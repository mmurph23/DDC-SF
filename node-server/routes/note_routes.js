//create route, which will take the express instance and database as arguments


//mongodb requirement to pass in a record id as an ObjectID
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

     //get something from db
     app.get('/notes/:id', (req, res) =>{
          const id = req.params.id;
          const details = {'_id': new ObjectID(id)};
          db.collection('notes').findOne(details, (err, item) => {
               if (err) {
                    res.send({'error': 'An error has occurred'});
               } else {
                    res.send(item);
               }
          });
     });

     //send something to db
     app.post('/notes', (req, res) => {
          //create note here
          const note={ text: req.body.body, title: req.body.title};
          db.collection('notes').insert(note, (err, result) => {
               if (err) {
                    res.send({'error' : 'An error has occurred'});
               } else {
                    res.send(result.ops[0]);
               }
          });
     });

     //app.delete
     app.delete('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').remove(details, (err, item) => {
          if (err) {
             res.send({'error':'An error has occurred'});
          } else {
             res.send('Note ' + id + ' deleted!');
          } 
        });
     });


     //app.update
     app.put('/notes/:id', (req, res) => {
       const id = req.params.id;
       const details = { '_id': new ObjectID(id) };
       const note = { text: req.body.body, title: req.body.title };
       db.collection('notes').update(details, note, (err, result) => {
         if (err) {
             res.send({'error':'An error has occurred'});
         } else {
             res.send(note);
         }
       });
     });

};
