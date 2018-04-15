var config = require('../config');
var Promise = require('bluebird');
var elasticsearch = require('elasticsearch');

require('colorslite');

module.exports = function() {
    console.time('buildfinder');

    var getEsData = function() {
        return new Promise(function(resolve, reject) {
            var hits = [];
            var auth = false;
            var port = 9200;
            var protocol = 'http';
            var hostUrls = ['logs.devops.fds.com'];
            var hosts = hostUrls.map(function(host) {
                return {
                    protocol: protocol,
                    host: host,
                    port: port,
                    auth: auth
                };
            });

            var client = new elasticsearch.Client({
                hosts: hosts,
                log: {
                    type: 'file',
                    level: 'trace',
                    path: 'buildfinder_elasticsearch.log'
                }
            });

            client.search({
                //requestTimeout: 30000,
                index: 'jenkins-2017*',
                type: 'build_info',
                body: {
                    "query": {
                        "bool": {
                            "must": [{
                                "query_string": {
                                    "query": "JOB_NAME:*review* AND JOB_NAME:*deploy* and JOB_NAME:*trigger*",
                                    "analyze_wildcard": true
                                }
                            }]
                        }
                    }
                }
            }).then(function(body) {
                hits = body.hits.hits;
                resolve(hits)
            }, function(error) {
                console.trace(error.message);
            });
        });
    };
    getEsData()
        .then(function(hits) {
            var json = {
                hits: hits,
                timestamp: Date.now(),
            };
            if (config.useRedis) {
                var db = require('../db');
                return db.set('buildfinder', JSON.stringify(json));
            } else {
                var fs = Promise.promisifyAll(require('fs-utils'));
                return fs.writeJSONAsync(__dirname + '/data.json', json);
            }
        })
        .catch(function(error) {
            console.log('error gathering elasticsearch client host data', error);
        })
        .finally(function() {
            process.exit();
        });

}; // end of module

module.exports();
