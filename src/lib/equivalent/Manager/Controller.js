"use strict";

/** @module EquivalentJs/Manager */
/** @module EquivalentJs/Manager/Controller */

/**
 * @class
 * @classdesc The core controller to handle the viewport {@link EquivalentJs.Renderer}
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.Manager.Controller
 * @constructs
 */
EquivalentJs.define('EquivalentJs.Manager.Controller', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.Manager.Controller
     * @private
     * @alias {EquivalentJs.Manager.Controller}
     */
    var _ = this;

    /**
     * @description initialize renderer
     * @memberOf EquivalentJs.Manager.Controller
     * @requires module:EquivalentJs/Renderer
     */
    _.construct = function () {
        EquivalentJs.Manager.add('EquivalentJs.Renderer');
    };
});
