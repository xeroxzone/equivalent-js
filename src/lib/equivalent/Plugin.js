"use strict";

/** @module EquivalentJS/Plugin */

/**
 * @class
 * @classdesc The plugin module to load plugins into framework stack
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.Plugin
 * @constructs
 */
EquivalentJS.define('EquivalentJS.Plugin', new function () {
    /**
     * @description indicates a plugin is loaded ready into DIC
     * @event EquivalentJS.Plugin#ready:plugin
     */

    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.Plugin
     * @private
     * @alias {EquivalentJS.Plugin}
     */
    var _ = this;

    /**
     * @description the path uri to load plugins from
     * @memberOf EquivalentJS.Plugin
     * @private
     * @type {?string}
     */
    var pluginsPath = null;

    /**
     * @description collection of loaded plugins
     * @memberOf EquivalentJS.Plugin
     * @type {Array.<Object>}
     */
    _.plugins = [];

    /**
     * @description initialize load handler for plugins
     * @memberOf EquivalentJS.Plugin
     */
    _.construct = function () {
        var configuration = EquivalentJS.System.getConfiguration();

        pluginsPath = configuration.modulePath + '/Plugin/';

        if (configuration.hasOwnProperty('plugins')) {
            register(configuration.plugins);
        }
    };

    /**
     * @description register plugins from configuration
     * @memberOf EquivalentJS.Plugin
     * @private
     * @param {Object} plugins the configuration of plugins
     * @tutorial MODULE_PLUGIN
     */
    var register = function (plugins) {
        $.each(plugins, function (name, enabled) {
            if (true === Boolean(enabled)) {
                var pluginPath = pluginsPath + name + '/plugin.json?' +
                    String((new Date()).getTime());

                $.getJSON(pluginPath).done(function (data) {
                    /**
                     * @type {{name: string, type: string, classPath: string, testPath: string}}
                     */
                    var pluginData = data;

                    if (typeof pluginData.type === 'string' && pluginData.name === String(name)) {
                        _.__manager__.add(pluginData.type, {
                            plugin: {
                                name: pluginData.name,
                                path: pluginData.classPath,
                                test: pluginData.testPath
                            }
                        }).done(function (module) {
                            var plugin = createPlugin(Boolean(enabled), module);

                            _.plugins.push(plugin);

                            /**
                             * @description fires to event if plugin is loaded ready into DIC
                             * @fires EquivalentJS.Plugin#ready:plugin
                             */
                            $(_).trigger('ready:plugin');
                        });
                    }
                }).fail(function (error) {
                    EquivalentJS.console.error(
                        (error.status || '0') + ' ' + (error.statusText || 'Error') +
                        ' - Could not load plugin "' + name + '"!'
                    );
                });
            }
        });
    };

    /**
     * @description create a plugin
     * @memberOf EquivalentJS.Plugin
     * @private
     * @param {boolean} enable indicates a loaded plugin is active
     * @param {EquivalentJS.Manager.Module.class} plugin as a module class
     * @returns {{enabled: boolean, class: EquivalentJS.Manager.Module.class}} a plugin
     */
    var createPlugin = function (enable, plugin) {
        return {
            "enabled": enable,
            "class": plugin
        };
    };
});
