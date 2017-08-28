"use strict";

/**
 * @class
 * @classdesc a test mock to represent an existing module class
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.mock.ExistingModule
 * @constructs
 */
EquivalentJs.define('EquivalentJs.mock.ExistingModule', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.mock.ExistingModule
     * @private
     * @alias {EquivalentJs.mock.ExistingModule}
     */
    var _ = this;

    /**
     * @description test property foo
     * @memberOf EquivalentJs.mock.ExistingModule
     * @private
     * @type {Object}
     */
    var foo = {};

    /**
     * @description test set property foo.first
     * @memberOf EquivalentJs.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooFirst = function (bar) {
        foo.first = bar;

        return _;
    };

    /**
     * @description test set property foo.second
     * @memberOf EquivalentJs.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooSecond = function (bar) {
        foo.second = bar;

        return _;
    };

    /**
     * @description test set property foo.third
     * @memberOf EquivalentJs.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooThird = function (bar) {
        foo.third = bar;

        return _;
    };

    /**
     * @description test set property foo.fourth
     * @memberOf EquivalentJs.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooFourth = function (bar) {
        foo.fourth = bar;

        return _;
    };

    /**
     * @description test set property foo.fifth
     * @memberOf EquivalentJs.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooFifth = function (bar) {
        foo.fifth = bar;

        return _;
    };

    /**
     * @description get foo object
     * @memberOf EquivalentJs.mock.ExistingModule
     * @returns {Object}
     */
    _.getFoo = function () {
        return foo;
    };
});
