"use strict";

/**
 * @class
 * @classdesc a test mock to represent an existing module class
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.mock.ExistingModule
 * @constructs
 */
EquivalentJS.define('EquivalentJS.mock.ExistingModule', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.mock.ExistingModule
     * @private
     * @alias {EquivalentJS.mock.ExistingModule}
     */
    var _ = this;

    /**
     * @description test property foo
     * @memberOf EquivalentJS.mock.ExistingModule
     * @private
     * @type {Object}
     */
    var foo = {};

    /**
     * @description test set property foo.first
     * @memberOf EquivalentJS.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooFirst = function (bar) {
        foo.first = bar;

        return _;
    };

    /**
     * @description test set property foo.second
     * @memberOf EquivalentJS.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooSecond = function (bar) {
        foo.second = bar;

        return _;
    };

    /**
     * @description test set property foo.third
     * @memberOf EquivalentJS.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooThird = function (bar) {
        foo.third = bar;

        return _;
    };

    /**
     * @description test set property foo.fourth
     * @memberOf EquivalentJS.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooFourth = function (bar) {
        foo.fourth = bar;

        return _;
    };

    /**
     * @description test set property foo.fifth
     * @memberOf EquivalentJS.mock.ExistingModule
     * @param {string} bar
     * @returns {this}
     */
    _.setFooFifth = function (bar) {
        foo.fifth = bar;

        return _;
    };

    /**
     * @description get foo object
     * @memberOf EquivalentJS.mock.ExistingModule
     * @returns {Object}
     */
    _.getFoo = function () {
        return foo;
    };
});
