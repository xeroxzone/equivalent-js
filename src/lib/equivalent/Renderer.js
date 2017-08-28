"use strict";

/** @module EquivalentJs/Renderer */

/**
 * @class
 * @classdesc The renderer handles the display viewport for app views
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.Renderer
 * @constructs
 */
EquivalentJs.define('EquivalentJs.Renderer', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.Renderer
     * @private
     * @alias {EquivalentJs.Renderer}
     */
    var _ = this;

    /**
     * @description define append selector for display viewport
     * @memberOf EquivalentJs.Renderer
     * @private
     * @type {string}
     * @default
     */
    var displayViewport = 'body';

    /**
     * @description autoload stylesheet for display
     * @memberOf EquivalentJs.Renderer
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description the display is the initial target for the viewport
     * @memberOf EquivalentJs.Renderer
     * @type {EquivalentJs.Renderer.Display}
     */
    _.display = {};

    /**
     * @description initialize display
     * @memberOf EquivalentJs.Renderer
     * @requires module:EquivalentJs/Manager/App
     * @fires EquivalentJs.Manager.App#app:initialize
     */
    _.construct = function () {
        $(function () {
            $(EquivalentJs.Manager.App).trigger('app:initialize');
        });

        _.display = initDisplay();
    };

    /**
     * @description initialize the display viewport
     * @memberOf EquivalentJs.Renderer
     * @private
     * @returns {EquivalentJs.Renderer.Display}
     */
    var initDisplay = function () {
        /**
         * @typedef {Object} EquivalentJs.Renderer.Display
         */
        return $(displayViewport)
            .addClass('display')
            .show();
    };
});
