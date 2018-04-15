var config = require('../config');
var Promise = require('bluebird');
var _template = require('lodash/template');
var get = Promise.promisify(require('request'));
require('colorslite');

module.exports = function() {

  if (!config.useDetailsPage) {
    console.log('useDetailsPage is set to false. Exiting...');
    process.exit();
  }

  console.time('details');

  setTimeout(function() {
    console.timeEnd('details');
    console.log('The following took too long'.red);
    console.log(Object.keys(left));
    process.exit();
  }, 300000);

  var mainPromiseArray = [];
  var left = {};

  config.jobs.forEach(function(job) {
    if (job.name === 'larry' || job.name === 'moe' || job.name === 'culr') {
      console.log('---- skipping ' + job.name + ' because it puts too much of a strain on our servers ----');
    } else {

      config.yearVersions.forEach(function(ver) {

        var yearVer = ver;
        var url = template(job.url, yearVer, 'deploy', job.name);
        console.log(url);
        left[job.name + ' ' + yearVer] = true;

        mainPromiseArray.push(get(url + 'api/json?tree=builds[number,result,building,actions[causes[userName],moduleRecords[mainArtifact[version]]],changeSet[*[*[*[*]]]]]')
          .spread(function(res, body) {
            if (body[0] !== '{' && body[0] !== '[') {
              delete left[job.name + ' ' + yearVer];
              console.log(job.name.red, yearVer.red);
              return;
            }

            var builds = JSON.parse(body).builds.slice(0, 10);
            var path = __dirname + '/data/' + job.name + '/' + yearVer + '.json';
            var changePromiseArray = [];
            var newBuilds = [];

            builds.forEach(function(build) {

              var newBuild = {
                result: build.result,
                building: build.building,
                number: build.number,
                url: url + build.number,
              };

              build.actions.forEach(function(action) {
                if (action && action.moduleRecords && action.moduleRecords[0].mainArtifact) {
                  newBuild.version = action.moduleRecords[0].mainArtifact.version;
                }

                if (action && action.causes && action.causes[0].userName) {
                  newBuild.cause = action.causes[0].userName;
                }
              });

              if (build.changeSet) {
                newBuild.changes = build.changeSet.items;
                newBuild.changes.forEach(function(change) {
                  changePromiseArray.push(get('http://yourgerritinstance.domain.com:8080/changes/?q=' + change.commitId)
                    .spread(function(res, body) {
                      var parsed = JSON.parse(body.substring(4, body.length));
                      if (parsed[0] && parsed[0]._number) change.gerrit = parsed[0]._number;
                    }));
                });
              }

              newBuilds.push(newBuild);
            });

            return Promise.all(changePromiseArray)
              .then(function() {
                delete left[job.name + ' ' + yearVer];
                console.log(job.name.green, yearVer.green);
                var data = {
                  builds: newBuilds,
                  timestamp: Date.now(),
                };

                if (config.useRedis) {
                  var db = require('../db');
                  return db.set(job.name + yearVer, JSON.stringify(data));
                } else {
                  var fs = Promise.promisifyAll(require('fs-utils'));
                  return fs.writeJSONAsync(path, data);
                }
              });
          })
        .catch(function(err) {
          // console.log(err);
        }));
      });
    }
  });

  return Promise.all(mainPromiseArray)
    .then(function() {

      console.timeEnd('details');
      process.exit();
    });
};

function template(url, ver, type, name) {
  if (name === 'larry' && type === 'moe') {
    return _template(url)({ version: ver, type: type + '_job_trigger_here' });
  } else if (name === 'curly') {
    return _template(url)({version: ver + '_BUILD/', type: type });
  } else if (name === 'EDD') {
    return _template(url)({ version: '', type: '' + 'artifact_handling_here/' });
  } else {
    return _template(url)({ version: ver, type: type });
  }
}

module.exports();
