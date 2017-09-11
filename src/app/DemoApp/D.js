"use strict";

/**
 * @class
 * @classdesc demo app d
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.D
 * @constructs
 */
DIC.define('DemoApp.D', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.D
     * @private
     * @alias {DemoApp.D}
     */
    var _ = this;

    /**
     * @description test a class
     * @memberOf DemoApp.D
     * @alias {?DemoApp.A}
     * @see DemoApp.A
     */
    var A = null;

    /**
     * @description test b class
     * @memberOf DemoApp.D
     * @alias {?DemoApp.B}
     * @see DemoApp.B
     */
    var B = null;

    /**
     * @description test c class
     * @memberOf DemoApp.D
     * @alias {?DemoApp.C}
     * @see DemoApp.C
     */
    var C = null;

    /**
     * @description test e class
     * @memberOf DemoApp.D
     * @alias {?DemoApp.E}
     * @see DemoApp.E
     */
    var E = null;

    /**
     * @description get dependent classes
     * @memberOf DemoApp.D
     */
    _.getDependencies = function () {
        return [A, B, C, E];
    };

    /**
     * @description construct the module class
     * @memberOf DemoApp.D
     */
    _.construct = function () {
        _.__manager__.ready('DemoApp.A', function (module) {
            A = module;
        });

        _.__manager__.ready('DemoApp.B', function (module) {
            B = module;
        });

        _.__manager__.ready('DemoApp.C', function (module) {
            C = module;
        });

        _.__manager__.ready('DemoApp.E', function (module) {
            E = module;
        });

        _.__manager__.add([
            'DemoApp.A',
            'DemoApp.B',
            'DemoApp.C',
            'DemoApp.E'
        ]).done(function () {
            $(_).trigger('done');
        });
    };
});
