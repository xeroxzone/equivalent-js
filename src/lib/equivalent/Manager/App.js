"use strict";

/** @module EquivalentJS/Manager */
/** @module EquivalentJS/Manager/App */

/**
 * @class
 * @classdesc The core app loader to load apps into DIC by
 *  the module {@link EquivalentJS.Manager}
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} EquivalentJS.Manager.App
 * @constructs
 */
EquivalentJS.define('EquivalentJS.Manager.App', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJS.Manager.App
     * @private
     * @alias {EquivalentJS.Manager.App}
     */
    var _ = this;

    /**
     * @description holds jQuery collection of app selectors
     * @memberOf EquivalentJS.Manager.App
     * @type {?jQuery}
     */
    var $apps = null;

    /**
     * @description stored app views; the DOM representations
     *  of the app module classes
     * @memberOf EquivalentJS.Manager.App
     * @type {Array.<HTMLElement>}
     */
    _.collection = [];

    /**
     * @description initialize all described apps on view;
     *  this event is the point where core modules and
     *  their dependencies are done and from now on only
     *  app modules will add dependencies to DIC
     *  {@link EquivalentJS.Manager.modules}
     * @memberOf EquivalentJS.Manager.App
     * @event EquivalentJS.Manager.App#app:initialize
     */
    _.construct = function () {
        $(_).on('app:initialize', function () {
            $apps = $('[data-application]');

            initialize();
        });
    };

    /**
     * @description initialize app modules and reference module
     *  class to DOM application
     * @memberOf EquivalentJS.Manager.App
     * @private
     */
    var initialize = function () {
        $apps.each(function () {
            var $app = $(this),
                parameters = $app.data('parameters'),
                appModule = $app.data('application')
            ;

            if (false === EquivalentJS.Manager.has(appModule)) {
                _.collection.push(this);

                EquivalentJS.Manager.add(appModule, {
                    app: this,
                    data: parameters
                }).done(function () {
                    /**
                     * @description each [data-application] attribute selector got appended
                     *  a property <HTMLElement>.__class__ to access
                     *  the module class {@link EquivalentJS.Manager.Module.class}
                     *  by reference from DOM
                     */
                    $app.prop('__class__', EquivalentJS.Manager.get(appModule).class);
                });
            }
        });
    };
});
