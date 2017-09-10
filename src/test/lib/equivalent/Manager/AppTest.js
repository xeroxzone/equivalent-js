"use strict";

/**
 * @class test manager app module
 */
DIC.define('EquivalentJS.test.Manager.AppTest', new function () {
    /**
     * @description the manager mock
     * @memberOf EquivalentJS.test.Manager.AppTest
     * @alias {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf EquivalentJS.test.Manager.AppTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

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
     *  event has been fired and there are DOM elements in app collection
     * @memberOf EquivalentJS.test.Manager.AppTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Manager.App} moduleClass
     * @todo fix sometimes occouring bug in test cases through re-initialize app event
     */
    this.testAreAppsInitialized = function (assert, moduleClass) {
        var assertAsync = assert.async();

        manager.add(moduleClass.type).done(function (module) {
            module.$apps = $('<div data-application="DemoApp.mock.Testable"></div>');

            $(module).on('app:initialize', function () {
                assert.ok(
                    0 < module.$apps.length,
                    'event "app:initialize" has been fired' +
                    ' and DOM elements are in app collection'
                );

                assertAsync();
            });

            $(module).trigger('app:initialize');
        }).fail(function () {
            assert.notOk(false, 'could not load module');

            assertAsync();
        });
    };
});
