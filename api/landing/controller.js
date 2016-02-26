var config = require('../config');

module.exports.results = function(req, res, next, results) {
  req.body = req.body || {};
  req.body.results = results;
  next();
};

module.exports.get = function(req, res) {
  if (config.useRedis) {
    var db = require('../db');
    db.get('landing').then(function(data) {
      res.send(data);
    });
  } else {
    delete require.cache[require.resolve('./data.json')];
    var response = require('./data.json');
    res.send(response);
  }
};
