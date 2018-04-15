angular.module('devops');

categories = [{
    heading: 'Jenkins',
    width: 4,
    icon: 'file-text',
    color: 'yellow',
    links: [{
        name: 'larry',
        zabName: 'larry-alias',
        url: 'https://jenkins.domain.com/jenkins/',
      }, {
        name: 'moe',
        zabName: 'moei-alias',
        url: 'http://moe-jenkins.domain.com:8080/jenkins/',
      }, ],
  }, {
    heading: 'some other kind of server',
    width: 4,
    icon: 'rocket',
    color: 'red',
    links: [{
        name: 'other kind1',
        url: 'https://other.domain.com/Page/Home',
      }, {
        name: 'another kind',
        url: 'https://console.developers.google.com/project/our-google-cloud-account/compute/instances?graph=GCE_CPU',
      }, ],
  }, ],
}, ];
