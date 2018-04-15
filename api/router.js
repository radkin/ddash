
var cistatus = require('./cistatus/controller');
var buildfinder = require('./buildfinder/controller');
var details = require('./details/controller');

module.exports.cistatus = function(app) {
  app.get('/', cistatus.get);
};

module.exports.buildfinder = function(app) {
  app.get('/', buildfinder.get);
};

module.exports.details = function(app) {
  app.param('id', details.attachId);
  app.param('version', details.attachVersion);
  app.get('/:id/:version', details.get);
};
