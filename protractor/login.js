describe('Login test', function() {
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
});
