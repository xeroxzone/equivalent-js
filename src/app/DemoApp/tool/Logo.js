"use strict";

/** @module DemoApp/tool */

/**
 * @class
 * @classdesc demo app logo tool
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} DemoApp.tool.Logo
 * @constructs
 */
DIC.define('DemoApp.tool.Logo', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.tool.Logo
     * @private
     * @alias {DemoApp.tool.Logo}
     */
    var _ = this;

    /**
     * @description initialize logo
     * @memberOf DemoApp.tool.Logo
     */
    _.construct = function () {
        renderLogo();
    };

    /**
     * @description render logo
     * @memberOf DemoApp.tool.Logo
     * @private
     */
    var renderLogo = function () {
        var $logo = $('[data-application="DemoApp.tool.Logo"] .equivalent-js-logo');

        $logo.on('click', function () {
            $(this).toggleClass('animate');
        });
    };
});
