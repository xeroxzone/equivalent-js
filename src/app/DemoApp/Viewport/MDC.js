"use strict";

/** @module DemoApp/Viewport */
/** @module DemoApp/Viewport/MDC */

/**
 * @class
 * @classdesc the viewport mdc wrapper
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.Viewport.MDC
 * @constructs
 */
DIC.define('DemoApp.Viewport.MDC', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.Viewport.MDC
     * @private
     * @alias {DemoApp.Viewport.MDC}
     */
    var _ = this;

    /**
     * @description the mdc web interface
     * @memberOf DemoApp.Viewport.MDC
     * @private
     * @type {?{drawer: {MDCPersistentDrawer: MDCPersistentDrawer}}}
     */
    var mdc = null;

    /**
     * @description bind the mdc web interface to viewport mdc wrapper
     * @memberOf DemoApp.Viewport.MDC
     */
    _.construct = function () {
        if (Object(window).hasOwnProperty('mdc')) {
            mdc = window.mdc;
        }
    };

    /**
     * @description get a new {@link MDCPersistentDrawer} instance
     * @memberOf DemoApp.Viewport.MDC
     * @param {HTMLElement} drawerElement the DOM element
     * @returns {MDCPersistentDrawer}
     */
    _.createDrawer = function (drawerElement) {
        return new mdc.drawer.MDCPersistentDrawer(drawerElement);
    };
});
