"use strict";

/** @module DemoApp/DependEvent */

/**
 * @class
 * @classdesc an application demo with an event dependency
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.DependEvent
 * @constructs
 */
DIC.define('DemoApp.DependEvent', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.DependEvent
     * @private
     * @alias {DemoApp.DependEvent}
     */
    var _ = this;

    /**
     * @description the markup class
     * @memberOf DemoApp.DependEvent
     * @private
     * @alias {DemoApp.DependEvent.Markup}
     * @see DemoApp.DependEvent.Markup
     */
    var Markup;

    /**
     * @description autoload stylesheet for display
     * @memberOf DemoApp.DependEvent
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description the application demo DOM
     * @memberOf DemoApp.DependEvent
     * @type {?jQuery}
     */
    _.$demo = null;

    /**
     * @description initialize application demo
     * @memberOf DemoApp.DependEvent
     * @requires module:DemoApp/DependEvent/Markup
     */
    _.construct = function () {
        _.__manager__
            .ready('DemoApp.DependEvent.Markup', function (module) {
                Markup = module;

                _.$demo = $(_.__markup__);

                renderDemo();
            });
    };

    /**
     * @description render demo
     * @memberOf DemoApp.DependEvent
     * @private
     */
    var renderDemo = function () {
        Markup.wrapMarkup(_.$demo);

        var color = 1,
            interval = 0,
            render = function () {
                if (null !== _.$demo) {
                    _.$demo.find('h1').prop('class', 'color-event-' + color);

                    if (interval > 0) {return;}
                    interval = setTimeout(function () {
                        $(_).trigger('interval');
                    }, 1000);

                    color++;

                    if (5 < color) {
                        color = 1;
                    }
                }
            };

        $(_).on('interval', function () {
            clearTimeout(interval);
            interval = 0;

            if (false === _.__manager__
                    .has(_.type)
            ) {
                _.__manager__
                    .remove('DemoApp.DependEvent.Markup');
            } else if (true === _.__manager__
                    .has('DemoApp.DependEvent.Markup')
            ) {
                render();
            }
        });

        render();
    };
});
