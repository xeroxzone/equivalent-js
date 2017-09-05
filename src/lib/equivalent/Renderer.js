"use strict";

/** @module EquivalentJS/Renderer */

/**
 * @class
 * @classdesc The renderer handles the display viewport for app views
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.Renderer
 * @constructs
 */
EquivalentJS.define('EquivalentJS.Renderer', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.Renderer
     * @private
     * @alias {EquivalentJS.Renderer}
     */
    var _ = this;

    /**
     * @description define append selector for display viewport
     * @memberOf EquivalentJS.Renderer
     * @private
     * @type {string}
     * @default
     */
    var displayViewport = 'body';

    /**
     * @description autoload stylesheet for display
     * @memberOf EquivalentJS.Renderer
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description the display is the initial target for the viewport
     * @memberOf EquivalentJS.Renderer
     * @type {EquivalentJS.Renderer.Display}
     */
    _.display = {};

    /**
     * @description initialize display
     * @memberOf EquivalentJS.Renderer
     * @requires module:EquivalentJS/Manager/App
     * @fires EquivalentJS.Manager.App#app:initialize
     */
    _.construct = function () {
        $(function () {
            $(EquivalentJS.Manager.App).trigger('app:initialize');
        });

        _.display = initDisplay();
    };

    /**
     * @description initialize the display viewport
     * @memberOf EquivalentJS.Renderer
     * @private
     * @returns {EquivalentJS.Renderer.Display}
     */
    var initDisplay = function () {
        /**
         * @typedef {Object} EquivalentJS.Renderer.Display
         */
        return $(displayViewport)
            .addClass('display')
            .show();
    };
});
