"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.tool.DocsTest', new function () {
    /**
     * @description test {@link DemoApp.tool.Docs} has a control
     * @memberOf DemoApp.test.tool.DocsTest
     * @param {EquivalentJs.test.Unit.assert} assert
     */
    this.testHasControl = function (assert) {
        var $control = $('[data-application="DemoApp.tool.Docs"]');

        assert.ok($control.length > 0, 'has control');
    };
});
