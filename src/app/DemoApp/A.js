"use strict";

/**
 * @class
 * @classdesc demo app a
 * @implements {EquivalentJS.Manager.Module.class}
 * @typedef {Object} DemoApp.A
 * @constructs
 */
DIC.define('DemoApp.A', new function () {
    /**
     * @description bind public properties or methods
     * @memberOf DemoApp.A
     * @private
     * @alias {DemoApp.A}
     */
    var _ = this;

    /**
     * @description test b class
     * @memberOf DemoApp.A
     * @alias {?DemoApp.B}
     * @see DemoApp.B
     */
    var B = null;

    /**
     * @description test c class
     * @memberOf DemoApp.A
     * @alias {?DemoApp.C}
     * @see DemoApp.C
     */
    var C = null;

    /**
     * @description test d class
     * @memberOf DemoApp.A
     * @alias {?DemoApp.D}
     * @see DemoApp.D
     */
    var D = null;

    /**
     * @description test e class
     * @memberOf DemoApp.A
     * @alias {?DemoApp.E}
     * @see DemoApp.E
     */
    var E = null;

    /**
     * @description get dependent classes
     * @memberOf DemoApp.A
     */
    _.getDependencies = function () {
        return [B, C, D, E];
    };

    /**
     * @description construct the module class
     * @memberOf DemoApp.A
     */
    _.construct = function () {
        _.__manager__.ready('DemoApp.B', function (module) {
            B = module;
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
            'DemoApp.B',
            'DemoApp.C',
            'DemoApp.D',
            'DemoApp.E'
        ]).done(function () {
            $(_).trigger('done');
        });
    };
});
