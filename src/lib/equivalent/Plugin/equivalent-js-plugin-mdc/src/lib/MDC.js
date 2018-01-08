"use strict";

/** @module EquivalentJS/Plugin */
/** @module EquivalentJS/Plugin/MDC */

/**
 * @class
 * @classdesc material design component for web abstraction
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.Plugin.MDC
 * @constructs
 */
DIC.define('EquivalentJS.Plugin.MDC', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.Plugin.MDC
     * @private
     * @alias {EquivalentJS.Plugin.MDC}
     */
    var _ = this;

    /**
     * @description the mdc web interface
     * @memberOf EquivalentJS.Plugin.MDC
     * @private
     * @type {?{drawer: {MDCPersistentDrawer: MDCPersistentDrawer}}}
     */
    var mdc = null;

    /**
     * @description bind the mdc web interface to viewport mdc wrapper
     * @memberOf EquivalentJS.Plugin.MDC
     */
    _.construct = function () {
        if (Object(window).hasOwnProperty('mdc')) {
            mdc = window.mdc;
        }
    };

    /**
     * @description get a new {@link MDCPersistentDrawer} instance
     * @memberOf EquivalentJS.Plugin.MDC
     * @param {HTMLElement} drawerElement the DOM element
     * @returns {MDCPersistentDrawer}
     */
    _.createDrawer = function (drawerElement) {
        return new mdc.drawer.MDCPersistentDrawer(drawerElement);
    };
});
