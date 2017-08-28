"use strict";

/**
 * @class
 * @classdesc demo app e
 * @implements {EquivalentJs.Manager.Module.class}
 * @typedef {function} DemoApp.E
 * @constructs
 */
DIC.define('DemoApp.E', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.E
     * @private
     * @alias {DemoApp.E}
     */
    var _ = this;

    /**
     * @description test a class
     * @memberOf DemoApp.E
     * @alias {?DemoApp.A}
     * @see DemoApp.A
     */
    var A = null;

    /**
     * @description test b class
     * @memberOf DemoApp.E
     * @alias {?DemoApp.B}
     * @see DemoApp.B
     */
    var B = null;

    /**
     * @description test c class
     * @memberOf DemoApp.E
     * @alias {?DemoApp.C}
     * @see DemoApp.C
     */
    var C = null;

    /**
     * @description test d class
     * @memberOf DemoApp.E
     * @alias {?DemoApp.D}
     * @see DemoApp.D
     */
    var D = null;

    /**
     * @description get dependent classes
     * @memberOf DemoApp.E
     */
    _.getDependencies = function () {
        return [A, B, C, D];
    };

    /**
     * @description construct the module class
     * @memberOf DemoApp.E
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

        _.__manager__.ready('DemoApp.D', function (module) {
            D = module;
        });

        _.__manager__.add([
            'DemoApp.A',
            'DemoApp.B',
            'DemoApp.C',
            'DemoApp.D'
        ]).done(function () {
            $(_).trigger('done');
        });
    };
});
