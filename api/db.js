
var redis = require('then-redis');

var db = redis.createClient({
  host: 'localhost',
  port: 6379,
});

module.exports = db;
