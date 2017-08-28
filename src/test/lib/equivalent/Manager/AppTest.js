"use strict";

/**
 * @class test manager app module
 */
DIC.define('EquivalentJs.test.Manager.AppTest', new function () {
    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJs.test.Manager.AppTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.App} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJs.Manager.App' === moduleClass.type,
            'is EquivalentJs.Manager.App'
        );
    };

    /**
     * @description test if the {@link EquivalentJs.Manager.App#app:initialize}
     *  event has been fired
     * @memberOf EquivalentJs.test.Manager.AppTest
     * @param {EquivalentJs.test.Unit.assert} assert
     * @param {EquivalentJs.Manager.App} moduleClass
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
