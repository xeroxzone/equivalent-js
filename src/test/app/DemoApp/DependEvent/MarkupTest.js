"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.DependEvent.MarkupTest', new function () {
    /**
     * @description test {@link DemoApp.DependEvent.Markup}
     *  has wrapped the text in headline
     * @memberOf DemoApp.test.DependEvent.MarkupTest
     * @param {EquivalentJS.test.Unit.assert} assert
     */
    this.testHasWrappedTextInHeadline = function (assert) {
        var $demo = $('[data-application="DemoApp.DependEvent"]');

        assert.ok($demo.find('h1').length > 0, 'has wrapped text in headline');
    };
});
