"use strict";

/** @module EquivalentJs/Manager */

/**
 * @interface
 * @classdesc Module class interface representation
 * @typedef {function} EquivalentJs.Manager.Module.class
 * @constructs
 * @tutorial MODULE-MANAGER
 * @see if the module class is initialized by DOM application
 *  the reference is appended to
 *  class property EquivalentJs.Manager.Module.class.__markup__
 */
EquivalentJs.define('EquivalentJs.Manager.Module.class', new function () {
    /**
     * @description bind public properties or methods from inner scope
     * @memberOf EquivalentJs.Manager.Module.class
     * @private
     * @alias {EquivalentJs.Manager.Module.class}
     * @example var _ = this;
     */
    var _ = this;

    /**
     * @description the manager assigns this property automatically
     * @memberOf EquivalentJs.Manager.Module.class
     * @type {string}
     * @typedef {string} EquivalentJs.Manager.Module.class.type
     * @tutorial MODULE-MANAGER
     */
    _.type = 'EquivalentJs.Manager.Module.class';

    /**
     * @description extend from another module class;
     *  this property is optional
     * @memberOf EquivalentJs.Manager.Module.class
     * @type {string}
     * @typedef {string} EquivalentJs.Manager.Module.class.extend
     */
    _.extend = 'EquivalentJs.Manager.Module.class';

    /**
     * @description bind a stylesheet on module;
     *  if true then add sass css file to ui library;
     *  this property is optional
     * @memberOf EquivalentJs.Manager.Module.class
     * @type {boolean}
     * @typedef {boolean} EquivalentJs.Manager.Module.class.layout
     * @see '/src/lib/ui/template/module.scss.template'
     * @see EquivalentJs.Manager.Module.class.__layout__ the css reference
     */
    _.layout = false;

    /**
     * @description construct the module class;
     *  the method get destroyed by manager after module is loaded;
     *  this method is optional
     * @memberOf EquivalentJs.Manager.Module.class
     * @typedef {function} EquivalentJs.Manager.Module.class.construct
     */
    _.construct = function () {};

    /**
     * @description the module class manager interface;
     *  the manager assigns this property automatically;
     *  the usage of this property is optional but better for
     *  test cases with mocked manager instance
     * @memberOf EquivalentJs.Manager.Module.class
     * @typedef {EquivalentJs.Manager} EquivalentJs.Manager.Module.class.__manager__
     */
    _.__manager__ = {};

    /**
     * @description get the css reference if module layout is true;
     *  the manager assigns this property automatically;
     * @memberOf EquivalentJs.Manager.Module.class
     * @typedef {HTMLLinkElement} EquivalentJs.Manager.Module.class.__layout__
     */
    _.__layout__ = {};

    /**
     * @description get the application DOM reference if module initialized from [data-application] attribute;
     *  the manager assigns this property automatically;
     * @memberOf EquivalentJs.Manager.Module.class
     * @typedef {HTMLElement} EquivalentJs.Manager.Module.class.__markup__
     */
    _.__markup__ = {};
});
