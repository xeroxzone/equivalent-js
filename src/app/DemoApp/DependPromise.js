"use strict";

/** @module DemoApp/DependPromise */

/**
 * @class
 * @classdesc an application demo with a promise dependency
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} DemoApp.DependPromise
 * @constructs
 */
DIC.define('DemoApp.DependPromise', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.DependPromise
     * @private
     * @alias {DemoApp.DependPromise}
     */
    var _ = this;

    /**
     * @description the markup class
     * @memberOf DemoApp.DependPromise
     * @private
     * @alias {DemoApp.DependPromise.Markup}
     * @see DemoApp.DependPromise.Markup
     */
    var Markup;

    /**
     * @description autoload stylesheet for display
     * @memberOf DemoApp.DependPromise
     * @type {boolean}
     */
    _.layout = true;

    /**
     * @description initialize application demo
     * @memberOf DemoApp.DependPromise
     * @requires module:DemoApp/DependPromise/Markup
     */
    _.construct = function () {
        _.__manager__
            .add('DemoApp.DependPromise.Markup')
            .done(function (module) {
                Markup = module;

                renderDemo();
            })
            .fail(function () {
                EquivalentJs.console.error(
                    'Could not load dependency "DemoApp.DependPromise.Markup"'
                );
            });
    };

    /**
     * @description render demo
     * @memberOf DemoApp.DependPromise
     * @private
     */
    var renderDemo = function () {
        var $demo = $(_.__markup__);

        Markup.wrapMarkup($demo);

        var color = 1,
            interval = 0,
            render = function () {
                if (null !== _.$demo) {
                    $demo.find('h1').prop('class', 'color-promise-' + color);

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

            if (true === _.__manager__.has(_.type)) {
                render();
            } else {
                _.__manager__
                    .remove('DemoApp.DependPromise.Markup');
            }
        });

        render();
    };
});
