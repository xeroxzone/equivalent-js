"use strict";

/** @module DemoApp/Viewport */

/**
 * @class
 * @classdesc demo app viewport handlers
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {function} DemoApp.Viewport
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
     * @description the material design components web interface
     * @memberOf DemoApp.Viewport
     * @private
     * @type {?{drawer: Object}}
     */
    var mdc = null;

    /**
     * @description the main menu element
     * @memberOf DemoApp.Viewport
     * @private
     * @type {?jQuery}
     */
    var $mainMenu = null;

    /**
     * @description initialize the viewport handlers
     * @memberOf DemoApp.Viewport
     */
    _.construct = function () {
        if (window.hasOwnProperty('mdc')) {
            mdc = window.mdc;
            $mainMenu = $('.main-menu');

            handlePersistentDrawerOnMainMenu();
        } else {
            EquivalentJS.console.error('Could not find design renderer!');
        }
    };

    /**
     * @description handle mdc persistent drawer on main menu
     * @memberOf DemoApp.Viewport
     * @private
     */
    var handlePersistentDrawerOnMainMenu = function () {
        var $drawerEl = $('.mdc-persistent-drawer'),
            MDCPersistentDrawer = mdc.drawer.MDCPersistentDrawer,
            drawer = new MDCPersistentDrawer($drawerEl.get(0))
        ;

        $mainMenu.on('click', function () {
            drawer.open = !drawer.open;
        });

        $drawerEl.on('MDCPersistentDrawer:open', function() {
            $mainMenu
                .removeClass('out')
                .addClass('over')
                .html('close')
            ;
        });

        $drawerEl.on('MDCPersistentDrawer:close', function() {
            $mainMenu
                .removeClass('over')
                .addClass('out')
                .html('menu')
            ;
        });
    };
});
