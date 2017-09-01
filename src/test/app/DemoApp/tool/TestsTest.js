"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.tool.TestsTest', new function () {
    /**
     * @description test {@link DemoApp.tool.Tests} has a control
     * @memberOf DemoApp.test.tool.TestsTest
     * @param {EquivalentJS.test.Unit.assert} assert
     */
    this.testHasControl = function (assert) {
        var $control = $('[data-application="DemoApp.tool.Tests"]');

        assert.ok($control.length > 0, 'has control');
    };
});
