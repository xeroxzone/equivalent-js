"use strict";

/** @module EquivalentJS/Manager */
/** @module EquivalentJS/Manager/Controller */

/**
 * @class
 * @classdesc The core controller to handle the viewport {@link EquivalentJS.Renderer}
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.Manager.Controller
 * @constructs
 */
EquivalentJS.define('EquivalentJS.Manager.Controller', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.Manager.Controller
     * @private
     * @alias {EquivalentJS.Manager.Controller}
     */
    var _ = this;

    /**
     * @description initialize renderer
     * @memberOf EquivalentJS.Manager.Controller
     * @requires module:EquivalentJS/Renderer
     */
    _.construct = function () {
        EquivalentJS.Manager.add('EquivalentJS.Renderer');
    };
});
