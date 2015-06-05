'use strict';

var activityCount=0;

describe('New Family Sign Up', function() {
  describe('step 1', function() {
    it('should display sign in message', function() {
      browser.get('http://localhost');
      expect(browser.getTitle()).toContain('ChoreMinder');

      element(by.id('pt-signup')).click();
    });
  });
  describe('step 2', function() {
    it('should display login form', function() {
      element(by.id('firstName')).sendKeys('Test FName');
      element(by.id('lastName')).sendKeys('Test LName');
      element(by.id('email')).sendKeys('testParent@example.com');
      element(by.id('password')).sendKeys('password');
      element(by.id('pt-signup')).click();
    });
  });
  describe('step 3', function() {
    it('should display create family page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Create Family - Step 1');
      element(by.id('name')).sendKeys('Test Family');
      element(by.id('pt-next')).click();

    });
  });

  describe('step 4', function() {
    it('should display Add Child', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Add Child');
      element(by.id('firstName')).sendKeys('Test Child FName');
      element(by.id('email')).sendKeys('testChild@example.com');
      element(by.id('password')).sendKeys('password');
      element(by.id('pt-next')).click();

    });
  });

  describe('step 5', function() {
    it('should display Parent Home page', function() {
      var header = element(by.id('pt-family-name'));
      expect(header.getText()).toEqual('Test Family');
    });
  });

  describe('step 6', function() {
    it('should sign out', function() {
      browser.get('http://localhost/auth/signout');
    });
  });


});
