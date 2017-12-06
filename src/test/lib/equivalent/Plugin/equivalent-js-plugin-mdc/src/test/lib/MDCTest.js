"use strict";

/**
 * @class
 */
DIC.define('EquivalentJS.test.Plugin.MDCTest', new function () {
    /**
     * @description the manager mock
     * @memberOf EquivalentJS.test.Plugin.MDCTest
     * @type {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf EquivalentJS.test.Plugin.MDCTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test {@link EquivalentJS.Plugin.MDC} has assigned
     *  module class type by manager
     * @memberOf EquivalentJS.test.Plugin.MDCTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Plugin.MDC} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJS.Plugin.MDC' === moduleClass.type,
            'is EquivalentJS.Plugin.MDC'
        );
    };
});
