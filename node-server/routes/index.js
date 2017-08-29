//import note routes
const noteRoutes = require('./note_routes');

//export combined routes
module.exports = function(app, db) {
     noteRoutes(app, db);
};
