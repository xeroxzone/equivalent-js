"use strict";

/**
 * @class
 */
DIC.define('DemoApp.test.tool.DateTimeTest', new function () {
    /**
     * @description test {@link DemoApp.tool.DateTime.layout} is setted
     * @memberOf DemoApp.test.tool.DateTimeTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {DemoApp.tool.DateTime} moduleClass
     */
    this.testHasLayout = function (assert, moduleClass) {
        assert.ok(moduleClass.layout, 'has layout');
    };
});
