"use strict";

/**
 * @class test if a test mock is available
 */
DIC.define('DemoApp.test.mock.TestableTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf DemoApp.test.mock.TestableTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {DemoApp.mock.Testable} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'DemoApp.mock.Testable' === moduleClass.type,
            'is DemoApp.mock.Testable'
        );
    };
});
