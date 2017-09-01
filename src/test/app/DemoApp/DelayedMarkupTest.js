"use strict";

/**
 * @class test delayed demo markup
 */
DIC.define('DemoApp.test.DelayedMarkupTest', new function () {
    /**
     * @description test delayed demo markup
     * @memberOf DemoApp.test.DelayedMarkupTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.DelayedMarkup} moduleClass
     */
    this.testDelayedDemoMarkup = function (assert, moduleClass) {
        var assertAsync = assert.async();

        moduleClass.construct();

        moduleClass.$markup = $('<div/>');

        setTimeout(function () {
            assert.ok(
                0 < moduleClass.$markup.find('ul').length,
                'get delayed markup'
            );

            assertAsync();
        }, 2048);
    };
});
