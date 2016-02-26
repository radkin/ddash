
var redis = require('then-redis');

var db = redis.createClient({
  host: 'moe.com',
  port: 6379,
});

module.exports = db;
