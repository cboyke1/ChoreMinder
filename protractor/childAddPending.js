'use strict';

var activityCount=0;

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
      element(by.id('username')).sendKeys('testc1@example.com');
      element(by.id('password')).sendKeys('password');
      element(by.id('signin')).click();
    });
  });
  describe('step 3', function() {
    it('should display home page for child', function() {
      element(by.binding('family.name')).getText().then( function(name) {
        expect(name).toBe('Test Family');
      });
      element.all(by.repeater('activity in activities')).count().then(function(count) {
        console.log('Original count: ' + count);
        activityCount = count;
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
      var children = element.all(by.repeater('u in initData.family.children'));
      expect(children.count()).toEqual(2);
      var input = children.first().element(by.tagName('input'));
      input.click();

      var chores = element.all(by.repeater('c in initData.chores'));
      expect(chores.count()).toEqual(2);
      chores.first().element(by.tagName('input')).click();

      element(by.id('pt-btn-create')).click();

    });
  });
  describe('step 6', function() {
    it('new chore should appear at top of list on home page', function() {
      var activities = element.all(by.repeater('activity in activities'));
      expect(activities.count()).toEqual(activityCount+1);
    });
  });



});
