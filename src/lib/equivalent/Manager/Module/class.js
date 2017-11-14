"use strict";

/** @module EquivalentJS/Manager/Module */

/**
 * @interface
 * @classdesc Module class interface representation
 * @typedef {Object} EquivalentJS.Manager.Module.class
 * @constructs
 * @tutorial MODULE_MANAGER
 * @see if the module class is initialized by DOM application
 *  the reference is appended to
 *  class property EquivalentJS.Manager.Module.class.__markup__
 */
EquivalentJS.define('EquivalentJS.Manager.Module.class', new function () {
    /**
     * @description indicates a layout stylesheet DOM is loaded
     *  if {@link EquivalentJS.Manager.Module.class.layout} is set true
     * @event EquivalentJS.Manager.Module.class#ready:layout
     */

    /**
     * @description indicates a template DOM is loaded
     *  if {@link EquivalentJS.Manager.Module.class.template} is set true
     * @event EquivalentJS.Manager.Module.class#ready:template
     */

    /**
     * @description bind public properties or methods from inner scope
     * @memberOf EquivalentJS.Manager.Module.class
     * @private
     * @alias {EquivalentJS.Manager.Module.class}
     * @example var _ = this;
     */
    var _ = this;

    /**
     * @description the manager assigns this property automatically
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {string} EquivalentJS.Manager.Module.class.type
     * @tutorial MODULE_MANAGER
     */
    _.type = 'EquivalentJS.Manager.Module.class';

    /**
     * @description extend from another module class;
     *  this property is optional
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {string} EquivalentJS.Manager.Module.class.extend
     */
    _.extend = 'EquivalentJS.Manager.Module.class';

    /**
     * @description bind a stylesheet on module;
     * if true then add sass css file to the corresponding module class folder;
     * the file name pattern is lowercase dash separated module class name parts
     * like MyNamespace/MyApp.js => MyNamespace/my-app.scss;
     * the stylesheet DOM link element get removed if
     * the module will be removed from DIC;
     * this property is optional
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {boolean} EquivalentJS.Manager.Module.class.layout
     * @see EquivalentJS.Manager.Module.class.__layout__ the css reference
     */
    _.layout = false;

    /**
     * @description bind a template on module;
     * if true then add markup fragment file to the corresponding module class folder;
     * the file name pattern is lowercase dash separated module class name parts
     * like MyNamespace/MyApp.js => MyNamespace/my-app.html;
     * the template DOM element get removed if
     * the module will be removed from DIC;
     * this property is optional
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {boolean} EquivalentJS.Manager.Module.class.template
     */
    _.template = false;

    /**
     * @description construct the module class;
     *  the method get destroyed by manager after module is loaded;
     *  this method is optional
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {function} EquivalentJS.Manager.Module.class.construct
     */
    _.construct = function () {};

    /**
     * @description the module class manager interface;
     *  the manager assigns this property automatically;
     *  the usage of this property is optional but better for
     *  test cases with mocked manager instance
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {EquivalentJS.Manager} EquivalentJS.Manager.Module.class.__manager__
     */
    _.__manager__ = {};

    /**
     * @description get the application DOM reference if module initialized from [data-application] attribute;
     *  the manager assigns this property automatically;
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {HTMLElement} EquivalentJS.Manager.Module.class.__markup__
     */
    _.__markup__ = {};

    /**
     * @description get the css reference if module layout is true;
     *  the manager assigns this property automatically;
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {HTMLLinkElement} EquivalentJS.Manager.Module.class.__layout__
     */
    _.__layout__ = {};

    /**
     * @description get the template reference if module template is true;
     *  the manager assigns this property automatically;
     * @memberOf EquivalentJS.Manager.Module.class
     * @typedef {jQuery} EquivalentJS.Manager.Module.class.__template__
     */
    _.__template__ = {};
});
