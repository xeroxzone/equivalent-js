"use strict";

/**
 * @class test manager controller module
 */
DIC.define('EquivalentJs.test.Manager.ControllerTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJs.test.Manager.ControllerTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.Controller} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJs.Manager.Controller' === moduleClass.type,
            'is EquivalentJs.Manager.Controller'
        );
    };
});
