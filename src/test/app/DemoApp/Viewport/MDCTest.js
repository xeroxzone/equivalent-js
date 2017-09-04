"use strict";

/**
 * @class test viewport mdc wrapper
 */
DIC.define('DemoApp.test.Viewport.MDCTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.Viewport.MDCTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.Viewport.MDC} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.Viewport.MDC' === moduleClass.type,
            'is DemoApp.Viewport.MDC'
        );
    };
});
