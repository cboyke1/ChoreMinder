'use strict';

describe('Admin Delete Test Family', function() {
  describe('step 1', function() {
    it('should display sign in message', function() {
      browser.get('http://localhost');
      expect(browser.getTitle()).toContain('ChoreMinder');
      element(by.id('pt-signin')).click();
    });
  });
  describe('step 2', function() {
    it('should display login form', function() {
      element(by.id('username')).sendKeys('admin');
      element(by.id('password')).sendKeys('password');
      element(by.id('signin')).click();
    });
  });

  describe('step 3', function() {
    it('should display list family page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Families');
      $('.list-group').element(by.linkText('PT Test Family')).click();

    });
  });

  describe('step 4', function() {
    it('should display family detail page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('PT Test Family');
      element(by.id('pt-remove')).click();
    });
  });

  describe('step 5', function() {
    it('should sign out', function() {
      browser.get('http://localhost/#!/signout');
    });
  });


});
