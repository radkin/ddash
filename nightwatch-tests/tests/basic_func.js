module.exports = {
  'step one': function(browser) {
    browser.url('http://localhost:9000')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div[class=dnavbar]', 1000)
      .waitForElementVisible('div[class=dcontent]', 1000)
  },

  'step two': function(browser) {
    browser.url('http://localhost:9000/#/cistatus')
      .waitForElementVisible('body', 1000)
      //.assert.containsText('#h1', 'Application')
      .waitForElementVisible('body.ng-scope', 1000)
      //.assert.containsText('#h1', 'Application')
      .end();
  },

  'step three': function(browser) {
    browser.url('http://localhost:9000/#/cistatussearch')
      .waitForElementVisible('body', 1000)
      //.assert.containsText('#h1', 'Application')
      .waitForElementVisible('body.ng-scope', 1000)
      //.assert.containsText('#h1', 'Application')
      .end();
  }
};
