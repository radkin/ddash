
// Hosts the API and serves up the client using Express
var port = process.env.PORT || 9000;
var express = require('express');
var request = require('request');
var cors = require('cors');
var app = express();

// Using cors for cross origin requests
app.use(cors());
// Serves up client (index.html)
app.use(express.static(__dirname));

// Setting up API routes
var cistatusRouter = express.Router();
var detailsRouter = express.Router();
var landingRouter = express.Router();
app.use('/api/cistatus', cistatusRouter);
app.use('/api/details', detailsRouter);
app.use('/api/landing', landingRouter);
require('./api/router').cistatus(cistatusRouter);
require('./api/router').details(detailsRouter);
require('./api/router').landing(landingRouter);

app.listen(port, function() {
  console.log('Listening on', port);
});
