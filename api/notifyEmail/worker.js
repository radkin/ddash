var request = require('request');
var moment = require('moment');
var email = require('emailjs');

var server 	= email.server.connect({
   host:    "youremailhost.domain.com",
   domain: "domain.com",
   ssl:     false
});

module.exports = function() {
  var self = this;

    self.appGroupDistro1 = [
      'app1',
      'app2',
      'app3'
    ];
    self.appGroupDistro2 = [
      'app1',
      'app2',
      'app3'
    ];

  request('http://localhost/api/cistatus', function (error, response, body) {
    self.oneDayAgo = moment().add(-1, 'days');
    self.twoDaysAgo = moment().add(-2, 'days');
    self.jobStatus = {};
    self.jobStatus.failed1Day = {};
    self.jobStatus.failed1DayLessThan2 = [];
    self.result = JSON.parse(body);
    self.jobs = self.result['jobs'];
    self.yearVersions = self.result['yearVersions'];
    self.jobs.forEach(function(job) {
      var result = job;
      self.yearVersions.forEach(function(yv) {
        //deployStatus
        if(job[yv].deployStatus){
          if (job[yv]['deployStatus'] == 'red'){
            if (self.oneDayAgo > job[yv]['deployLast']) {
              self.jobStatus.failed1Day[yv] = job.name;
              if (job[yv]['deployLast'] > self.twoDaysAgo) {
                if (!self.jobStatus.failed1DayLessThan2[yv]){
                self.jobStatus.failed1DayLessThan2[yv] = [];
                }
                var jobData = {
                  name: job.name,
                  failedObj: job[yv],
                };
                self.jobStatus.failed1DayLessThan2[yv].push(jobData);              }
            }
          }
        }
        // reviewStatus
        if(job[yv].reviewStatus){
          if (job[yv]['reviewStatus'] == 'red'){
            if (self.oneDayAgo > job[yv]['reviewLast']) {
              self.jobStatus.failed1Day[yv] = job.name;
              if (job[yv]['reviewLast'] > self.twoDaysAgo) {
                if (!self.jobStatus.failed1DayLessThan2[yv]){
                self.jobStatus.failed1DayLessThan2[yv] = [];
                }
                var jobData = {
                  name: job.name,
                  failedObj: job[yv],
                };
                self.jobStatus.failed1DayLessThan2[yv].push(jobData);
              }
            }
          }
        }
      });
    });
    var message = '';
    var subject = '';
    for (yv in self.jobStatus.failed1DayLessThan2) {
      for (failedJob in self.jobStatus.failed1DayLessThan2[yv]) {
        if (self.jobStatus.failed1DayLessThan2[yv][failedJob]['failedObj']['deployStatus'] == 'red') {
          subject = self.jobStatus.failed1DayLessThan2[yv][failedJob]['failedObj']['deployUrl'].split(/\//)[5] + " build failing!";
          message = "Please check the following URL " + self.jobStatus.failed1DayLessThan2[yv][failedJob]['failedObj']['deployUrl'];
        } else {
          subject = self.jobStatus.failed1DayLessThan2[yv][failedJob]['failedObj']['reviewUrl'].split(/\//)[5] + " build failing!";
          message = "Please check the following URL " + self.jobStatus.failed1DayLessThan2[yv][failedJob]['failedObj']['reviewUrl'];
        }
        console.log(subject);
        console.log(message);
        // architecturalEnhancements
        if (self.architecturalEnhancements.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name'])) {
          server.send({
            text:    message,
            from:    "joe schmoe<joe@schmoe.com>",
            //to:      "someone <someone@your-email.com>, another <another@your-email.com>",
            to: "joe schmoe<joe@schmoe.com>",
             //cc:      "else <else@your-email.com>",
            subject: subject
          }, function(err, message) { console.log(err || message); });
        // customerManagement
      } else if (self.customerManagement.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name'])) {
          server.send({
            text:    message,
            from:    "joe schmoe<joe@schmoe.com>",
            to: "joe schmoe<joe@schmoe.com>",
             //cc:      "else <else@your-email.com>",
            subject: subject
          }, function(err, message) { console.log(err || message); });
        // DEVOPS
      } else if (self.devops.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name']) || self.unknown.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name'])) {
          server.send({
            text:    message,
            from:    "joe schmoe<joe@schmoe.com>",
            to: "joe schmoe<joe@schmoe.com>",
             //cc:      "else <else@your-email.com>",
            subject: subject
          }, function(err, message) { console.log(err || message); });
        // discovery
      } else if (self.discovery.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name'])) {
          server.send({
            text:    message,
            from:    "joe schmoe<joe@schmoe.com>",
            to: "joe schmoe<joe@schmoe.com>",
            //cc:      "else <else@your-email.com>",
            subject: subject
          }, function(err, message) { console.log(err || message); });
        // purchaseAndDelivery
      } else if (self.purchaseAndDelivery.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name'])) {
          server.send({
            text:    message,
            from:    "joe schmoe<joe@schmoe.com>",
            to: "joe schmoe<joe@schmoe.com>",
            //cc:      "else <else@your-email.com>",
            subject: subject
          }, function(err, message) { console.log(err || message); });
        // selection
      } else if (self.selection.includes(self.jobStatus.failed1DayLessThan2[yv][failedJob]['name'])) {
          server.send({
            text:    message,
            from:    "joe schmoe<joe@schmoe.com>",
            to: "joe schmoe<joe@schmoe.com>",
            //cc:      "else <else@your-email.com>",
            subject: subject
          }, function(err, message) { console.log(err || message); });
        }
      }
    }
  });
}; // end of module


module.exports();
