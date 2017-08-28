"use strict";

/**
 * @class
 * @classdesc a test mock to represent an inherited module class
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.mock.InheritModule
 * @constructs
 */
EquivalentJs.define('EquivalentJs.mock.InheritModule', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.mock.InheritModule
     * @private
     * @alias {EquivalentJs.mock.InheritModule}
     */
    var _ = this;

    /**
     * @description test extend abstract module
     * @memberOf EquivalentJs.mock.InheritModule
     * @type {string}
     */
    _.extend = 'EquivalentJs.mock.AbstractModule';

    /**
     * @description test b property
     * @memberOf EquivalentJs.mock.InheritModule
     * @type {number}
     * @default
     */
    _.bProperty = 2;
});
