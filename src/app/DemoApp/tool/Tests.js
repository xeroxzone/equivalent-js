"use strict";

/** @module DemoApp/tool */

/**
 * @class
 * @classdesc demo app test runner control tool
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {function} DemoApp.tool.Tests
 * @constructs
 */
DIC.define('DemoApp.tool.Tests', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.tool.Tests
     * @private
     * @alias {DemoApp.tool.Tests}
     */
    var _ = this;

    /**
     * @description initialize test runner control
     * @memberOf DemoApp.tool.Tests
     */
    _.construct = function () {
        renderTests();
    };

    /**
     * @description render test runner
     * @memberOf DemoApp.tool.Tests
     * @private
     */
    var renderTests = function () {
        var $testRunner = $('[data-application="DemoApp.tool.Tests"]');

        $testRunner.removeClass('hidden');

        $testRunner.on('click', function () {
            location.search = 'tests';
        });
    };
});
