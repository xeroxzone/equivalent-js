"use strict";

/**
 * @class test manager controller module
 */
DIC.define('EquivalentJS.test.Manager.ControllerTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJS.test.Manager.ControllerTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Manager.Controller} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJS.Manager.Controller' === moduleClass.type,
            'is EquivalentJS.Manager.Controller'
        );
    };
});
