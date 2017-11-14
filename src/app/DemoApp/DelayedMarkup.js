"use strict";

/** @module DemoApp/DelayedMarkup */

/**
 * @class
 * @classdesc delayed demo markup
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.DelayedMarkup
 * @constructs
 */
DIC.define('DemoApp.DelayedMarkup', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.DelayedMarkup
     * @private
     * @alias {DemoApp.DelayedMarkup}
     */
    var _ = this;

    /**
     * @description markup template
     * @memberOf DemoApp.DelayedMarkup
     * @type {boolean}
     */
    _.template = true;

    /**
     * @description construct the module class
     * @memberOf DemoApp.DelayedMarkup
     */
    _.construct = function () {
        $(_).on('ready:template', function () {
            createElements();
        });
    };

    /**
     * @description create elements
     * @memberOf DemoApp.DelayedMarkup
     * @private
     */
    var createElements = function () {
        if (typeof _.__markup__ === 'undefined') {
            _.__markup__ = $('[data-application="' + _.type + '"]');
        }

        $(_.__markup__).removeClass('hidden').html(_.__template__.getBlock('block-1', {
            content_variable: 'example'
        }));
    };
});
