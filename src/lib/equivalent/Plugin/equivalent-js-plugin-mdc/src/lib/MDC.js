"use strict";

/** @module EquivalentJS/Plugin */
/** @module EquivalentJS/Plugin/MDC */

/**
 * @class
 * @classdesc an example scaffold for an equivalent-js plugin
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
     * @description autoload a stylesheet
     * @memberOf EquivalentJS.Plugin.MDC
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description construct the plugin module class
     * @memberOf EquivalentJS.Plugin.MDC
     */
    _.construct = function () {

    };
});
