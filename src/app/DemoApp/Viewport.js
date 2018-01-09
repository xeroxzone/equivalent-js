"use strict";

/** @module DemoApp/Viewport */

/**
 * @class
 * @classdesc demo app viewport handlers
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.Viewport
 * @constructs
 */
DIC.define('DemoApp.Viewport', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.Viewport
     * @private
     * @alias {DemoApp.Viewport}
     */
    var _ = this;

    /**
     * @description the mdc web interface wrapper
     * @memberOf DemoApp.Viewport
     * @alias {?EquivalentJS.Plugin.MDC}
     * @see EquivalentJS.Plugin.MDC
     */
    var MDC = null;

    /**
     * @description the main menu element
     * @memberOf DemoApp.Viewport
     * @private
     * @type {?jQuery}
     */
    var $mainMenu = null;

    /**
     * @description autoload stylesheet for display
     * @memberOf DemoApp.Viewport
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description initialize the viewport handlers
     * @memberOf DemoApp.Viewport
     */
    _.construct = function () {
        $mainMenu = $('.main-menu');

        _.__manager__.ready('EquivalentJS.Plugin.MDC', function (module) {
            MDC = module;

            handlePersistentDrawerOnMainMenu();
        });
    };

    /**
     * @description handle mdc persistent drawer on main menu
     * @memberOf DemoApp.Viewport
     * @private
     */
    var handlePersistentDrawerOnMainMenu = function () {
        var $drawerElement = $('.mdc-drawer'),
            drawer = MDC.createDrawer($drawerElement.get(0))
        ;

        $mainMenu.on('click', function () {
            drawer.open = !drawer.open;
        });

        $drawerElement.on('MDCPersistentDrawer:open', function() {
            $mainMenu
                .removeClass('out')
                .addClass('over')
                .html('close')
            ;
        });

        $drawerElement.on('MDCPersistentDrawer:close', function() {
            $mainMenu
                .removeClass('over')
                .addClass('out')
                .html('menu')
            ;
        });
    };
});
