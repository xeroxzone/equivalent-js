"use strict";

/**
 * @class test viewport design handlers
 */
DIC.define('DemoApp.test.ViewportTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.ViewportTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.Viewport} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.Viewport' === moduleClass.type,
            'is DemoApp.Viewport'
        );
    };
});
