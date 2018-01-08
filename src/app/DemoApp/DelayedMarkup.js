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
     * @description demo markup variable data
     * @memberOf DemoApp.DelayedMarkup
     * @type {{content_title: string, content_variable: string}}
     * @private
     */
    var data = {
        content_title: 'demo',
        content_variable: 'example'
    };

    /**
     * @description a demo counter to increase
     * @memberOf DemoApp.DelayedMarkup
     * @type {number}
     * @private
     */
    var counter = 0;

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
            _.__markup__ = $('[data-application="' + _.type + '"]').get(0);
        }

        $(_.__markup__).removeClass('hidden');

        renderContent();

        onUpdateContent();
    };

    /**
     * @description render content
     * @memberOf DemoApp.DelayedMarkup
     * @private
     */
    var renderContent = function () {
        $(_.__markup__).html(applyData(data));
    };

    /**
     * @description update content on button event
     * @memberOf DemoApp.DelayedMarkup
     * @private
     */
    var onUpdateContent = function() {
        $(_.__markup__).on('click', 'button.count-up', function () {
            if (10 <= counter) {
                counter = 0;
            }

            counter++;

            data.content_title = 'demo update';
            data.content_variable = 'count something ' + counter;

            $(_.__markup__).html(applyData(data));
        });
    };

    /**
     * @description apply data to content
     * @memberOf DemoApp.DelayedMarkup
     * @private
     * @param {Object} data apply to template
     * @returns {HTMLElement} the data applied variable content block
     */
    var applyData = function (data) {
        return _.__template__.getBlock('block-1', data);
    };
});
