"use strict";

/**
 * @class
 * @classdesc demo app b
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.B
 * @constructs
 */
DIC.define('DemoApp.B', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.B
     * @private
     * @alias {DemoApp.B}
     */
    var _ = this;

    /**
     * @description test a class
     * @memberOf DemoApp.B
     * @alias {?DemoApp.A}
     * @see DemoApp.A
     */
    var A = null;

    /**
     * @description test c class
     * @memberOf DemoApp.B
     * @alias {?DemoApp.C}
     * @see DemoApp.C
     */
    var C = null;

    /**
     * @description test d class
     * @memberOf DemoApp.B
     * @alias {?DemoApp.D}
     * @see DemoApp.D
     */
    var D = null;

    /**
     * @description test e class
     * @memberOf DemoApp.B
     * @alias {?DemoApp.E}
     * @see DemoApp.E
     */
    var E = null;

    /**
     * @description get dependent classes
     * @memberOf DemoApp.B
     */
    _.getDependencies = function () {
        return [A, C, D, E];
    };

    /**
     * @description construct the module class
     * @memberOf DemoApp.B
     */
    _.construct = function () {
        _.__manager__.ready('DemoApp.A', function (module) {
            A = module;
        });

        _.__manager__.ready('DemoApp.C', function (module) {
            C = module;
        });

        _.__manager__.ready('DemoApp.D', function (module) {
            D = module;
        });

        _.__manager__.ready('DemoApp.E', function (module) {
            E = module;
        });

        _.__manager__.add([
            'DemoApp.A',
            'DemoApp.C',
            'DemoApp.D',
            'DemoApp.E'
        ]).done(function () {
            $(_).trigger('done');
        });
    };
});
