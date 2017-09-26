"use strict";

/**
 * @class test plugin module loader
 */
DIC.define('EquivalentJS.test.PluginTest', new function () {
    /**
     * @description the manager mock
     * @memberOf EquivalentJS.test.PluginTest
     * @alias {EquivalentJS.Manager}
     */
    var manager;

    /**
     * @description setup the manager
     * @memberOf EquivalentJS.test.PluginTest
     * @param {EquivalentJS.Manager} managerInstance
     */
    this.setup = function (managerInstance) {
        manager = managerInstance;
    };

    /**
     * @description test has assigned module class type by manager
     * @memberOf EquivalentJS.test.PluginTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Plugin} moduleClass
     */
    this.testHasAssignedTypeByManager = function (assert, moduleClass) {
        assert.ok(
            'EquivalentJS.Plugin' === moduleClass.type,
            'is EquivalentJS.Plugin'
        );
    };

    /**
     * @description test has plugins loaded
     * @memberOf EquivalentJS.test.PluginTest
     * @param {EquivalentJS.test.Unit.assert} assert
     * @param {EquivalentJS.Plugin} moduleClass
     */
    this.testHasPluginsLoaded = function (assert, moduleClass) {
        var assertAsync = assert.async();

        manager.add(moduleClass.type).done(function (module) {
            $(module).on('ready:plugin', function () {
                assert.ok(0 < module.plugins.length, 'has loaded plugins');

                assertAsync();
            });
        }).fail(function () {
            assert.notOk(false, 'could not load module');

            assertAsync();
        });
    };
});
