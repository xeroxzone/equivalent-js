"use strict";

/**
 * @class test manager app module
 */
DIC.define('EquivalentJS.test.Manager.AppTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJS.test.Manager.AppTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Manager.App} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJS.Manager.App' === moduleClass.type,
            'is EquivalentJS.Manager.App'
        );
    };

    /**
     * @description test if the {@link EquivalentJS.Manager.App#app:initialize}
     *  event has been fired
     * @memberOf EquivalentJS.test.Manager.AppTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Manager.App} moduleClass
     * @todo fix sometimes occouring bug in test cases through re-initialize app event
     */
    this.testAreAppsInitialized = function (assert, moduleClass) {
        moduleClass.construct();

        $(moduleClass).trigger('app:initialize');

        assert.ok(
            0 < moduleClass.collection.length,
            'event "app:initialize" has been fired'
        );
    };
});
