"use strict";

/**
 * @class
 * @classdesc a test mock to represent an abstract module class
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.mock.AbstractModule
 * @constructs
 */
EquivalentJs.define('EquivalentJs.mock.AbstractModule', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.mock.AbstractModule
     * @private
     * @alias {EquivalentJs.mock.AbstractModule}
     */
    var _ = this;

    /**
     * @description test a property
     * @memberOf EquivalentJs.mock.AbstractModule
     * @type {number}
     * @default
     */
    _.aProperty = 1;

    /**
     * @description test b property
     * @memberOf EquivalentJs.mock.AbstractModule
     * @type {number}
     * @default
     */
    _.bProperty = 1;
});
