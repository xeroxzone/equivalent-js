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
     * @description markup element
     * @memberOf DemoApp.DelayedMarkup
     * @type {?jQuery}
     */
    _.$markup = null;

    /**
     * @description construct the module class
     * @memberOf DemoApp.DelayedMarkup
     */
    _.construct = function () {
        _.$markup = $('[data-application="DemoApp.DelayedMarkup"]');

        createElements();
    };

    /**
     * @description create elements
     * @memberOf DemoApp.DelayedMarkup
     * @private
     */
    var createElements = function () {
        var $elements = $('<ul/>'),
            $first = $('<li/>').text('first'),
            $second = $('<li/>').text('second')
        ;

        $elements.append($first, $second);

        var $defer = $.Deferred()
            .done(function () {
                _.$markup.append($elements);
            });

        setTimeout(function () {
            $defer.resolve();
        }, 2048);
    };
});
