"use strict";

/**
 * @class
 * @classdesc demo app c
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.C
 * @constructs
 */
DIC.define('DemoApp.C', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.C
     * @private
     * @alias {DemoApp.C}
     */
    var _ = this;

    /**
     * @description test a class
     * @memberOf DemoApp.C
     * @alias {?DemoApp.A}
     * @see DemoApp.A
     */
    var A = null;

    /**
     * @description test b class
     * @memberOf DemoApp.C
     * @alias {?DemoApp.B}
     * @see DemoApp.B
     */
    var B = null;

    /**
     * @description test d class
     * @memberOf DemoApp.C
     * @alias {?DemoApp.D}
     * @see DemoApp.D
     */
    var D = null;

    /**
     * @description test e class
     * @memberOf DemoApp.C
     * @alias {?DemoApp.E}
     * @see DemoApp.E
     */
    var E = null;

    /**
     * @description get dependent classes
     * @memberOf DemoApp.C
     */
    _.getDependencies = function () {
        return [A, B, D, E];
    };

    /**
     * @description construct the module class
     * @memberOf DemoApp.C
     */
    _.construct = function () {
        _.__manager__.ready('DemoApp.A', function (module) {
            A = module;
        });

        _.__manager__.ready('DemoApp.B', function (module) {
            B = module;
        });

        _.__manager__.ready('DemoApp.D', function (module) {
            D = module;
        });

        _.__manager__.ready('DemoApp.E', function (module) {
            E = module;
        });

        _.__manager__.add([
            'DemoApp.A',
            'DemoApp.B',
            'DemoApp.D',
            'DemoApp.E'
        ]).done(function () {
            $(_).trigger('done');
        });
    };
});
