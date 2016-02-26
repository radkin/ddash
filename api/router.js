
var cistatus = require('./cistatus/controller');
var details = require('./details/controller');
var landing = require('./landing/controller');

module.exports.cistatus = function(app) {
  app.get('/', cistatus.get);
};

module.exports.details = function(app) {
  app.param('id', details.attachId);
  app.param('version', details.attachVersion);
  app.get('/:id/:version', details.get);
};

module.exports.landing = function(app) {
  app.get('/', landing.get);
}
