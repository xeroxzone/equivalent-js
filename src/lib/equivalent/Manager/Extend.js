"use strict";

/** @module EquivalentJs/Manager */
/** @module EquivalentJs/Manager/Extend */

/**
 * @class
 * @classdesc Extend a module by module {@link EquivalentJs.Manager~register} a module
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.Manager.Extend
 * @constructs
 */
EquivalentJs.define('EquivalentJs.Manager.Extend', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.Manager.Extend
     * @private
     * @alias {EquivalentJs.Manager.Extend}
     */
    var _ = this;

    /**
     * @description exclude this property or method names from inheritance
     * @memberOf EquivalentJs.Manager.Extend
     * @private
     * @type {Array}
     */
    var excludeProperties = ['construct', 'type', 'extend'];

    /**
     * @description inherit a module from another
     * @memberOf EquivalentJs.Manager.Extend
     * @param {EquivalentJs.Manager.Module.class} inheritClass the inherit class
     * @param {EquivalentJs.Manager.Module.class} moduleClass the parent class
     * @returns {EquivalentJs.Manager.Module.class}
     * @throws {Error} if module class is not an object
     */
    _.inherit = function (inheritClass, moduleClass) {
        if (typeof inheritClass === 'object' && typeof moduleClass === 'object') {
            $.each(moduleClass, function (property, mixed) {
                if (-1 === excludeProperties.indexOf(property) &&
                    !(property in inheritClass)
                ) {
                    inheritClass[property] = mixed;
                }
            });

            if (typeof moduleClass.construct !== 'undefined' &&
                typeof moduleClass.construct === 'function'
            ) {
                inheritClass.construct.parentClass = moduleClass.construct;

                delete moduleClass.construct;
            }
        } else {
            throw new Error('Could not extend module! Expected two <Object>\'s as module class to extend.');
        }

        return inheritClass;
    };
});
