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
    it('should display signup page', function() {
      element(by.id('firstName')).sendKeys('TestparentF');
      element(by.id('lastName')).sendKeys('TestparentL');
      element(by.id('email')).sendKeys('testparent@choreminder.net');
      element(by.id('username')).sendKeys('testparent');
      element(by.id('password')).sendKeys('password');
      element(by.id('pt-signup')).click();
    });
  });
  describe('step 3', function() {
    it('should display create family page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Create Family - Step 1');
      element(by.id('name')).sendKeys('PT Test Family');
      element(by.id('pt-next')).click();

    });
  });

  describe('step 4', function() {
    it('should display Add Child', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Add Child');
      element(by.id('firstName')).sendKeys('Test Child 1');
      element(by.id('email')).sendKeys('testchild1@choreminder.net');
      element(by.id('username')).sendKeys('testchild1');
      element(by.id('password')).sendKeys('password');
      element(by.id('pt-next')).click();

    });
  });

  describe('step 5', function() {
    it('Add another y/n page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Add Another Child?');
      element(by.id('pt-add-another-yes')).click();

    });
  });

  describe('step 6', function() {
    it('should add second child', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Add Child');
      element(by.id('firstName')).sendKeys('Test Child 2');
      element(by.id('email')).sendKeys('testchild2@choreminder.net');
      element(by.id('username')).sendKeys('testchild2');
      element(by.id('password')).sendKeys('password');
      element(by.id('pt-next')).click();

    });
  });

  describe('step 7', function() {
    it('Add another y/n page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Add Another Child?');
      element(by.id('pt-add-another-no')).click();

    });
  });

  describe('step 8', function() {
    it('should display Chores page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toEqual('Chores');
      element(by.id('pt-done')).click();
    });
  });

  describe('step 9', function() {
    it('should display family home page', function() {
      var header = element(by.id('pt-family-name'));
      expect(header.getText()).toEqual('PT Test Family');
    });
  });


  describe('step 10', function() {
    it('should sign out', function() {
      browser.get('http://localhost/#!/signout');
    });
  });


});
