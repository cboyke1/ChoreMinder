describe('Request Chore', function() {
  describe('step 1', function() {
    it('should display sign in message', function() {
      browser.get('http://localhost');
      expect(browser.getTitle()).toContain('ChoreMinder');

      element(by.id('signin')).click();
    });
  });
  describe('step 2', function() {
    it('should display login form', function() {
      element(by.id('username')).sendKeys('testp@example.com');
      element(by.id('password')).sendKeys('password');
      element(by.id('signin')).click();
    });
  });
  describe('step 3', function() {
    it('should display home page for parent', function() {
      element(by.binding('family.name')).getText().then( function(name) {
        expect(name).toBe('Test Family');
      });
    });
  });
  describe('step 4', function() {
    it('click to display new chore page', function() {
      element(by.id('pt-request-chore')).click();
    });
  });
  describe('step 5', function() {
    it('create and save new chore', function() {
      var childList = element.all(by.repeater('u in initData.family.children'));
      element(by.id('pt-request-chore')).click();
    });
  });

});
