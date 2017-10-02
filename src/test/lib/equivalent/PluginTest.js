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
        var configuration = EquivalentJS.System.getConfiguration(),
            plugins = configuration.plugins,
            hasActivePlugins = false,
            assertAsync = assert.async()
        ;

        $.each(plugins, function (plugin, active) {
            if (true === Boolean(active)) {
                hasActivePlugins = true;
            }
        });

        manager.add(moduleClass.type).done(function (module) {
            if (true === hasActivePlugins) {
                var hasReadyPlugins = false;

                $(module).on('ready:plugin', function () {
                    assert.ok(0 < module.plugins.length, 'has loaded plugins');

                    assertAsync();

                    hasReadyPlugins = true;
                });

                setTimeout(function () {
                    if (false === hasReadyPlugins) {
                        assert.notOk(true, 'could not load any plugins');

                        assertAsync();
                    }
                }, 1024);
            } else {
                assert.ok(true, 'no active plugins in configuration found');

                assertAsync();
            }
        }).fail(function () {
            assert.notOk(true, 'could not load module');

            assertAsync();
        });
    };
});
