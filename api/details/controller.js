
var config = require('../config');

module.exports.attachId = function(req, res, next, id) {
  req.body = req.body || {};
  req.body.id = id;
  next();
};

module.exports.attachVersion = function(req, res, next, version) {
  req.body = req.body || {};
  req.body.version = version;
  next();
};

module.exports.get = function(req, res) {
  if (config.useRedis) {
    var db = require('../db');
    db.get(req.body.id + req.body.version).then(function(data) {
      res.send(data);
    });
  } else {
    var fs = require('fs');
    var path = __dirname + '/data/' + req.body.id + '/' + req.body.version + '.json';
    fs.exists(path, function(exists) {
      if (exists) {
        delete require.cache[require.resolve(path)];
        res.send(require(path));
      } else res.send();
    });
  }
};
