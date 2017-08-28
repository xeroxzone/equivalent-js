"use strict";

/** @module DemoApp/tool */

/**
 * @class
 * @classdesc demo app doc runner control tool
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} DemoApp.tool.Docs
 * @constructs
 */
DIC.define('DemoApp.tool.Docs', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.tool.Docs
     * @private
     * @alias {DemoApp.tool.Docs}
     */
    var _ = this;

    /**
     * @description initialize doc runner control
     * @memberOf DemoApp.tool.Docs
     */
    _.construct = function () {
        renderDocs();
    };

    /**
     * @description render documentation runner
     * @memberOf DemoApp.tool.Docs
     * @private
     */
    var renderDocs = function () {
        var $docRunner = $('[data-application="DemoApp.tool.Docs"]');

        $docRunner.removeClass('hidden');

        $docRunner.on('click', function () {
            location.search = 'docs';
        });
    };
});
