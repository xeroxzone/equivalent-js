"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.DependPromise.MarkupTest', new function () {
    /**
     * @description test {@link DemoApp.DependPromise.Markup}
     *  has wrapped the text in headline
     * @memberOf DemoApp.test.DependPromise.MarkupTest
     * @param {EquivalentJs.test.Unit.assert} assert
     */
    this.testHasWrappedTextInHeadline = function (assert) {
        var $demo = $('[data-application="DemoApp.DependPromise"]');

        assert.ok($demo.find('h1').length > 0, 'has wrapped text in headline');
    };
});
