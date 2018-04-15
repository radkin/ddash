
var config = require('../config');

module.exports.get = function(req, res) {
  if (config.useRedis) {
    var db = require('../db');
    db.get('buildfinder').then(function (data) {
      res.send(data);
    });
  } else {
    delete require.cache[require.resolve('./data.json')];
    var response = require('./data.json');
    res.send(response);
  }
};
