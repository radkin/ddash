angular.module('devops');

categories = [{
  heading: 'Jenkins',
  width: 4,
  icon: 'file-text',
  color: 'yellow',
  links: [{
    name: 'larrydev',
    zabName: 'larry-dev',
    url: 'http://larry-dev:8080/jenkins/',
  }, {
    name: 'moe',
    zabName: 'moe.com',
    url: 'http://moe.com:8080/jenkins/',
  }, {
    name: 'Curly Server',
    zabName: 'Curly Jenkins',
    url: 'http://curly.com:8080/jenkins/',
  }]
}, {
  heading: 'gerrit servers',
  width: 4,
  icon: 'signal',
  color: 'green',
  links: [{
    name: 'curly gerrit 1',
    zabName: 'cg1',
    url: 'http://curl-gerrit.com/accounts/login/',
  }, {
    name: 'larry gerrit 2',
    url: 'http://larry-gerrit.com/accounts/login/',
  }, {
    name: 'moe gerrit 1',
    url: 'https://moe-gerrit.com/accounts/login/',
  }]
}];
