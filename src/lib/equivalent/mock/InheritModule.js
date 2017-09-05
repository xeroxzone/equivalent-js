"use strict";

/**
 * @class
 * @classdesc a test mock to represent an inherited module class
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.mock.InheritModule
 * @constructs
 */
EquivalentJS.define('EquivalentJS.mock.InheritModule', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.mock.InheritModule
     * @private
     * @alias {EquivalentJS.mock.InheritModule}
     */
    var _ = this;

    /**
     * @description test extend abstract module
     * @memberOf EquivalentJS.mock.InheritModule
     * @type {string}
     */
    _.extend = 'EquivalentJS.mock.AbstractModule';

    /**
     * @description test b property
     * @memberOf EquivalentJS.mock.InheritModule
     * @type {number}
     * @default
     */
    _.bProperty = 2;
});
