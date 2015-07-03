'use strict';

var activityCount=0;

describe('Child Complete Chore', function() {
  describe('step 1', function() {
    it('should display sign in message', function() {
      browser.get('http://localhost');
      expect(browser.getTitle()).toContain('ChoreMinder');
      element(by.id('pt-signin')).click();
    });
  });
  describe('step 2', function() {
    it('should display login form', function() {
      element(by.id('username')).sendKeys('testchild1');
      element(by.id('password')).sendKeys('password');
      element(by.id('signin')).click();
    });
  });

  describe('step 3', function() {
    it('should display home page for child', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toContain('Welcome, Test Child 1.');
    });
  });

  describe('step 4', function() {
    it('click to display new chore page', function() {
      element(by.id('pt-chore-complete')).click();
    });
  });

  describe('step 5', function() {
    it('create and save new chore', function() {
      var children = element.all(by.repeater('u in initData.family.children'));
      expect(children.count()).toEqual(2);


      var chores = element.all(by.repeater('c in initData.chores'));
      expect(chores.count()).toEqual(5);
      chores.first().element(by.tagName('input')).click();

      element(by.id('pt-btn-create')).click();

    });
  });

  describe('step 6', function() {
    it('new chore should appear at top of list on home page', function() {
      var header = element(by.id('pt-header'));
      expect(header.getText()).toContain('Welcome, Test Child 1.');
      var activities = element.all(by.repeater('activity in activities'));
      // TO DO - VERIFY NEW ACTIVITY ADDED
    });
  });

  describe('step 7', function() {
    it('should sign out', function() {
      browser.get('http://localhost/auth/signout');
    });
  });


});
