"use strict";

/**
 * @class
 * @classdesc a test mock to represent an abstract module class
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.mock.AbstractModule
 * @constructs
 */
EquivalentJS.define('EquivalentJS.mock.AbstractModule', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.mock.AbstractModule
     * @private
     * @alias {EquivalentJS.mock.AbstractModule}
     */
    var _ = this;

    /**
     * @description test a property
     * @memberOf EquivalentJS.mock.AbstractModule
     * @type {number}
     * @default
     */
    _.aProperty = 1;

    /**
     * @description test b property
     * @memberOf EquivalentJS.mock.AbstractModule
     * @type {number}
     * @default
     */
    _.bProperty = 1;
});
