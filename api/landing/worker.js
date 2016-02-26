var config = require('../config');
var Promise = require('bluebird');
var zabUser = process.env.ZABBIX_USER;
var zabPass = process.env.ZABBIX_PASS;

require('colorslite');

module.exports = function() {
  console.time('landing');

  var getZabbixData = function() {
    return new Promise(function(resolve, reject) {

      var results = [];
      var Zabbix = require('zabbix-node');
      var zabbix =
        new Zabbix(
          'http://larry-zabbix.com/api_jsonrpc.php',
          zabUser, zabPass);

      zabbix.getApiVersion(function(err, resp, body) {
        if (!err) {
          console.log(
            'Unauthenticated API version request, and the version is: ' +
            body.result);
        }
      });

      zabbix.login(function(err, resp, body) {
        if (!err) {
          console.log('Authenticated! AuthID is: ' + zabbix.authid);
        }

        zabbix.getApiVersion(function(err, resp, body) {
          console.log('Zabbix API version is: ' + body.result);
        });

        zabbix.call('alert.get', {
            output: 'extend',
          },
          function(err, resp, body) {
            if (err) {
              reject(err);
            } else {
              console.log(resp.statusCode + ' result: ' + body);
              results.push(body);
              resolve(results);
            }
          });
      });
    });
  };

  getZabbixData()
    .then(function(results) {
      console.log(results);
      var json = {
        results: results,
        timestamp: Date.now(),
      };
      if (config.useRedis) {
        var db = require('../db');
        return db.set('landing', JSON.stringify(json));
      } else {
        var fs = Promise.promisifyAll(require('fs-utils'));
        return fs.writeJSONAsync(__dirname + '/data.json', json);
      }
    })
    .catch(function(error) {
      console.log('error gathering zabbix host data', error);
    })
    .finally(function() {
      console.timeEnd('landing');
      process.exit();
    });

}; // end of module

module.exports();
