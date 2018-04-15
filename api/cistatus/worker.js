var config = require('../config');
var Promise = require('bluebird');
var _template = require('lodash/template');
var get = Promise.promisify(require('request'));
require('colorslite');

module.exports = function() {

  console.time('cistatus');

  var jobs = [];
  var promiseArray = [];

  config.jobs.forEach(function(job) {

    var newJob = {
      name: job.name
    };
    jobs.push(newJob);

    config.yearVersions.forEach(function(ver) {

      var newVersion = {};
      newJob[ver] = newVersion;

      if (job.artifact) {

        promiseArray.push(
          get('http://adb.devops.fds.com/artifacts/search?name=' +
            escape(job.artifact) + '&release=' + ver)
          .spread(function(res, body) {

            var parsed = JSON.parse(body);

            try {
              if (parsed.status && parsed.status === 'success') {
                newVersion.artifact = parsed.result[0].version;
              }
            } catch (e) {
            }
          })
          .catch(function(err) {
            console.log(err);
          }));
      }

      config.types.forEach(function(type) {

        var url = template(job.url, ver, type, job.name);
        console.log(url);
        newVersion[type + 'Url'] = url;

        promiseArray.push(
          get(url +
            'api/json?tree=color,lastSuccessfulBuild[timestamp,url,number]'
          )
          .spread(function(res, body) {

            if (body[0] !== '{' && body[0] !== '[') {
              console.log(job.name.red, yearVer.red, type.red);
              return;
            }

            var parsed = JSON.parse(body);

            newVersion[type + 'Status'] = parsed.color;
            if (parsed.lastSuccessfulBuild) {

              newVersion.trigger =
                'Build #' + parsed.lastSuccessfulBuild.number;
              newVersion[type + 'LastUrl'] =
                parsed.lastSuccessfulBuild.url;
              newVersion[type + 'Last'] =
                parsed.lastSuccessfulBuild.timestamp;
            }

            console.log(job.name.green, yearVer.green, type.green);
          })
          .catch(function(err) {
            // console.log(err);
          }));
      });
    });
  });

  return Promise.all(promiseArray)
    .then(function() {

      var json = {
        jobs: jobs,
        timestamp: Date.now(),
        yearVersions: config.yearVersions,
        useDetailsPage: config.useDetailsPage,
      };

      if (config.useRedis) {
        var db = require('../db');
        return db.set('cistatus', JSON.stringify(json));
      } else {
        var fs = Promise.promisifyAll(require('fs-utils'));
        return fs.writeJSONAsync(__dirname + '/data.json', json);
      }

    })
    .then(function() {

      console.timeEnd('cistatus');
      process.exit();
    });
};

function template(url, ver, type, name) {
  if (name === 'PROS' && type === 'deploy') {
    return _template(url)({
      version: ver,
      type: type + '_TRIGGER'
    });
  } else if (name === 'SDP') {
    if (type === 'deploy') {
      return _template(url)({
        version: ver + '_NEXUS-RELEASE-UPLOAD/',
        type: type
      });
    } else {
      return _template(url)({
        version: ver + '_BUILD/',
        type: type
      });
    }
  } else {
    return _template(url)({
      version: ver,
      type: type
    });
  }
}

module.exports();
