"use strict";

/** @module EquivalentJs/Manager */
/** @module EquivalentJs/Manager/App */

/**
 * @class
 * @classdesc The core app loader to load apps into DIC by
 *  the module {@link EquivalentJs.Manager}
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} EquivalentJs.Manager.App
 * @constructs
 */
EquivalentJs.define('EquivalentJs.Manager.App', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf EquivalentJs.Manager.App
     * @private
     * @alias {EquivalentJs.Manager.App}
     */
    var _ = this;

    /**
     * @description holds jQuery collection of app selectors
     * @memberOf EquivalentJs.Manager.App
     * @type {?jQuery}
     */
    var $apps = null;

    /**
     * @description stored app views; the DOM representations
     *  of the app module classes
     * @memberOf EquivalentJs.Manager.App
     * @type {Array.<HTMLElement>}
     */
    _.collection = [];

    /**
     * @description initialize all described apps on view;
     *  this event is the point where core modules and
     *  their dependencies are done and from now on only
     *  app modules will add dependencies to DIC
     *  {@link EquivalentJs.Manager.modules}
     * @memberOf EquivalentJs.Manager.App
     * @event EquivalentJs.Manager.App#app:initialize
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
     * @memberOf EquivalentJs.Manager.App
     * @private
     */
    var initialize = function () {
        $apps.each(function () {
            var $app = $(this),
                parameters = $app.data('parameters'),
                appModule = $app.data('application')
            ;

            _.collection.push(this);

            EquivalentJs.Manager.add(appModule, {
                app: this,
                data: parameters
            }).done(function () {
                /**
                 * @description each [data-application] attribute selector got appended
                 *  a property <HTMLElement>.__class__ to access
                 *  the module class {@link EquivalentJs.Manager.Module.class}
                 *  by reference from DOM
                 */
                $app.prop('__class__', EquivalentJs.Manager.get(appModule).class);
            });
        });
    };
});
