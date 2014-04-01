/*global browser sleep element describe beforeEach it expect */

(function() {
  'use strict';

  describe('Meetings Page', function() {
    var ptor;

    beforeEach(function() {
      ptor = protractor.getInstance();

      browser.driver.get(ptor.baseUrl + '/meetings');
      ptor.sleep(4000);
    });


    it('Should visit the meetigns page', function() {
      expect(browser.getCurrentUrl()).toBe('http://localhost:2010/ebsa/meetings');

      element.all(by.css('.meetings-filter')).last().$('p').getText().then(function(title) {
        expect(title).toBe('All');
      });
    });

  });

})();