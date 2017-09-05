"use strict";

/** @module DemoApp/tool */

/**
 * @class
 * @classdesc demo app date time tool
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.tool.DateTime
 * @constructs
 */
DIC.define('DemoApp.tool.DateTime', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.tool.DateTime
     * @private
     * @alias {DemoApp.tool.DateTime}
     */
    var _ = this;

    /**
     * @description autoload stylesheet for display
     * @memberOf DemoApp.tool.DateTime
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description initialize date time renderer
     * @memberOf DemoApp.tool.DateTime
     */
    _.construct = function () {
        renderDateTime();
    };

    /**
     * @description render local date time string
     * @memberOf DemoApp.tool.DateTime
     * @private
     */
    var renderDateTime = function () {
        var $dateTimeDisplay = $('[data-application="DemoApp.tool.DateTime"]');

        var interval = 0,
            render = function () {
            $dateTimeDisplay.html('<span class="date-time">' + (new Date()).toLocaleString() + '</span>');

            if (interval > 0) {return;}
            interval = setTimeout(function () {
                $(_).trigger('interval');
            }, 1000);
        };

        $(_).on('interval', function () {
            clearTimeout(interval);
            interval = 0;

            if (true === DIC.has(_.type)) {
                render();
            }
        });

        render();
    };
});
